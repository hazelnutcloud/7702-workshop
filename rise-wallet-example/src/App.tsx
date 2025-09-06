import {
  useDisconnect,
  useConnect as usePortoConnect,
} from "porto/wagmi/Hooks";
import { useEffect } from "react";
import { formatUnits } from "viem";
import {
  useAccount,
  useChainId,
  useConnect,
  useConnectors,
  useReadContracts,
  useSendCalls,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { mintableErc20 } from "./contracts/MintableERC20";
import { vault } from "./contracts/Vault";

function App() {
  const connectors = useConnectors();
  const account = useAccount();
  const { connect, error } = useConnect();
  const { mutate: portoConnect } = usePortoConnect();
  const { mutate: disconnect } = useDisconnect();
  const { sendCallsAsync } = useSendCalls();
  const { data: balances, refetch } = useReadContracts({
    contracts: [
      {
        address: mintableErc20.address,
        abi: mintableErc20.abi,
        functionName: "balanceOf",
        args: account.address ? [account.address] : undefined,
      },
      {
        address: vault.address,
        abi: vault.abi,
        functionName: "balances",
        args: account.address ? [account.address] : undefined,
      },
    ],
  });
  const { writeContractAsync } = useWriteContract();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (account.status !== "connected") return;
    if (account.chainId !== chainId) {
      switchChain({ chainId });
    }
  }, [account, switchChain, chainId]);

  useEffect(() => {
    if (!error) return;

    console.error(error);
  }, [error]);

  const handleMint = async () => {
    if (!account.address) return;

    await writeContractAsync({
      address: mintableErc20.address,
      abi: mintableErc20.abi,
      functionName: "mint",
      args: [account.address, 100n * 10n ** 18n],
    });
    await refetch();
  };

  const handleDeposit = async () => {
    if (!account.address) return;

    if (account.connector?.name === "Porto") {
      await sendCallsAsync({
        calls: [
          {
            to: mintableErc20.address,
            abi: mintableErc20.abi,
            functionName: "mint",
            args: [account.address, 100n * 10n ** 18n],
          },
          {
            to: mintableErc20.address,
            abi: mintableErc20.abi,
            functionName: "approve",
            args: [vault.address, 100n * 10n ** 18n],
          },
          {
            to: vault.address,
            abi: vault.abi,
            functionName: "deposit",
            args: [100n * 10n ** 18n],
          },
        ],
      });
    } else {
      await writeContractAsync({
        abi: mintableErc20.abi,
        address: mintableErc20.address,
        functionName: "approve",
        args: [vault.address, 100n * 10n ** 18n],
      });
      await writeContractAsync({
        abi: vault.abi,
        address: vault.address,
        functionName: "deposit",
        args: [100n * 10n ** 18n],
      });
    }

    await refetch();
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#EFEAE6]">
      <div className="p-4 flex flex-col rounded-md bg-[#FAF7F5] gap-4 w-lg">
        <p>Deposits</p>
        <p className="text-3xl">
          {formatUnits(balances?.[1].result ?? 0n, 18)} USDC
        </p>
        <div className="flex text-xs">
          <p>Balance:</p>
          <div className="flex-1 w-10"></div>
          <p>{formatUnits(balances?.[0].result ?? 0n, 18)} USDC &nbsp;</p>
          <button
            type="button"
            className="hover:cursor-pointer"
            onClick={handleMint}
          >
            [+]
          </button>
        </div>

        {(() => {
          if (account.status === "connected") {
            return (
              <div>
                <div className="flex flex-col gap-2 items-stretch text-xs">
                  <p>{account.address}</p>
                  <button
                    type="button"
                    className="hover:cursor-pointer rounded-lg p-2 bg-[#EFEAE6]"
                    onClick={handleDeposit}
                  >
                    Deposit
                  </button>
                  <button
                    type="button"
                    className="hover:cursor-pointer rounded-lg p-2 bg-[#EEAF00]"
                    onClick={() =>
                      disconnect({
                        connector: account.connector,
                      })
                    }
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            );
          } else {
            return (
              <div className="flex flex-col gap-2 items-stretch text-xs">
                <p>Connect Wallet:</p>
                {connectors
                  .filter(({ name }) => !name.includes("Brave"))
                  .map((connector) => (
                    <button
                      key={connector.name}
                      type="button"
                      className="hover:cursor-pointer rounded-lg p-2 bg-[#EFEAE6] flex items-center justify-between"
                      onClick={() =>
                        connector.name === "Porto"
                          ? portoConnect({ connector, createAccount: true })
                          : connect({ connector })
                      }
                    >
                      {connector.name}{" "}
                      <img
                        src={connector.icon}
                        alt={connector.name}
                        width={24}
                        height={24}
                        className="rounded-md"
                      />
                    </button>
                  ))}
              </div>
            );
          }
        })()}
      </div>
    </div>
  );
}

export default App;
