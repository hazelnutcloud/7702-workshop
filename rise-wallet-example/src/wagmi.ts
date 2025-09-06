import { porto } from "porto/wagmi";
import { riseTestnet, riseTestnetConfig } from "rise-wallet";
import { createConfig, http } from "wagmi";

export const config = createConfig({
  chains: [riseTestnet],
  connectors: [porto(riseTestnetConfig)],
  transports: {
    [riseTestnet.id]: http(),
  },
});
