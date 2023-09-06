import React, { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { initAlert } from '../pages/Signup'
import { Timestamp, doc, setDoc, getDoc } from 'firebase/firestore'
import Toast from './Toast'

export default function OAuth() {
  const navigate = useNavigate()

  const [alert, setAlert] = useState(initAlert)
  const [loading, setLoading] = useState(false)

  const onGoogleClick = async () => {
    try {
      setLoading(true)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      const docRef = doc(db, 'users', result.user.uid)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
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
      setLoading(false)
    }
  }
  return (
    <>
      <button
        type="button"
        onClick={onGoogleClick}
        disabled={loading}
        className="flex items-center justify-center w-full bg-white px-7 py-3 text-sm font-medium rounded hover:bg-gray-200 active:bg-gray-400 transition duration-200 ease-in-out disabled:bg-gray-400"
      >
        <FcGoogle size={20} className="mr-1" />
        구글로 로그인
      </button>
      {alert.status !== 'pending' && (
        <Toast alert={alert} setAlert={setAlert} />
      )}
    </>
  )
}
