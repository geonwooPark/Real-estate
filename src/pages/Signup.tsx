import React, { useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import OAuth from '../components/OAuth'

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const { name, email, password } = formData
  const [showPassword, setShowPassword] = useState(false)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold">회원가입</h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img
            src="https://plus.unsplash.com/premium_photo-1681487814165-018814e29155?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
            alt="key"
            className="w-full rounded-2xl"
          />
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form>
            <input
              className="w-full px-4 py-2 mb-6 text-md text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
              type="name"
              name="name"
              id="name"
              value={name}
              placeholder="이름"
              onChange={onChange}
            />

            <input
              className="w-full px-4 py-2 mb-6 text-md text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
              type="email"
              name="email"
              id="email"
              value={email}
              placeholder="이메일"
              onChange={onChange}
            />
            <div className="relative mb-6">
              <input
                className="w-full px-4 py-2 text-md text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                value={password}
                placeholder="비밀번호"
                onChange={onChange}
              />{' '}
              {showPassword ? (
                <AiFillEyeInvisible
                  size={20}
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <AiFillEye
                  size={20}
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>
            <div className="flex justify-center whitespace-nowrap text-sm">
              <p className="mb-6">
                계정이 있으신가요?
                <Link
                  to="/sign-in"
                  className="text-blue-600 hover:text-blue-400 transition duration-200 ease-in-out ml-1"
                >
                  로그인
                </Link>
              </p>
            </div>
            <button
              className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium rounded hover:bg-blue-400 transition duration-200 ease-in-out active:bg-blue-800"
              type="submit"
            >
              회원가입
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
