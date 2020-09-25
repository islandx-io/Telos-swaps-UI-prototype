import axios, { AxiosResponse } from "axios";
import { vxm } from "@/store";
import { JsonRpc } from "eosjs";
import Onboard from "bnc-onboard";

import {
  Asset,
  asset_to_number,
  Sym,
  number_to_asset
} from "eos-common";
import { rpc } from "./rpc";
import {
  TokenBalances,
  EosMultiRelay,
  TokenMeta,
  BaseToken,
  TokenBalanceReturn,
  TokenBalanceParam,
  Section,
  Step,
  OnUpdate
} from "@/types/bancor";
import Web3 from "web3";
import { EosTransitModule } from "@/store/modules/wallet/eosWallet";
import wait from "waait";
import { sortByNetworkTokens } from "./sortByNetworkTokens";

export const networkTokens = ["TLOS"];

export const isOdd = (num: number) => num % 2 == 1;

interface TaskItem {
  description: string;
  task: (state?: any) => Promise<any>;
}

export const multiSteps = async ({
  items,
  onUpdate
}: {
  items: TaskItem[];
  onUpdate?: OnUpdate;
}) => {
  let state: any = {};
  for (const todo in items) {
    let steps = items.map(
      (todo, index): Step => ({
        name: String(index),
        description: todo.description
      })
    );
    if (typeof onUpdate == "function") {
      onUpdate(Number(todo), steps);
    } else if (typeof onUpdate !== "undefined") {
      throw new Error("onUpdate should be either a function or undefined");
    }

    let newState = await items[todo].task(state);
    if (typeof newState !== "undefined") {
      state = newState;
    }
  }
  return state;
};

const eosRpc: JsonRpc = rpc;

interface TraditionalStat {
  supply: Asset;
  max_supply: Asset;
}

export const getSxContracts = async () => {
  const res = (await rpc.get_table_rows({
    code: "config.swaps",
    table: "swap",
    scope: "config.swaps"
  })) as {
    rows: {
      contract: string;
      ext_tokens: { sym: string; contract: string }[];
    }[];
  };
  return res.rows.map(set => ({
    contract: set.contract,
    tokens: set.ext_tokens.map(token => ({
      contract: token.contract,
      symbol: new Sym(token.sym).code().to_string()
    }))
  }));
};

export const findOrThrow = <T>(
  arr: T[],
  iteratee: (obj: T, index: number, arr: T[]) => unknown,
  message?: string
) => {
  const res = arr.find(iteratee);
  if (!res)
    throw new Error(message || "Failed to find object in find or throw");
  return res;
};

export const compareToken = (
  a: TokenBalanceParam | TokenBalanceReturn | BaseToken,
  b: TokenBalanceParam | TokenBalanceReturn | BaseToken
): boolean =>
  compareString(a.contract, b.contract) && compareString(a.symbol, b.symbol);

export const compareString = (stringOne: string, stringTwo: string) => {
  const strings = [stringOne, stringTwo];
  if (!strings.every(str => typeof str == "string"))
    throw new Error(
      `String one: ${stringOne} String two: ${stringTwo} one of them are falsy or not a string`
    );
  return stringOne.toLowerCase() == stringTwo.toLowerCase();
};

// https://api.coingecko.com/api/v3/simple/price?ids=telos&vs_currencies=usd
// {"telos":{"usd":0.02797187}}
export const fetchCoinGechoUsdPriceOfTlos = async (): Promise<number> => {
  const res = await axios.get<{ telos: { usd: string } }>(
    "https://api.coingecko.com/api/v3/simple/price?ids=telos&vs_currencies=usd"
  );
  return Number(res.data.telos.usd);
};

export const updateArray = <T>(
  arr: T[],
  conditioner: (element: T) => boolean,
  updater: (element: T) => T
) => arr.map(element => (conditioner(element) ? updater(element) : element));

export type Wei = string | number;
export type Ether = string | number;

export let web3 = new Web3(
  "https://mainnet.infura.io/v3/da059c364a2f4e6eb89bfd89600bce07"
);

export const selectedWeb3Wallet = "SELECTED_WEB3_WALLET";

export const onboard = Onboard({
  dappId: process.env.VUE_APP_BLOCKNATIVE,
  networkId: 1,
  hideBranding: true,
  subscriptions: {
    address: address => {
      vxm.ethWallet.accountChange(address);
    },
    balance: balance => vxm.ethWallet.nativeBalanceChange(balance),
    wallet: wallet => {
      if (wallet.name) {
        localStorage.setItem(selectedWeb3Wallet, wallet.name);
      }
      web3 = new Web3(wallet.provider);
    }
  }
});

export const fetchReserveBalance = async (
  converterContract: any,
  reserveTokenAddress: string,
  versionNumber: number | string
): Promise<string> => {
  try {
    const res = await converterContract.methods[
      Number(versionNumber) >= 17 ? "getConnectorBalance" : "getReserveBalance"
    ](reserveTokenAddress).call();
    return res;
  } catch (e) {
    try {
      const res = await converterContract.methods[
        Number(versionNumber) >= 17
          ? "getReserveBalance"
          : "getConnectorBalance"
      ](reserveTokenAddress).call();
      return res;
    } catch (e) {
      throw new Error("Failed getting reserve balance" + e);
    }
  }
};

export const fetchTokenSymbol = async (
  contractName: string,
  symbolName: string
): Promise<Sym> => {
  const statRes: {
    rows: { supply: string; max_supply: string; issuer: string }[];
  } = await rpc.get_table_rows({
    code: contractName,
    scope: symbolName,
    table: "stat"
  });
  if (statRes.rows.length == 0)
    throw new Error(
      `Unexpected stats table return from tokenContract ${contractName} ${symbolName}`
    );
  const maxSupplyAssetString = statRes.rows[0].max_supply;
  const maxSupplyAsset = new Asset(maxSupplyAssetString);
  return maxSupplyAsset.symbol;
};

export const getBalance = async (
  contract: string,
  symbolName: string,
  precision?: number
): Promise<string> => {
  const account = isAuthenticatedViaModule(vxm.eosWallet);
  const res: { rows: { balance: string }[] } = await rpc.get_table_rows({
    code: contract,
    scope: account,
    table: "accounts",
    limit: 99
  });
  console.log("getBalance : (", contract, ", ", symbolName, ")");
  const balance = res.rows.find(balance =>
    compareString(
      new Asset(balance.balance).symbol.code().to_string(),
      symbolName
    )
  );

  if (!balance) {
    if (typeof precision == "number") {
      return number_to_asset(0, new Sym(symbolName, precision)).to_string();
    } else {
      const symbol = await fetchTokenSymbol(contract, symbolName);
      return number_to_asset(0, symbol).to_string();
    }
  }
  return balance.balance;
};

export const fetchTokenStats = async (
  contract: string,
  symbol: string
): Promise<TraditionalStat> => {
  const tableResult = await eosRpc.get_table_rows({
    code: contract,
    table: "stat",
    scope: symbol,
    limit: 1
  });
  const tokenExists = tableResult.rows.length > 0;
  if (!tokenExists) throw new Error("Token does not exist");
  const { supply, max_supply } = tableResult.rows[0];
  return {
    supply: new Asset(supply),
    max_supply: new Asset(max_supply)
  };
};

export const retryPromise = async <T>(
  promise: () => Promise<T>,
  maxAttempts = 10,
  interval = 1000
): Promise<T> => {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        return resolve(await promise());
      } catch (e) {
        await wait(interval);
        if (i == maxAttempts) reject(e);
      }
    }
  });
};
const isValidBalance = (data: any): boolean =>
  typeof data.contract == "string" &&
  typeof data.symbol == "string" &&
  data.contract.length > 0 &&
  data.symbol.length > 0;

export const getTokenBalances = async (
  accountName: string
): Promise<TokenBalances> => {
  const res = await axios.get<TokenBalances>(
    `https://telos.caleos.io/v2/state/get_tokens?account=${accountName}`
//    `https://telos.eosphere.io/v2/state/get_tokens?account=${accountName}`
  );
  return {
    ...res.data,
    tokens: res.data.tokens.filter(isValidBalance)
  };
};

export const identifyVersionBySha3ByteCodeHash = (sha3Hash: string): string => {
  if (
    sha3Hash ==
    "0xf0a5de528f6d887b14706f0e66b20bee0d4c81078b6de9f395250e287e09e55f"
  )
    return "11";
  throw new Error("Failed to identify version of Pool");
};

export type EosAccount = string;
export type ContractAccount = EosAccount;

export interface Token {
  symbol: string;
  contract: string;
  decimals: number;
  network: string;
}

export interface Relay {
  id: string;
  reserves: Token[];
  smartToken: Token;
  contract: ContractAccount;
  isMultiContract: boolean;
  fee: number;
  network: string;
  version: string;
  converterType?: number;
  owner: string;
}

const isAuthenticatedViaModule = (module: EosTransitModule) => {
  const isAuthenticated =
    module.wallet && module.wallet.auth && module.wallet.auth.accountName;
  if (!isAuthenticated) throw new Error("Not logged in");
  return isAuthenticated;
};

export const getBankBalance = async (): Promise<{
  id: number;
  quantity: string;
  symbl: string;
}[]> => {
  const account = isAuthenticatedViaModule(vxm.eosWallet);
  const res: {
    rows: {
      id: number;
      quantity: string;
      symbl: string;
    }[];
  } = await rpc.get_table_rows({
    code: process.env.VUE_APP_MULTICONTRACT!,
    scope: account,
    table: "accounts"
  })!;
  return res.rows;
};

export enum Feature {
  Trade,
  Wallet,
  Liquidity,
  CreatePool
}

export interface Service {
  namespace: string;
  features: Feature[];
}

export const services: Service[] = [
  {
    namespace: "eos",
    features: [
      Feature.Trade,
      Feature.Liquidity,
      Feature.Wallet
//      Feature.CreatePool
    ]
  },
  { namespace: "usds", features: [
      Feature.Trade,
      Feature.Wallet
    ]
  }
];

export interface ReserveTableRow {
  contract: string;
  ratio: number;
  balance: string;
}

export interface SettingTableRow {
  currency: string;
  owner: string;
  stake_enabled: boolean;
  fee: number;
}

export interface ConverterV2Row {
  currency: string;
  fee: number;
  metadata_json: string[];
  owner: string;
  protocol_features: string[];
  reserve_balances: {
    key: string;
    value: {
      quantity: string;
      contract: string;
    };
  }[];
  reserve_weights: {
    key: string;
    value: number;
  }[];
}

interface BaseSymbol {
  symbol: string;
  precision: number;
}

const symToBaseSymbol = (symbol: Sym): BaseSymbol => ({
  symbol: symbol.code().to_string(),
  precision: symbol.precision()
});

const assetStringtoBaseSymbol = (assetString: string): BaseSymbol => {
  const asset = new Asset(assetString);
  return symToBaseSymbol(asset.symbol);
};

export const buildTokenId = ({ contract, symbol }: BaseToken): string =>
  contract + "-" + symbol;

export const fetchMultiRelays = async (): Promise<EosMultiRelay[]> => {
  return [];
};

export const fetchMultiRelay = async (
  smartTokenSymbol: string
): Promise<EosMultiRelay> => {
  const relays = await fetchMultiRelays();
  const relay = findOrThrow(
    relays,
    relay => compareString(relay.smartToken.symbol, smartTokenSymbol),
    `failed to find multi relay with smart token symbol of ${smartTokenSymbol}`
  );
  return {
    ...relay,
    reserves: sortByNetworkTokens(relay.reserves, reserve => reserve.symbol, [
      "TLOS"
    ])
  };
};

const tokenMetaDataEndpoint =
  "https://raw.githubusercontent.com/EOSZAio/TLOSD/master/tokens.json";

export const getTokenMeta = async (): Promise<TokenMeta[]> => {
  const res: AxiosResponse<TokenMeta[]> = await axios.get(
    tokenMetaDataEndpoint
  );

  console.log([...res.data]);

//  return [...res.data, ...hardCoded()]
  return [...res.data]
    .filter(token => compareString(token.chain, "eos"))
    .map(token => ({
      ...token,
      id: buildTokenId({ contract: token.account, symbol: token.symbol })
    }));
};

export interface TickerPrice {
  "15m": number;
  last: number;
  buy: number;
  sell: number;
  symbol: string;
}

export const fetchTradeData = async (): Promise<any> => {
  const rawTradeData = await eosRpc.get_table_rows({
    code: "data.tbn",
    table: "tradedata",
    scope: "data.tbn",
    limit: 100
  });
  console.log("tableResult : ", rawTradeData);

  const dataExists = rawTradeData.rows.length > 0;
  if (!dataExists) throw new Error("Trade data not found");

  const parsedTradeData = rawTradeData.rows;
  console.log("parsedTradeData : ", parsedTradeData);

/*
Sample record

{ converter: "bnt.swaps"
  timestamp: "2020-09-22T10:31:47",
  volume_24h: [{key: "BNT", value: "0.3152018154 BNT"},{key: "TLOS", value: "7.8643 TLOS"}],
  price_change_24h: [{key: "BNT", value: "-0.00290315382697393"},{key: "TLOS", value: "1.71415770245709709"}],
  liquidity_depth: [{key: "BNT", value: "1.5000736906 BNT"},{key: "TLOS", value: "35.0378 TLOS"}],
  price: [{key: "BNT", value: "0.03972778617302607"},{key: "TLOS", value: "25.17129939344490808"}],
  smart_price: [{key: "BNT", value: "0.02142962415142857"},{key: "TLOS", value: "0.50053999999999998"}],
  smart_price_change_30d: [{key: "BNT", value: "0.00000714285857143"},{key: "TLOS", value: "0.00039714285714287"}],
  volume_cumulative: [{key: "BNT", value: "0.3152018154 BNT"},{key: "TLOS", value: "7.8643 TLOS"}]
}

Transformation

{
   "id": -> ? converter
   "code" -> volume_24h[key != "TLOS"].key = "BNT"
   "name" -> ?
   "primaryCommunityImageName" -> ?
   "liquidityDepth" -> liquidity_depth[key == "TLOS"].value * USDpriceOfTlos
   "price" -> price[key == "TLOS"].value * USDpriceOfTlos
   "change24h" -> price_change_24h[key == "TLOS"].value / ( price[key == "TLOS"].value - price_change_24h[key == "TLOS"].value ) * 100 + ?(TLOS 24 hour price change)?
   "volume24h":{
      "USD" -> volume_24h[key == "TLOS"].value * USDpriceOfTlos
   }
}

 */
//  const tokenData: TokenPrice[] = (<any>data).data.page;
//  const [tokenPrices] = await Promise.all([
//    tokenData
//  ]);

  return parsedTradeData;
};
