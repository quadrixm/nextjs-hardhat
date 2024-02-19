import WalletConnectProvider from '@walletconnect/web3-provider'
import { ethers } from 'ethers'
import type { AppProps } from 'next/app'
import { useState } from 'react'
import Web3Modal, { IProviderOptions } from 'web3modal'
import { AccountContext } from './account-context'
 
export default function MyApp({ Component, pageProps }: AppProps) {
    const [account, setAccount] = useState<any>(null)

    const providerOptions: IProviderOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            rpc: {
              31337: "http://localhost:8545", // Hardhat's default local network chain ID and URL
            },
          },
        },
      };
    async function connect() {
        try{
            const web3Modal = new Web3Modal({
                network: 'localhost',
                cacheProvider: false,
                providerOptions,
            })
            const connection = await web3Modal.connect();
            const provider = new ethers.BrowserProvider(connection);
            const accounts = await provider.listAccounts();
            setAccount(accounts[0]);
        } catch (err) {
            console.log({err});
        }
    }

    return (
        <div>
            <div className={''}>
            {
                !account && (
                <div className={''}>
                    <button className={''} onClick={connect}>Connect</button>
                </div>
                )
            }
            {
                account && <p className={''}>{account}</p>
            }
            <AccountContext.Provider value={account}>
                <Component {...pageProps} connect={connect} />
            </AccountContext.Provider>
            </div>
        </div>
    )
}