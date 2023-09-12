import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { initAlert } from './Signup'
import Toast from '../components/Toast'
import { auth } from '../firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import spinner from '../assets/svg/spinner.svg'
import Button from '../components/common/Button'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [alert, setAlert] = useState(initAlert)
  const [loading, setLoading] = useState(false)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setEmail(value)
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      if (!email) {
        throw new Error('이메일을 입력하세요.')
      }
      setLoading(true)
      await sendPasswordResetEmail(auth, email)
      setAlert({
        status: 'success',
        message: '이메일이 성공적으로 발송되었습니다.',
      })
    } catch (error) {
      if (error instanceof Error) {
        setAlert({
          status: 'error',
          message: error.message,
        })
      }
    } finally {
      setEmail('')
      setLoading(false)
    }
  }

  return (
    <>
      <section>
        <h1>비밀번호 찾기</h1>
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
                type="email"
                name="email"
                id="email"
                value={email}
                placeholder="이메일"
                onChange={onChange}
              />
              <div className="flex justify-center whitespace-nowrap text-sm">
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
              <Button
                type="submit"
                level="primary"
                size="l"
                disabled={loading}
                fullWidth={true}
              >
                비밀번호 재설정 메일 보내기
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
