import React, { useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, db } from '../firebase'
import { Timestamp, doc, setDoc } from 'firebase/firestore'
import Toast from '../components/Toast'
import { Alert } from '../interfaces/interfaces'
import Button from '../components/common/Button'

export const initAlert: Alert = { status: 'pending', message: '' }

const initData = {
  name: '',
  email: '',
  password: '',
}

export default function SignUp() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState(initData)
  const [alert, setAlert] = useState(initAlert)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { name, email, password } = formData

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (!name || !email || !password) {
        throw new Error('회원가입을 위해 빈 칸을 모두 채워주세요.')
      }

      if (password.length < 6) {
        throw new Error('비밀번호는 최소 6자리 이상이어야 합니다.')
      }

      setLoading(true)
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, {
        displayName: name,
      })
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        name,
        email,
        photoUrl: result.user.photoURL,
        photoPath: '',
        createdAt: Timestamp.fromDate(new Date()),
      })
      setFormData(initData)
      navigate('/', { replace: true })
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
        <h1>회원가입</h1>
        <div className="flex justify-center flex-wrap items-center px-6 py-6 max-w-6xl mx-auto md:py-12">
          <div className="mb-6 md:w-[67%] lg:w-[50%] lg:mb-0">
            <img
              src="https://plus.unsplash.com/premium_photo-1681487814165-018814e29155?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
              alt="key"
              className="w-full rounded-2xl"
            />
          </div>
          <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
            <form onSubmit={onSubmit}>
              <input
                className="input w-full mb-6"
                type="name"
                name="name"
                value={name}
                placeholder="이름"
                onChange={onChange}
              />
              <input
                className="input w-full mb-6"
                type="email"
                name="email"
                value={email}
                placeholder="이메일"
                onChange={onChange}
              />
              <div className="relative mb-6">
                <input
                  className="input w-full"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  placeholder="비밀번호"
                  onChange={onChange}
                />
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
              <Button
                type="submit"
                level="primary"
                size="l"
                disabled={loading}
                fullWidth={true}
              >
                회원가입
              </Button>
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
