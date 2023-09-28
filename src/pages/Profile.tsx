import React, { useEffect, useState } from 'react'
import {
  AiOutlineEdit,
  AiOutlineHeart,
  AiOutlineHome,
  AiOutlinePlus,
} from 'react-icons/ai'
import { auth, db, storage } from '../firebase'
import { initAlert } from './Signup'
import { updateProfile } from 'firebase/auth'
import { updateDoc, doc, getDoc } from 'firebase/firestore'
import Toast from '../components/Toast'
import Button from '../components/common/Button'
import { useNavigate } from 'react-router'
import { FaUserCircle } from 'react-icons/fa'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage'
import { Link } from 'react-router-dom'
import { BiBuildings } from 'react-icons/bi'

export default function Profile() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName,
    email: auth.currentUser?.email,
  })
  const { name, email } = formData
  const [changeDetail, setChangeDetail] = useState(false)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [alert, setAlert] = useState(initAlert)

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
        const confirm = window.confirm('프로필 이름을 변경 하시겠습니까?')
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

  const uploadImage = async () => {
    if (!imageFile || !auth.currentUser) {
      return
    }

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
  }

  useEffect(() => {
    if (imageFile) {
      uploadImage()
    }
  }, [imageFile])

  return (
    <>
      <section className="max-w-6xl px-4 mx-auto">
        <h1>내 프로필</h1>
        <div className="w-full sm:w-[50%] mt-6 mx-auto">
          <div className="w-[150px] mx-auto relative rounded-full mb-4 overflow-hidden cursor-pointer group">
            <>
              {auth.currentUser?.photoURL ? (
                <img
                  src={auth.currentUser.photoURL}
                  alt="profile-image"
                  className="w-[150px] h-[150px] object-cover transition duration-200 ease-in-out group-hover:brightness-75"
                />
              ) : (
                <FaUserCircle
                  size={88}
                  className="bg-white transition duration-200 ease-in-out group-hover:brightness-75"
                />
              )}
              <label
                htmlFor="photo"
                className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] invisible group-hover:visible"
              >
                <AiOutlinePlus size={40} className="text-white" />
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
              />
            </>
          </div>

          <form className="flex-1 ml-2">
            <div className="relative mb-0.5">
              <input
                type="text"
                name="name"
                value={name!}
                disabled={!changeDetail}
                onChange={onChange}
                className={`w-full px-3 py-2 text-gray-700 bg-white border rounded transition ease-in-out outline-none ${
                  changeDetail ? 'border-gray-300' : 'border-white'
                } ${changeDetail && 'bg-blue-100'}`}
              />
              <AiOutlineEdit
                size={20}
                onClick={onEdit}
                className={`absolute right-3 top-2 cursor-pointer ${
                  changeDetail && 'text-blue-600'
                }`}
              />
            </div>
            <div className="w-full px-3 py-2 text-gray-700 bg-white">
              {email}
            </div>
          </form>
        </div>
        <Button
          type="button"
          level="primary"
          size="l"
          withIcon={true}
          className="w-full sm:w-[50%] mt-6 mx-auto"
          onClick={() => navigate('/create-listing')}
        >
          <AiOutlineHome size={20} className="mr-1" />내 매물 등록하기
        </Button>
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
            관심 있는 매물
          </li>
        </Link>
      </ul>
      {/* <section className="max-w-6xl px-4 mx-auto">
        <h4 className="text-center mb-0">나의 매물 목록</h4>
        <main>
          {!pageLoading && listings.length > 0 && (
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6 mb-6">
              {listings.map((listing) => (
                <ListingItem key={listing.id} listing={listing} />
              ))}
            </ul>
          )}
        </main>
        {lastFetchedListing && (
          <div className="flex justify-center mb-4">
            <Button
              type="button"
              level="outline"
              size="s"
              onClick={onFetchMore}
              disabled={btnLoading}
            >
              더 보기
            </Button>
          </div>
        )}
      </section> */}
      {alert.status !== 'pending' && (
        <Toast alert={alert} setAlert={setAlert} />
      )}
    </>
  )
}
