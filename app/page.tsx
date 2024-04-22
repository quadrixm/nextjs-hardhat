'use client'

import Image from "next/image";
import { ethers } from "ethers";
import { useContext, useState } from "react";
import { AccountContext } from "./account-context";
import { useRouter } from "next/navigation";
import { contractAddress } from "../address";
import Blog from '../artifacts/contracts/Blog.sol/Blog.json'

export type Post = {
  id: number,
  title: string,
  content: string,
  published: boolean,
}

export default function Home() {

  const account = useContext(AccountContext);
  const router = useRouter()

  // const [data, setData] = useState<Post[]>([]);

  const [posts, setPosts] = useState([]);
  
  async function onCreatePostClick() {
    router.push('/create-post')
  }

  async function getAllPost() {   
    if (typeof window.ethereum !== 'undefined') {
        console.log(window.ethereum);
        // const provider = new ethers.BrowserProvider(window.ethereum)
        const provider = new ethers.JsonRpcProvider('http://localhost:8545');
        // const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, Blog.abi, provider);
        // console.log('contract: ', contract)
        try {
          const response = await contract.fetchAllPosts()
          console.log({response});

          setPosts(response.map((post: any) => ({
            // Assume post is an object with properties you need
            id: post.id.toString(),
            title: post.title,
            content: post.content,
            // Add more properties as needed
          })));
          // setData(data as Post[]);
          /* optional - wait for transaction to be confirmed before rerouting */
          /* await provider.waitForTransaction(val.hash) */
          // console.log('data: ', JSON.stringify(data))
        } catch (err) {
          console.log('--------Error: ', err)
        }
      } else {
        alert('window ethereum undefined');
      }
  }


  return (
    <main className="flex flex-col items-center justify-between p-6 min-h-screen bg-gray-100">
      {account ? (
        <div className="space-x-4">
          <button 
            onClick={onCreatePostClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Post
          </button>
          <button 
            onClick={getAllPost}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Get All Posts
          </button>
        </div>
      ) : null}

      <div className="w-full max-w-4xl mt-8 mb-16">
        <h1 className="text-xl font-bold text-center">Posts</h1>
        <ul className="mt-4 space-y-4">
          {posts.map((post: any) => (
            <li key={post.id} className="bg-white shadow overflow-hidden rounded-md px-6 py-4">
              <h2 className="text-lg font-semibold">{post.title}</h2>
              <p>{post.content}</p>
              {/* Display more post details here */}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
