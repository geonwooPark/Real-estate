import React, { useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { initAlert } from './Signup'
import Toast from '../components/Toast'
import { auth } from '../firebase'

export default function Signin() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [alert, setAlert] = useState(initAlert)
  const [loading, setLoading] = useState(false)
  const { email, password } = formData
  const [showPassword, setShowPassword] = useState(false)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (!email) {
        throw new Error('이메일을 입력하세요.')
      }
      if (!password) {
        throw new Error('비밀번호를 입력하세요.')
      }
      setLoading(true)
      const result = await signInWithEmailAndPassword(auth, email, password)
      if (result.user) {
        setFormData({ email: '', password: '' })
        navigate('/')
      }
    } catch (error) {
      if (error instanceof Error) {
        setAlert({
          status: 'error',
          message: error.message,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section>
        <h1 className="text-3xl text-center mt-6 font-bold">로그인</h1>
        <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
          <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
            <img
              src="https://plus.unsplash.com/premium_photo-1681487814165-018814e29155?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
              alt="key"
              className="w-full rounded-2xl"
            />
          </div>
          <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
            <form onSubmit={onSubmit}>
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
              <div className="flex justify-between whitespace-nowrap text-sm">
                <p className="mb-6">
                  계정이 없으신가요?
                  <Link
                    to="/sign-up"
                    className="text-blue-600 hover:text-blue-400 transition duration-200 ease-in-out ml-1"
                  >
                    회원가입
                  </Link>
                </p>
                <p>
                  <Link
                    to="/forgot-password"
                    className="text-blue-600 hover:text-blue-400 transition duration-200 ease-in-out"
                  >
                    비밀번호를 잃어버리셨나요?
                  </Link>
                </p>
              </div>
              <button
                className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium rounded hover:bg-blue-400 transition duration-200 ease-in-out active:bg-blue-800 disabled:bg-gray-400"
                type="submit"
                disabled={loading}
              >
                로그인
              </button>
              <div className="flex items-center my-4 before:border-t before:flex-1 before:border-gray-700  after:border-t after:flex-1 after:border-gray-700 ">
                <p className="text-center text-sm text-gray-700 mx-2">또는</p>
              </div>
              <OAuth />
            </form>
          </div>
        </div>
      </section>
      {alert.status !== 'pending' && (
        <Toast alert={alert} setAlert={setAlert} />
      )}
    </>
  )
}
