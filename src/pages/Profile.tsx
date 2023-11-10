import React, { useEffect, useState } from 'react'
import {
  AiOutlineEdit,
  AiOutlineHeart,
  AiOutlinePlus,
  AiFillEdit,
} from 'react-icons/ai'
import { BiBuildings } from 'react-icons/bi'
import { FaUserCircle } from 'react-icons/fa'
import { auth, db, storage } from '../firebase'
import { updateProfile } from 'firebase/auth'
import { updateDoc, doc, getDoc } from 'firebase/firestore'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage'
import { Link } from 'react-router-dom'
import Input from '../components/Input'
import Spinner from '../components/Spinner'
import { setAlert } from '../store/features/alertSlice'
import { useAppDispatch } from '../store/store'

export default function Profile() {
  const dispatch = useAppDispatch()

  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName,
    email: auth.currentUser?.email,
  })
  const { name, email } = formData
  const [changeDetail, setChangeDetail] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageLoading, setImageLoading] = useState(false)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const onNameEdit = async () => {
    setChangeDetail(!changeDetail)
    if (!changeDetail) {
      return
    }
    if (!auth.currentUser) {
      return
    }

    try {
      if (auth.currentUser?.displayName !== name) {
        const confirm = window.confirm('프로필 이름을 변경 하시겠습니까?')
        if (confirm) {
          await updateProfile(auth.currentUser, {
            displayName: name,
          })
          await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            name,
          })
          dispatch(
            setAlert({
              status: 'success',
              message: '프로필 이름을 성공적으로 변경했습니다.',
            }),
          )
        } else {
          setFormData({
            name: auth.currentUser?.displayName,
            email: auth.currentUser?.email,
          })
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          setAlert({
            status: 'error',
            message: '프로필 이름 변경에 실패했습니다.',
          }),
        )
      }
    }
  }

  useEffect(() => {
    if (imageFile) {
      const onImageEdit = async () => {
        if (!imageFile || !auth.currentUser) {
          return
        }
        try {
          setImageLoading(true)
          const docSnap = await getDoc(doc(db, 'users', auth.currentUser.uid))
          const user = docSnap.data()
          if (user?.photoPath) {
            await deleteObject(ref(storage, user.photoPath))
          }

          const imgRef = ref(storage, `profile/${Date.now()} - ${user?.uid}`)

          const result = await uploadBytes(imgRef, imageFile)
          const url = await getDownloadURL(ref(storage, result.ref.fullPath))
          await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            photoUrl: url,
            photoPath: result.ref.fullPath,
          })
          await updateProfile(auth.currentUser, {
            photoURL: url,
          })
          setImageFile(null)
          dispatch(
            setAlert({
              status: 'success',
              message: '프로필 사진을 성공적으로 변경했습니다.',
            }),
          )
        } catch (error) {
          if (error instanceof Error) {
            dispatch(
              setAlert({
                status: 'error',
                message: '프로필 사진 변경에 실패했습니다.',
              }),
            )
          }
        } finally {
          setImageLoading(false)
        }
      }
      onImageEdit()
    }
  }, [imageFile])

  return (
    <>
      <section className="max-w-6xl px-4 mx-auto">
        <h1>내 프로필</h1>
        <div className="w-full sm:w-[50%] mt-6 mx-auto">
          <div className="relative w-[200px] mx-auto rounded-full mb-5 overflow-hidden group shadow-md">
            <>
              {auth.currentUser?.photoURL ? (
                <img
                  src={auth.currentUser.photoURL}
                  alt="profile-image"
                  className="w-[200px] h-[200px] object-cover transition duration-200 ease-in-out group-hover:brightness-75"
                />
              ) : (
                <FaUserCircle
                  size={200}
                  className="bg-white transition duration-200 ease-in-out group-hover:brightness-75"
                />
              )}
              <label
                htmlFor="photo"
                className={`absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-white 
                      ${
                        imageLoading
                          ? 'visible'
                          : 'invisible group-hover:visible'
                      }`}
              >
                <div className="w-[200px] h-[200px] flex justify-center items-center cursor-pointer">
                  {imageLoading ? <Spinner /> : <AiOutlinePlus size={40} />}
                </div>
              </label>
              <input
                type="file"
                id="photo"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files !== null) {
                    setImageFile(e.target.files[0])
                  }
                }}
                autoComplete="off"
              />
            </>
          </div>

          <form>
            <div>
              <Input
                type="text"
                name="name"
                value={name!}
                disabled={!changeDetail}
                className={`border-none !p-3 disabled:cursor-text
                      ${changeDetail ? 'border-gray-300' : ''}
                      ${changeDetail && 'bg-blue-100'}`}
                onChange={onChange}
                icon={changeDetail ? AiFillEdit : AiOutlineEdit}
                iconAction={onNameEdit}
              />
            </div>
            <div className="p-3 text-sm">{email}</div>
          </form>
        </div>
      </section>
      <ul className="max-w-6xl w-full sm:w-[50%] text-left mx-auto mt-6 px-4">
        <Link to={'/profile/my-listings'}>
          <li className="border-b py-2 flex items-center">
            <BiBuildings size={20} className="mr-2" />
            내가 올린 매물
          </li>
        </Link>
        <Link to={'/profile/favorite-listings'}>
          <li className="border-b py-2 flex items-center">
            <AiOutlineHeart size={20} className="mr-2" />
            내가 찜한 매물
          </li>
        </Link>
      </ul>
    </>
  )
}
