import { DocumentData, doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { db } from '../firebase'
import { BsShare } from 'react-icons/bs'
import SideSlider from '../components/SideSlider'
import { setAlert } from '../store/features/alertSlice'
import { useAppDispatch } from '../store/store'

const { kakao } = window as any

export default function Detail() {
  const params = useParams()
  const { listingId } = params
  const dispatch = useAppDispatch()

  const [listing, setListing] = useState<DocumentData>({})
  const [showInfo, setShowInfo] = useState(true)
  const [copyUrl, setCopyUrl] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!listingId) {
          return
        }
        const docSnap = await getDoc(doc(db, 'listings', listingId))

        if (docSnap.exists()) {
          const listing: DocumentData = { ...docSnap.data() }
          setListing(listing)
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
    fetchData()
  }, [])

  useEffect(() => {
    kakao.maps.load(async () => {
      const container = document.getElementById('map')
      const options = {
        center: new kakao.maps.LatLng(
          Number(listing.latitude),
          Number(listing.longitude),
        ),
        level: 3,
      }
      const map = await new kakao.maps.Map(container, options)

      const imageSrc = '/marker.png',
        imageSize = new kakao.maps.Size(48, 48),
        imageOption = { offset: new kakao.maps.Point(27, 69) }

      const markerImage = new kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imageOption,
        ),
        markerPosition = new kakao.maps.LatLng(
          Number(listing.latitude),
          Number(listing.longitude),
        )
      const marker = new kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
      })
      marker.setMap(map)
    })
  }, [listing])

  return (
    <main className="relative overflow-hidden">
      <section className="w-full h-[300px] sm:h-[400px] md:h-[calc(100vh-48px)] relative">
        <div id="map" className="w-full h-full"></div>
        <div
          className="bg-white rounded-3xl p-2 w-10 h-10 border absolute top-4 right-4 cursor-pointer shadow-sm z-30"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            setCopyUrl(true)
            setTimeout(() => setCopyUrl(false), 2500)
          }}
        >
          <BsShare size={20} className="text-gray-700" />
        </div>
      </section>
      <SideSlider
        showInfo={showInfo}
        setShowInfo={setShowInfo}
        listing={listing}
      />
      {copyUrl && (
        <p className="fixed bottom-10 left-[50%] translate-x-[-50%] bg-white border px-4 py-2 rounded-2xl text-sm text-gray-700 z-10">
          링크가 복사되었습니다!
        </p>
      )}
    </main>
  )
}
