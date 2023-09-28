import React from 'react'
import { auth, db } from '../firebase'
import { numberToKorean } from '../utils/numberToKorean'
import Moment from 'react-moment'
import Button from '../components/common/Button'
import {
  AiFillHeart,
  AiOutlineCalendar,
  AiOutlineClose,
  AiOutlineHeart,
  AiOutlinePushpin,
} from 'react-icons/ai'
import { BiArea } from 'react-icons/bi'
import { RiParkingBoxLine } from 'react-icons/ri'
import { MdOutlineSensorDoor } from 'react-icons/md'
import Carousel from '../components/Carousel'
import {
  DocumentData,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { useNavigate } from 'react-router'
import useSnapShot from '../hooks/useSnapShot'

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
}: SideSliderProps) {
  const navigate = useNavigate()
  const { value } = useSnapShot<Fav>('favorites', listing.id)

  const deleteListing = async () => {
    const confirm = window.confirm('해당 매물을 삭제 하시겠습니까?')
    if (confirm) {
      await deleteDoc(doc(db, 'listings', listing.id))
      await deleteDoc(doc(db, 'favorites', listing.id))
      navigate('/profile')
    }
  }

  const editListing = () => {
    navigate(`/edit-listing/${listing.id}`)
  }

  const startChat = async () => {
    if (!auth.currentUser) {
      return
    }
    const user1 = auth.currentUser?.uid
    const user2 = listing.postedBy
    const chatId =
      user1 > user2
        ? `${user1}.${user2}.${listing.id}`
        : `${user2}.${user1}.${listing.id}`
    await setDoc(doc(db, 'messages', chatId), {
      listingId: listing.id,
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
      <aside
        className={`w-full md:w-[300px] lg:w-[400px] border-l bg-white md:absolute top-0 right-0 z-10 transition-transform duration-200 ease-in-out ${
          !showInfo
            ? 'md:translate-x-[300px] lg:translate-x-[400px]'
            : 'translate-x-0'
        }`}
      >
        <div
          className="absolute top-[50%] -left-[1px] -translate-x-[50%] -translate-y-[50%] z-20 bg-white border p-2 rounded-3xl shadow-lg cursor-pointer hidden md:block"
          onClick={() => setShowInfo(!showInfo)}
        >
          <AiOutlineClose size={20} />
        </div>
        <div className="md:h-[calc(100vh-48px-61px)] md:overflow-y-scroll hide-scroll">
          <Carousel images={listing.images} />
          <div className="p-4 relative">
            <div className="text-right text-gray-700 mb-1">
              <small>
                <Moment fromNow>{listing.publishedAt?.toDate()}</Moment>
              </small>
            </div>
            <p className="text-md mb-2 truncate">{listing.roadName}</p>
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
              {listing.options &&
                Object.keys(listing.options).map((key) => {
                  if (listing.options[key]) {
                    return (
                      <li key={key} className="py-3 flex items-center">
                        <AiOutlinePushpin size={24} className="mr-1.5" />
                        {key}
                      </li>
                    )
                  }
                })}
            </ul>
            <hr />
            <p className="mt-6">{listing.detail}</p>
          </div>
        </div>
        <div className="w-full bg-white px-4 py-2 border-t-[1px] flex">
          {listing.postedBy === auth.currentUser?.uid ? (
            <>
              <Button
                type="button"
                level="ghost"
                size="s"
                fullWidth={true}
                onClick={editListing}
                className="mr-2"
              >
                수정하기
              </Button>
              <Button
                type="button"
                level="ghost"
                size="s"
                fullWidth={true}
                onClick={deleteListing}
                className="border-red-600 text-red-600"
              >
                삭제하기
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                level="ghost"
                size="s"
                withIcon
                className="mr-2"
                onClick={likeListing}
              >
                {value?.users.includes(auth.currentUser?.uid as string) ? (
                  <AiFillHeart size={20} className="text-red-400" />
                ) : (
                  <AiOutlineHeart size={20} />
                )}
              </Button>
              <Button
                type="button"
                level="primary"
                size="s"
                fullWidth={true}
                onClick={startChat}
              >
                연락하기
              </Button>
            </>
          )}
        </div>
      </aside>
    )
  )
}
