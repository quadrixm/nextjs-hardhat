'use client'

import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { contractAddress } from "../../address";
import Blog from '../../artifacts/contracts/Blog.sol/Blog.json'

export default function CreatePost() {
    const router = useRouter()
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');

    async function createNewPost() {   
        if (!title || !content) return
        if (typeof window.ethereum !== 'undefined') {
            console.log(window.ethereum);
            // const provider = new ethers.BrowserProvider(window.ethereum)
            const provider = new ethers.JsonRpcProvider('http://localhost:8545');
            // const signer = provider.getSigner()
            const contract = new ethers.Contract(contractAddress, Blog.abi ,provider);
            console.log('contract: ', contract)
            try {
              const val = await contract.createPost(title, content)
              /* optional - wait for transaction to be confirmed before rerouting */
              /* await provider.waitForTransaction(val.hash) */
              console.log('val: ', val)
            } catch (err) {
              console.log('Error: ', err)
            }
            router.push(`/`)
          } else {
            alert('window ethereum undefined');
          }
      }
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <input
                onChange={(e) => setTitle(String(e.target.value))}
                name='title'
                placeholder='Give it a title ...'
                value={title}
            />
            <input
                onChange={(e) => setContent(String(e.target.value))}
                name='content'
                placeholder='Enter content'
                value={content}
            />
            <button onClick={createNewPost}>Create Post</button>
        </main>
    );
}