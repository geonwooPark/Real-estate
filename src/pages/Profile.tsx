import React, { useState } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { auth, db } from '../firebase'
import { useNavigate } from 'react-router'
import { initAlert } from './Signup'
import { updateProfile } from 'firebase/auth'
import { updateDoc, doc } from 'firebase/firestore'
import Toast from '../components/Toast'

export default function Profile() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName,
    email: auth.currentUser?.email,
  })
  const [alert, setAlert] = useState(initAlert)
  const [changeDetail, setChangeDetail] = useState(false)
  const { name, email } = formData

  const onLogout = () => {
    auth.signOut()
    navigate('/sign-in')
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const onEdit = async () => {
    setChangeDetail(!changeDetail)
    if (!changeDetail) {
      return
    }
    if (!auth.currentUser) {
      return
    }

    try {
      if (auth.currentUser?.displayName !== name) {
        const confirm = window.confirm('프로필 이름을 변경하시겠습니까?')
        if (confirm) {
          await updateProfile(auth.currentUser, {
            displayName: name,
          })
          await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            name,
          })
          setAlert({
            status: 'success',
            message: '프로필 이름을 성공적으로 변경했습니다.',
          })
        } else {
          setFormData({
            name: auth.currentUser?.displayName,
            email: auth.currentUser?.email,
          })
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setAlert({
          status: 'error',
          message: '프로필 이름 변경에 실패했습니다.',
        })
      }
    }
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
                disabled={!changeDetail}
                onChange={onChange}
                className={`w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${
                  changeDetail && 'bg-blue-100'
                }`}
              />
              <AiOutlineEdit
                size={20}
                onClick={onEdit}
                className={`absolute right-3 top-2 cursor-pointer ${
                  changeDetail && 'text-blue-600'
                }`}
              />
            </div>
            <input
              type="email"
              name="email"
              value={email!}
              disabled
              className="w-full px-4 py-2 mb-3 text-sm text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
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
      {alert.status !== 'pending' && (
        <Toast alert={alert} setAlert={setAlert} />
      )}
    </>
  )
}
