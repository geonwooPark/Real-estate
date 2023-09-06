import React, { useState } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { auth } from '../firebase'
import { useNavigate } from 'react-router'

export default function Profile() {
  const navigate = useNavigate()

  const [formData, setFormdata] = useState({
    name: auth.currentUser?.displayName,
    email: auth.currentUser?.email,
  })
  const { name, email } = formData

  const onLogout = () => {
    auth.signOut()
    navigate('/sign-in')
  }
  return (
    <>
      <section className="max-w-6xl flex flex-col items-center mx-auto">
        <h1 className="text-3xl text-center mt-6 font-bold">내 프로필</h1>
        <div className="w-full md:w-[50%] mt-6 px-3">
          <form>
            <div className="relative mb-3">
              <input
                type="text"
                name="name"
                value={name!}
                disabled
                className="w-full px-4 px-2 text-sm text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
              />
              <AiOutlineEdit
                size={20}
                className="absolute right-3 top-2 cursor-pointer"
              />
            </div>
            <input
              type="email"
              name="email"
              value={email!}
              disabled
              className="w-full px-4 px-2 mb-3 text-sm text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
            />
            <div className="text-right mb-3">
              <button
                onClick={onLogout}
                className="text-sm text-red-500 hover:text-red-600 transition duration-200 ease-in-out"
              >
                로그아웃
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
