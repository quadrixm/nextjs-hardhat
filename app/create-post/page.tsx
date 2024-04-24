'use client'

import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { contractAddress } from "../../address";
import Blog from '../../artifacts/contracts/Blog.sol/Blog.json'

export default function CreatePost() {
    const router = useRouter()
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');

    useEffect(() => {
      const onEventReceived = (param1: any, param2: any, event: any) => {
          console.log(`Event received: ${param1}, ${param2}`);
          console.log({event});
      };

      if (typeof window.ethereum !== 'undefined') {
        console.log(window.ethereum);
        const provider = new ethers.BrowserProvider(window.ethereum)
        // const provider = new ethers.JsonRpcProvider('http://localhost:8545');
        // const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, Blog.abi ,provider);
        // console.log('contract: ', contract)


        contract.on("PostCreated", onEventReceived);

        // Cleanup listener when component unmounts
        return () => {
            contract.off("PostCreated", onEventReceived);
        };
      } else {
        alert('window ethereum undefined');
      }

  }, []);

    async function createNewPost() {   
        if (!title || !content) return
        if (typeof window.ethereum !== 'undefined') {
            console.log(window.ethereum);
            // TODO Tried to connect with provider to create post however it is not allowing to write
            // Using the private key and wallet it is however allowing it.
            const provider = new ethers.BrowserProvider(window.ethereum, "any")
            // const provider = new ethers.providers.Web3Provider(window.ethereum);
            // const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
            // const provider = new ethers.JsonRpcProvider('http://localhost:8545');
            // const wallet = new ethers.Wallet(privateKey, provider);
            const signer = await provider.getSigner()
            const contract = new ethers.Contract(contractAddress, Blog.abi, signer);
            console.log({contract});
            try {
              const val = await contract.createPost(title, content)
              /* optional - wait for transaction to be confirmed before rerouting */
              /* await provider.waitForTransaction(val.hash) */
              console.log('------Val: ', val)
            } catch (err) {
              console.log('------Error: ', JSON.stringify(err))
            }
            // router.push(`/`)
          } else {
            alert('window ethereum undefined');
          }
      }
    return (
      <main className="flex flex-col items-center justify-center p-6 min-h-screen bg-gray-50">
        <input
          onChange={(e) => setTitle(String(e.target.value))}
          name='title'
          placeholder='Give it a title ...'
          value={title}
          className="form-input mt-4 px-4 py-2 border rounded-md w-full max-w-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <input
          onChange={(e) => setContent(String(e.target.value))}
          name='content'
          placeholder='Enter content'
          value={content}
          className="form-input mt-4 px-4 py-2 border rounded-md w-full max-w-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <div className="space-x-4 mt-6">
          <button 
            onClick={createNewPost}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Post
          </button>
          <button 
            onClick={() => {window.history.back()}}
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
          >
            Back
          </button>
        </div>
      </main>
    );
}