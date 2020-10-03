import { DryRelay } from "@/api/eosBancorCalc";
import { Sym } from "eos-common";

const tlosToken = {
  contract: "eosio.token",
  symbol: "4,TLOS"
};

const oldRelays = [
  {
    contract: "tlosdx.swaps",
    smartToken: {
      contract: "relays.swaps",
      symbol: "8,TLOSDX"
    },
    reserves: [
      {
        contract: "tokens.swaps",
        symbol: "4,TLOSD"
      },
      tlosToken
    ]
  },
  {
    contract: "zar.tbn",
    smartToken: {
      contract: "zarrelay.tbn",
      symbol: "8,TLOSZAR"
    },
    reserves: [
      {
        contract: "stablecoin.z",
        symbol: "2,EZAR"
      },
      tlosToken
    ]
  },
  {
    contract: "cx.tbn",
    smartToken: {
      contract: "cxrelay.tbn",
      symbol: "8,TLOSCX"
    },
    reserves: [
      {
        contract: "thecooltoken",
        symbol: "4,COOL"
      },
      tlosToken
    ]
  },
  {
    contract: "bnt.swaps",
    smartToken: {
      contract: "relays.swaps",
      symbol: "8,TLOSBNT"
    },
    reserves: [
      {
        contract: "tokens.swaps",
        symbol: "10,BNT"
      },
      tlosToken
    ]
  },
  {
    contract: "btc.swaps",
    smartToken: {
      contract: "relays.swaps",
      symbol: "8,TLOSBTC"
    },
    reserves: [
      {
        contract: "tokens.swaps",
        symbol: "8,BTC"
      },
      tlosToken
    ]
  },
  {
    contract: "dric.tbn",
    smartToken: {
      contract: "dricrly.tbn",
      symbol: "8,TLSDRIC"
    },
    reserves: [
      {
        contract: "persiandaric",
        symbol: "4,DRIC"
      },
      tlosToken
    ]
  },
  {
    contract: "eos.swaps",
    smartToken: {
      contract: "relays.swaps",
      symbol: "8,TLOSEOS"
    },
    reserves: [
      {
        contract: "tokens.swaps",
        symbol: "4,EOS"
      },
      tlosToken
    ]
  },
  {
    contract: "gem.tbn",
    smartToken: {
      contract: "gemrelay.tbn",
      symbol: "8,TLOSGEM"
    },
    reserves: [
      {
        contract: "lord",
        symbol: "4,GEM"
      },
      tlosToken
    ]
  },
  {
    contract: "seeds.tbn",
    smartToken: {
      contract: "seedsrly.tbn",
      symbol: "8,TLSEEDS"
    },
    reserves: [
      {
        contract: "token.seeds",
        symbol: "4,SEEDS"
      },
      tlosToken
    ]
  },
  {
    contract: "ppl.tbn",
    smartToken: {
      contract: "pplrelay.tbn",
      symbol: "8,TLOSPPL"
    },
    reserves: [
      {
        contract: "vapaeetokens",
        symbol: "4,PEOPLE"
      },
      tlosToken
    ]
  },
  {
    contract: "ynt.tbn",
    smartToken: {
      contract: "yntrelay.tbn",
      symbol: "8,TLOSYNT"
    },
    reserves: [
      {
        contract: "sesacashmain",
        symbol: "4,YNT"
      },
      tlosToken
    ]
  },
  {
    contract: "san.tbn",
    smartToken: {
      contract: "sanrelay.tbn",
      symbol: "8,TLOSSAN"
    },
    reserves: [
      {
        contract: "sandiegocoin",
        symbol: "8,SAND"
      },
      tlosToken
    ]
  },
  {
    contract: "rev.tbn",
    smartToken: {
      contract: "revrelay.tbn",
      symbol: "8,TLOSREV"
    },
    reserves: [
      {
        contract: "revelation21",
        symbol: "4,HEART"
      },
      tlosToken
    ]
  },
  {
    contract: "qbe.tbn",
    smartToken: {
      contract: "qberelay.tbn",
      symbol: "8,TLOSQBE"
    },
    reserves: [
      {
        contract: "qubicletoken",
        symbol: "4,QBE"
      },
      tlosToken
    ]
  },
  {
    contract: "sql.tbn",
    smartToken: {
      contract: "sqlrelay.tbn",
      symbol: "8,TLOSSQL"
    },
    reserves: [
      {
        contract: "sqrlwalletio",
        symbol: "4,SQRL"
      },
      tlosToken
    ]
  },
  {
    contract: "dac.tbn",
    smartToken: {
      contract: "dacrelay.tbn",
      symbol: "8,TLSDAC"
    },
    reserves: [
      {
        contract: "telosdacdrop",
        symbol: "4,TLOSDAC"
      },
      tlosToken
    ]
  }
];

export const getHardCodedRelays = (): DryRelay[] =>
  oldRelays.map(relay => ({
    ...relay,
    isMultiContract: false,
    smartToken: {
      contract: relay.smartToken.contract,
      symbol: new Sym(relay.smartToken.symbol)
    },
    reserves: relay.reserves.map(reserve => ({
      ...reserve,
      symbol: new Sym(reserve.symbol)
    }))
  }));

export const priorityEthPools = [
  "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533",
  "0xf3aD2cBc4276eb4B0fb627Af0059CfcE094E20a1",
  "0x131da075a2832549128e93AcC2b54174045232Cf",
  "0xE5Df055773Bf9710053923599504831c7DBdD697",
  "0x248AFFf1aa83cF860198ddeE14b5b3E8eDb46d47",
  "0x38838B895cbf02048455Fb7f649D97C564fC18a8",
  "0xf7b9fa01098f22527Db205Ff9BB6FdF7C7D9F1C5",
  "0xd7eB9DB184DA9f099B84e2F86b1da1Fe6b305B3d",
  "0x4827e558e642861Cd7a1C8f011b2B4661F8d51fa",
  "0xE6b31fB3f29fbde1b92794B0867A315Ff605A324",
  "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44",
  "0xd1BB51fECC950c7b1e4197D8d13A1d2A60795D2C",
  "0x0c485BffD5df019F66927B2C32360159884D4409",
  "0xB9fe4BD869a132137B668054ea48C897c0654ee4",
  "0x99eBD396Ce7AA095412a4Cd1A0C959D6Fd67B340",
  "0xFC0e04Eae452c163883AAAd4Ac1AE091Cc87FEf3",
  "0x79d83B390cF0EDF86B9EFbE47B556Cc6e20926aC",
  "0x168D7Bbf38E17941173a352f1352DF91a7771dF3",
  "0x497Ec0D6Ba2080f0ed7ecf7a79a2A907401b3239",
  "0x0F2318565f1996CB1eD2F88e172135791BC1FcBf",
  "0x2948BD241243Bb6924A0b2f368233DDa525AAB05",
  "0xccB5E3Ba5356D57001976092795626ac3b87Ad4e",
  "0xc4938292EA2d3085fFFc11C46B87CA068a83BE01",
  "0x014186b1a2d675fc1e303A3d62B574C3270A38e0",
  "0xbAb15d72731Ea7031B10324806E7AaD8448896D5",
  "0x11223Ed5D5846603C4EfC7c451FD8EB596d592cF",
  "0x4319f9130848544afB97e92cb3Ea9fdb4b0A0B2a",
  "0xdD8a17169aa94E548602096EB9C9d44216cE8a37",
  "0xb3b2861a093B7FB19352bD62CD8EFC314e0641a7",
  "0xaB5ae72d95d3A02796c87F8079b1E180507dF54f",
  "0x60Be88DD72f03C91FB22EEF7Af24C2e99Db58530",
  "0xa3b3c5a8b22C044D5f2d372f628245E2106D310D",
  "0xE9ADced9da076D9dADA35F5b99970fDd58B1440D",
  "0x8DA321aB610cD24fB2bcCe191F423Dae7c327ca9",
  "0x564c07255AFe5050D82c8816F78dA13f2B17ac6D",
  "0x4B51AcC819591c885DbA0F06d98A07b432E6D6B4",
  "0x5039f60594Ffa3f1a5ACbe85E1eBe12Dc8Da7c5c",
  "0x2d5aDD875442023eC83718Bb03D866c9F4C6E8cE",
  "0xd6A6c879Ad8c01D0C8d5bF1C85829814b954DBBF",
  "0xEEF7551e59b34F431D71C7593249F61D5c52ce65"
];
