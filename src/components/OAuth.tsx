import React from 'react'
import { FcGoogle } from 'react-icons/fc'

export default function OAuth() {
  return (
    <button className="flex items-center justify-center w-full bg-white px-7 py-3 text-sm font-medium rounded hover:bg-gray-200 active:bg-gray-400 transition duration-200 ease-in-out ">
      <FcGoogle size={20} className="mr-1" />
      구글로 로그인
    </button>
  )
}
