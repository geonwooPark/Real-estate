import { deleteDoc, doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useReducer, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { auth, db } from '../firebase'
import { formReducer, initialState } from '../reducers/formReducer'
import Spinner from '../components/Spinner'
import Carousel from '../components/Carousel'
import { BsShare } from 'react-icons/bs'
import { numberToKorean } from '../utils/numberToKorean'
import Moment from 'react-moment'
import Button from '../components/common/Button'
import { AiOutlineCalendar, AiOutlinePushpin } from 'react-icons/ai'
import { BiArea } from 'react-icons/bi'
import { RiParkingBoxLine } from 'react-icons/ri'
import { MdOutlineSensorDoor } from 'react-icons/md'

export default function Detail() {
  const params = useParams()
  const { listingId } = params
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(formReducer, initialState)
  const [copyUrl, setCopyUrl] = useState(false)
  const [pageLoading, setPageLoading] = useState(false)

  const onDelete = async () => {
    if (!listingId) {
      return
    }
    const confirm = window.confirm('해당 매물을 삭제 하시겠습니까?')
    if (confirm) {
      await deleteDoc(doc(db, 'listings', listingId))
      await deleteDoc(doc(db, 'favorites', listingId))
      navigate('/profile')
    }
  }

  const onEdit = () => {
    navigate(`/edit-listing/${listingId}`)
  }

  useEffect(() => {
    const fetchListing = async () => {
      setPageLoading(true)
      if (!listingId) {
        return
      }
      const docSnap = await getDoc(doc(db, 'listings', listingId))

      if (docSnap.exists()) {
        const listing: any = { ...docSnap.data() }
        dispatch({ type: 'fetch-listing', payload: listing })
        setPageLoading(false)
      }
    }
    fetchListing()
  }, [listingId])

  if (pageLoading) {
    return <Spinner />
  }

  return (
    <>
      <main className="flex flex-col sm:flex-row">
        <div className="w-full h-[50vh] sm:h-[100vh] bg-red-600 relative">
          <div>맵</div>
          <div
            className="bg-white rounded-3xl p-2 w-10 h-10 border border-gray-400 absolute top-4 right-4 cursor-pointer shadow-sm"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              setCopyUrl(true)
              setTimeout(() => setCopyUrl(false), 2500)
            }}
          >
            <BsShare size={20} className="text-gray-700" />
          </div>
        </div>
        <div className="w-full md:w-[300px] lg:w-[400px] bg-white">
          <Carousel images={state.images} />
          <div className="p-4">
            <div className="text-right text-gray-700 mb-1">
              <small>
                <Moment fromNow>{state.publishedAt?.toDate()}</Moment>
              </small>
            </div>
            <p className="text-md mb-2 truncate">{state.roadName}</p>
            <p
              className={`text-lg font-semibold truncate ${
                !state.maintenanceFee && 'mb-6'
              }`}
            >
              {state.itemType === '매매'
                ? `매매 ${numberToKorean(state.price)}`
                : state.itemType === '전세'
                ? `전세 ${numberToKorean(state.price)}`
                : `월세 ${numberToKorean(state.price)} / ${numberToKorean(
                    state.monthly,
                  )}`}
            </p>
            {state.maintenanceFee ? (
              <div className="mb-6">
                <small>관리비 {state.maintenanceFee}만원</small>
              </div>
            ) : null}
            <hr />
            <ul className="mb-4 mt-4 text-sm">
              <li className="py-3 flex">
                <BiArea size={24} className="mr-1.5" />
                전용 {state.area}평 ({(state.area * 3.3058).toFixed(2)}㎡)
              </li>
              <li className="py-3 flex">
                <MdOutlineSensorDoor size={24} className="mr-1.5" />방{' '}
                {state.rooms}개 / 욕실 {state.bathrooms}개
              </li>
              <li className="py-3 flex">
                <RiParkingBoxLine size={24} className="mr-1.5" />
                주차 {state.parking ? '가능' : '불가능'}
              </li>
              <li className="py-3 flex">
                <AiOutlineCalendar size={24} className="mr-1.5" />
                입주가능일 {state.availableDate ? state.availableDate : '미정'}
              </li>
            </ul>
            <hr />
            <ul className="mb-4 mt-4 text-sm">
              {Object.keys(state.options).map((key) => {
                if (state.options[key]) {
                  return (
                    <li key={key} className="py-3 flex">
                      <AiOutlinePushpin size={24} className="mr-1.5" />
                      {key}
                    </li>
                  )
                }
              })}
            </ul>
            <hr />
            <p className="mb-8 mt-6">{state.detail}</p>
            {state.postedBy === auth.currentUser?.uid && (
              <div>
                <Button
                  className="mb-2"
                  type="button"
                  level="ghost"
                  size="s"
                  fullWidth={true}
                  onClick={onEdit}
                >
                  수정
                </Button>
                <Button
                  className="border-red-600 text-red-600"
                  type="button"
                  level="ghost"
                  size="s"
                  fullWidth={true}
                  onClick={onDelete}
                >
                  삭제
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      {copyUrl && (
        <p className="fixed bottom-10 left-[50%] translate-x-[-50%] bg-gray-200 px-4 py-2 rounded-2xl text-sm text-gray-700">
          링크가 복사되었습니다!
        </p>
      )}
    </>
  )
}
