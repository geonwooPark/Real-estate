import { DocumentData, doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { db } from '../firebase'
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
        center: new kakao.maps.LatLng(listing.latitude, listing.longitude),
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
          listing.latitude,
          listing.longitude,
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
      </section>
      <SideSlider
        showInfo={showInfo}
        setShowInfo={setShowInfo}
        listing={listing}
      />
    </main>
  )
}
