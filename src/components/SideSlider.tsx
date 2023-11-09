import React, { useState } from 'react'
import { auth, db, storage } from '../firebase'
import { numberToKorean } from '../utils/numberToKorean'
import Moment from 'react-moment'
import Button from './Button'
import {
  AiFillHeart,
  AiOutlineCalendar,
  AiOutlineHeart,
  AiOutlinePushpin,
  AiOutlineShareAlt,
} from 'react-icons/ai'
import { IoIosArrowForward } from 'react-icons/io'
import { BiArea } from 'react-icons/bi'
import { RiParkingBoxLine } from 'react-icons/ri'
import { MdOutlineSensorDoor } from 'react-icons/md'
import Carousel from '../components/Carousel'
import {
  DocumentData,
  Timestamp,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { useNavigate } from 'react-router'
import useSnapShot from '../hooks/useSnapShot'
import { deleteObject, ref } from 'firebase/storage'
import { ImagesType, OptionsType } from '../interfaces/interfaces'
import { setAlert } from '../store/features/alertSlice'
import { useAppDispatch } from '../store/store'
import Editor from './Editor'
import EnlargedImage from './EnlargedImage'

interface SideSliderProps {
  showInfo: boolean
  setShowInfo: React.Dispatch<React.SetStateAction<boolean>>
  listing: DocumentData
}

interface Fav {
  users: string[]
}

export default function SideSlider({
  showInfo,
  setShowInfo,
  listing,
}: SideSliderProps): JSX.Element {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { value } = useSnapShot<Fav>('favorites', listing.id)

  const [showEnlargedImage, setShowEnlargedImage] = useState(false)
  const [copyUrl, setCopyUrl] = useState(false)

  const deleteListing = async () => {
    const confirm = window.confirm('해당 매물을 삭제 하시겠습니까?')
    try {
      if (confirm) {
        await deleteDoc(doc(db, 'listings', listing.id))
        await deleteDoc(doc(db, 'favorites', listing.id))
        await listing.images.forEach((image: ImagesType) => {
          deleteObject(ref(storage, image.path))
        })
        navigate('/profile')
        dispatch(
          setAlert({
            status: 'success',
            message: '성공적으로 매물을 삭제했습니다.',
          }),
        )
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          setAlert({
            status: 'error',
            message: error.message,
          }),
        )
      }
    }
  }

  const editListing = () => {
    navigate(`/edit-listing/${listing.id}`)
  }

  const startChat = async () => {
    if (!auth.currentUser) {
      return navigate('/sign-in')
    }
    const user1 = auth.currentUser?.uid
    const user2 = listing.postedBy
    const chatId =
      user1 > user2
        ? `${user1}.${user2}.${listing.id}`
        : `${user2}.${user1}.${listing.id}`
    await setDoc(doc(db, 'messages', chatId), {
      listingId: listing.id,
      updatedAt: Timestamp.fromDate(new Date()),
      users: [user1, user2],
    })

    navigate(`/chat`, { state: listing })
  }

  const likeListing = async () => {
    if (!auth.currentUser) {
      return
    }
    const isFav = value?.users.includes(auth.currentUser.uid)
    await updateDoc(doc(db, 'favorites', listing.id), {
      users: isFav
        ? value?.users.filter((id) => id !== auth.currentUser?.uid)
        : value?.users.concat(auth.currentUser?.uid),
    })
  }

  return (
    listing.images && (
      <>
        {showEnlargedImage && (
          <EnlargedImage
            images={listing.images}
            setShowEnlargedImage={setShowEnlargedImage}
          />
        )}

        <aside
          className={`w-full md:w-[300px] lg:w-[400px] border-l bg-white md:absolute top-0 right-0 z-10 transition-transform duration-200 ease-in-out
          ${
            showInfo
              ? 'translate-x-0'
              : 'md:translate-x-[300px] lg:translate-x-[400px]'
          }`}
        >
          <div
            className="text-gray-700 bg-white absolute top-4 right-4 w-8 h-8 flex justify-center items-center border rounded-3xl cursor-pointer shadow-sm z-30"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              setCopyUrl(true)
              setTimeout(() => setCopyUrl(false), 2500)
            }}
          >
            <AiOutlineShareAlt size={20} />
          </div>
          <div
            className="text-gray-700 absolute top-[50%] -translate-x-[50%] -translate-y-[50%] z-20 bg-white border p-2 rounded-3xl shadow-lg cursor-pointer hidden md:block"
            onClick={() => setShowInfo(!showInfo)}
          >
            <IoIosArrowForward
              size={20}
              className={showInfo ? 'rotate-0' : 'rotate-180 -translate-x-2'}
            />
          </div>
          <div className="md:h-[calc(100vh-48px)] md:overflow-y-scroll hide-scroll pb-[60px]">
            <Carousel
              images={listing.images}
              imageMode="object-cover"
              className="bg-gray-300 h-[300px] md:h-[200px] lg:h-[300px]"
              onClick={() => setShowEnlargedImage(!showEnlargedImage)}
            />
            <div className="relative p-4">
              <div className="text-right text-gray-700 mb-1">
                <small>
                  <Moment fromNow>{listing.publishedAt?.toDate()}</Moment>
                </small>
              </div>
              <p className="text-md mb-2 truncate">
                {listing.address.roadName}
              </p>
              <p
                className={`text-lg font-semibold truncate ${
                  !listing.maintenanceFee && 'mb-6'
                }`}
              >
                {listing.itemType === '매매'
                  ? `매매 ${numberToKorean(listing.price)}`
                  : listing.itemType === '전세'
                  ? `전세 ${numberToKorean(listing.price)}`
                  : `월세 ${numberToKorean(listing.price)} / ${numberToKorean(
                      listing.monthly,
                    )}`}
              </p>
              {listing.maintenanceFee ? (
                <div className="mb-6">
                  <small>관리비 {listing.maintenanceFee}만원</small>
                </div>
              ) : null}

              <hr />

              <ul className="mb-4 mt-4 text-sm">
                <li className="py-3 flex">
                  <BiArea size={24} className="mr-1.5" />
                  전용 {listing.area}평 ({(listing.area * 3.3058).toFixed(2)}㎡)
                </li>
                <li className="py-3 flex">
                  <MdOutlineSensorDoor size={24} className="mr-1.5" />방{' '}
                  {listing.rooms}개 / 욕실 {listing.bathrooms}개
                </li>
                <li className="py-3 flex">
                  <RiParkingBoxLine size={24} className="mr-1.5" />
                  주차 {listing.parking ? '가능' : '불가능'}
                </li>
                <li className="py-3 flex">
                  <AiOutlineCalendar size={24} className="mr-1.5" />
                  입주가능일{' '}
                  {listing.availableDate ? listing.availableDate : '미정'}
                </li>
              </ul>

              <hr />

              <ul className="mb-4 mt-4 text-sm">
                {listing.options.map((elem: OptionsType, i: number) => {
                  if (elem.status) {
                    return (
                      <li key={i} className="py-3 flex items-center">
                        <AiOutlinePushpin size={24} className="mr-1.5" />
                        {elem.name}
                      </li>
                    )
                  }
                })}
              </ul>

              <hr />

              <div className="mt-6">
                <Editor content={listing.detail} readOnly={true} />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 w-full">
            <div className="h-[40px] bg-gradient-to-t from-white"></div>
            <div className="w-full bg-white px-4 py-2 border-t-[1px] flex">
              {listing.postedBy === auth.currentUser?.uid ? (
                <>
                  <Button
                    label="수정하기"
                    type="button"
                    level="ghost"
                    size="s"
                    fullWidth={true}
                    onClick={editListing}
                    className="mr-2"
                  />
                  <Button
                    label="삭제하기"
                    type="button"
                    level="ghost"
                    size="s"
                    fullWidth={true}
                    onClick={deleteListing}
                    className="border-red-600 text-red-600"
                  />
                </>
              ) : (
                <>
                  <Button
                    label="찜"
                    type="button"
                    level="outline"
                    size="s"
                    icon={
                      value?.users.includes(auth.currentUser?.uid as string)
                        ? AiFillHeart
                        : AiOutlineHeart
                    }
                    className="mr-2 text-red-400"
                    onClick={likeListing}
                  />
                  <Button
                    label="연락하기"
                    type="button"
                    level="primary"
                    size="s"
                    fullWidth={true}
                    onClick={startChat}
                  />
                </>
              )}
            </div>
          </div>
        </aside>
        {copyUrl && (
          <p className="fixed bottom-10 left-[50%] translate-x-[-50%] bg-white border px-4 py-2 rounded-2xl text-sm text-gray-700 z-10">
            링크가 복사되었습니다!
          </p>
        )}
      </>
    )
  )
}
