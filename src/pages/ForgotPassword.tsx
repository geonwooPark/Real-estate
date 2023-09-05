import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import OAuth from '../components/OAuth'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setEmail(value)
  }

  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold">비밀번호 찾기</h1>
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
              type="email"
              name="email"
              id="email"
              value={email}
              placeholder="이메일"
              onChange={onChange}
            />
            <div className="flex justify-center  whitespace-nowrap text-sm">
              <p className="mb-6">
                계정이 없으신가요?
                <Link
                  to="/sign-up"
                  className="text-blue-600 hover:text-blue-400 transition duration-200 ease-in-out ml-1"
                >
                  회원가입
                </Link>
              </p>
            </div>
            <button
              className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium rounded hover:bg-blue-400 transition duration-200 ease-in-out active:bg-blue-800"
              type="submit"
            >
              비밀번호 재설정 메일 보내기
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
