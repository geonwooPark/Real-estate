import { deleteDoc, doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useReducer, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { db } from '../firebase'
import { formReducer, initialState } from '../reducers/formReducer'
import Spinner from '../components/Spinner'
import Carousel from '../components/Carousel'
import { BsShare } from 'react-icons/bs'

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
    await deleteDoc(doc(db, 'listings', listingId))
    await deleteDoc(doc(db, 'favorites', listingId))
    navigate('/profile')
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
        <div className="w-full md:w-[300px] lg:w-[400px]">
          <Carousel images={state.images} />
          <button onClick={onDelete}>삭제</button>
          <button onClick={onEdit}>수정</button>
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
