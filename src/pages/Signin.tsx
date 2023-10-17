import React, { useContext, useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import { Link, useNavigate } from 'react-router-dom'
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import { auth, db } from '../firebase'
import { Timestamp, doc, getDoc, setDoc } from 'firebase/firestore'
import Button from '../components/Button'
import Input from '../components/Input'
import { ToastContext } from '../App'

export default function Signin() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [btnLoading, setBtnLoading] = useState(false)
  const [btn2Loading, setBtn2Loading] = useState(false)
  const { email, password } = formData
  const [showPassword, setShowPassword] = useState(false)
  const setAlert = useContext(ToastContext)

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
      setBtnLoading(true)
      const result = await signInWithEmailAndPassword(auth, email, password)
      if (result.user) {
        setFormData({ email: '', password: '' })
        setAlert({
          status: 'success',
          message: '로그인에 성공했습니다.',
        })
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
      setBtnLoading(false)
    }
  }

  const onGoogleClick = async () => {
    setBtn2Loading(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      const docRef = doc(db, 'users', result.user.uid)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          photoUrl: result.user.photoURL,
          photoPath: '',
          createdAt: Timestamp.fromDate(new Date()),
        })
      }
      navigate('/')
    } catch (error) {
      if (error instanceof Error) {
        setAlert({
          status: 'error',
          message: '구글 로그인에 실패 했습니다.',
        })
      }
    } finally {
      setBtn2Loading(false)
    }
  }

  const iconAction = () => {
    setShowPassword(!showPassword)
  }

  return (
    <section>
      <h1>로그인</h1>
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
            <Input
              className="w-full mb-6"
              type="email"
              name="email"
              value={email}
              placeholder="이메일"
              onChange={onChange}
            />
            <Input
              className="w-full mb-6"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              placeholder="비밀번호"
              onChange={onChange}
              icon={showPassword ? AiFillEyeInvisible : AiFillEye}
              iconAction={iconAction}
            />
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
            <Button
              label="로그인"
              type="submit"
              level="primary"
              size="l"
              disabled={btnLoading}
              fullWidth={true}
            />
            <div className="flex items-center my-4 before:border-t before:flex-1 before:border-gray-700  after:border-t after:flex-1 after:border-gray-700 ">
              <p className="text-center text-sm text-gray-700 mx-2">또는</p>
            </div>
            <Button
              label="구글로 로그인"
              type="button"
              level="secondary"
              size="l"
              icon={FcGoogle}
              fullWidth={true}
              disabled={btn2Loading}
              onClick={onGoogleClick}
            />
          </form>
        </div>
      </div>
    </section>
  )
}
