import axios from 'axios'
import React from 'react'

export default function CurrentUser({ name, handleSignOut  }: { name: string , handleSignOut: any}) {


  return (
    <div>
      <div className="flex flex-row items-center justify-center h-12 w-full">
        <div
          className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            ></path>
          </svg>
        </div>
        <div className="ml-2 font-bold text-2xl">Hello {name}</div>
      </div>

      <div className="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg relative">

        <div className="h-20 w-20 rounded-full border overflow-hidden">
          <img
            src="https://lh3.googleusercontent.com/a/AEdFTp5A9DRtlddVUL2xsQ8iZGBsoDSbKR4aMz3C3EIBJA=s288-p-rw-no"
            alt="Avatar"
            className="h-full w-full"
          />
        </div>
        <div className="text-sm font-semibold mt-2">Auther: Jane Liang</div>
        <div className="text-xs text-gray-500">Full Stack Developer</div>

        <div className="flex flex-row items-center justify-center mt-4">
          <div className="flex flex-col items-center justify-center">
            <button onClick={handleSignOut}  className="text-xs text-gray-500 underline hover:text-gray-700">Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  )
}
