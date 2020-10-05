import Vue from "vue";
import Vuex from "vuex";

import { GeneralModule } from "./modules/general";
import { EosTransitModule } from "./modules/wallet/tlosWallet";
import { EthereumModule } from "./modules/wallet/ethWallet";
import { TlosBancorModule } from "./modules/swap/tlosBancor";
import { EthBancorModule } from "./modules/swap/ethBancor";
import { UsdBancorModule } from "./modules/swap/usdSx";
import { BancorModule } from "./modules/swap/index";
import { WalletModule } from "./modules/wallet/index";
import { NetworkModule } from "./modules/network/index";
import { TlosNetworkModule } from "./modules/network/tlosNetwork";
import { createProxy, extractVuexModule } from "vuex-class-component";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    ...extractVuexModule(UsdBancorModule),
    ...extractVuexModule(TlosBancorModule),
    ...extractVuexModule(EthBancorModule),
    ...extractVuexModule(GeneralModule),
    ...extractVuexModule(EosTransitModule),
    ...extractVuexModule(EthereumModule),
    ...extractVuexModule(BancorModule),
    ...extractVuexModule(WalletModule),
    ...extractVuexModule(NetworkModule),
    ...extractVuexModule(TlosNetworkModule)
  },
  strict: process.env.NODE_ENV !== "production"
});

export const vxm = {
  general: createProxy(store, GeneralModule),
  wallet: createProxy(store, WalletModule),
  tlosWallet: createProxy(store, EosTransitModule),
  ethWallet: createProxy(store, EthereumModule),
  tlosBancor: createProxy(store, TlosBancorModule),
  ethBancor: createProxy(store, EthBancorModule),
  usdsBancor: createProxy(store, UsdBancorModule),
  bancor: createProxy(store, BancorModule),
  tlosNetwork: createProxy(store, TlosNetworkModule),
  network: createProxy(store, NetworkModule)
};
