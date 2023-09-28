import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { BsSearch, BsShare } from 'react-icons/bs'
import { db } from '../firebase'
import SideSlider from '../components/SideSlider'
import DropDownList from '../components/DropDownList'
import { AiOutlineClose } from 'react-icons/ai'
import { MapContext } from '../App'

const { kakao } = window as any

export default function Home() {
  const [listings, setListings] = useState<DocumentData[]>([])
  const [currentListing, setCurrentListing] = useState<DocumentData>({})
  const [keyword, setKeyword] = useState('')
  // const [map, setMap] = useState<any>(null)
  const { map, setMap } = useContext(MapContext)

  const [markers, setMarkers] = useState<any[]>([])
  const [clusterer, setClusterer] = useState<any>(null)
  const [showInfo, setShowInfo] = useState(false)
  const [showDropDownList, setShowDropDownList] = useState(false)
  const [itemType, setItemType] = useState('유형')
  const [copyUrl, setCopyUrl] = useState(false)

  const placesSearchCB = (data: any, status: any) => {
    if (status === kakao.maps.services.Status.OK) {
      const bounds = new kakao.maps.LatLngBounds()
      for (let i = 0; i < data.length; i++) {
        bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x))
      }
      map.setBounds(bounds)
    }
  }

  const setCenter = (latitude: number, longitude: number) => {
    const moveLatLon = new kakao.maps.LatLng(latitude, longitude)
    map.setCenter(moveLatLon)
  }

  const zoomIn = () => {
    const level = map.getLevel()
    if (level > 4) {
      map.setLevel(4)
    }
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const ps = new kakao.maps.services.Places()
    ps.keywordSearch(keyword, placesSearchCB)
    setKeyword('')
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setKeyword(value)
  }

  const fetchData = async () => {
    const q = query(collection(db, 'listings'))
    const querySnap = await getDocs(q)
    const listings: DocumentData[] = []
    querySnap.forEach((doc) => listings.push(doc.data()))
    setListings(listings)
  }

  const fetchFilteredData = async (itemType: '매매' | '전세' | '월세') => {
    const q = query(
      collection(db, 'listings'),
      where('itemType', '==', itemType),
    )
    const querySnap = await getDocs(q)
    const listings: DocumentData[] = []
    querySnap.forEach((doc) => listings.push(doc.data()))
    setListings(listings)
  }

  useEffect(() => {
    fetchData()

    kakao.maps.load(async () => {
      const container = document.getElementById('map')
      const options = {
        center: new kakao.maps.LatLng(37.574187, 126.976882),
        level: 8,
      }
      const map = await new kakao.maps.Map(container, options)
      setMap(map)
    })
  }, [])

  useEffect(() => {
    if (markers) {
      markers.forEach((marker) => marker.setMap(null))
    }
    if (clusterer) {
      clusterer.clear()
    }

    kakao.maps.load(async () => {
      const clusterer = new kakao.maps.MarkerClusterer({
        map: map,
        averageCenter: true,
        minLevel: 8,
      })

      const normalImage = new kakao.maps.MarkerImage(
        '/marker.png',
        new kakao.maps.Size(48, 48),
      )
      const clickImage = new kakao.maps.MarkerImage(
        '/selected-marker.png',
        new kakao.maps.Size(48, 48),
      )

      let markers: any[] = []
      let selectedMarker: any = null
      for (let i = 0; i < listings.length; i++) {
        const marker = new kakao.maps.Marker({
          map: map,
          position: new kakao.maps.LatLng(
            listings[i].latitude,
            listings[i].longitude,
          ),
          image: normalImage,
        })

        markers = [...markers, marker]

        kakao.maps.event.addListener(marker, 'click', function () {
          window.history.pushState(
            '',
            '',
            `http://localhost:3000/category/${listings[i].itemType}/${listings[i].id}`,
          )
          setShowInfo(true)
          setCurrentListing(listings[i])
          setCenter(listings[i].latitude, listings[i].longitude)
          zoomIn()
          if (!selectedMarker || selectedMarker !== marker) {
            selectedMarker && selectedMarker.setImage(normalImage)
            marker.setImage(clickImage)
          }
          selectedMarker = marker
        })
      }
      setMarkers(markers)
      setClusterer(clusterer)
      clusterer.addMarkers(markers)
    })
  }, [map, listings])

  return (
    <main className="relative overflow-hidden">
      <section className="w-full h-[300px] sm:h-[400px] md:h-[calc(100vh-48px)] relative">
        <div className="absolute top-4 left-4 z-10">
          <div className="flex items-center text-sm">
            <button
              type="button"
              className="bg-white px-4 py-2 border shadow-md rounded-sm"
              onClick={() => {
                setShowDropDownList(!showDropDownList)
              }}
            >
              {showDropDownList ? '닫기' : itemType}
            </button>
            <AiOutlineClose
              size={20}
              className={`text-red-400 ${itemType === '유형' && 'hidden'}`}
              onClick={() => {
                fetchData()
                setItemType('유형')
              }}
            />
          </div>

          <div className="overflow-hidden w-[58.23px]">
            <DropDownList visibility={showDropDownList}>
              <ul className="bg-white px-4 border shadow-md rounded-sm text-sm">
                <li className="py-2 border-b">
                  <button
                    type="button"
                    onClick={() => {
                      fetchFilteredData('매매')
                      setItemType('매매')
                      setShowDropDownList(false)
                    }}
                  >
                    매매
                  </button>
                </li>
                <li className="py-2 border-b">
                  <button
                    type="button"
                    onClick={() => {
                      fetchFilteredData('전세')
                      setItemType('전세')
                      setShowDropDownList(false)
                    }}
                  >
                    전세
                  </button>
                </li>
                <li className="py-2">
                  <button
                    type="button"
                    onClick={() => {
                      fetchFilteredData('월세')
                      setItemType('월세')
                      setShowDropDownList(false)
                    }}
                  >
                    월세
                  </button>
                </li>
              </ul>
            </DropDownList>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="absolute top-4 left-[50%] -translate-x-[50%] z-10"
        >
          <div className="relative">
            <input
              id="keyword"
              type="text"
              value={keyword}
              onChange={onChange}
              className="w-full px-4 py-2 border rounded-[100px] text-sm focus:outline-none"
              placeholder="장소를 검색해보세요."
            />
            <button
              type="submit"
              className="absolute top-[50%] right-0 -translate-y-[50%]"
            >
              <BsSearch size={16} className="mr-4" />
            </button>
          </div>
        </form>
        <div
          className="absolute top-4 right-4 bg-white rounded-3xl p-2 w-10 h-10 border cursor-pointer shadow-md z-30"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            setCopyUrl(true)
            setTimeout(() => setCopyUrl(false), 2500)
          }}
        >
          <BsShare size={20} className="text-gray-700" />
        </div>

        <div id="map" className="w-full h-full"></div>
      </section>
      <SideSlider
        showInfo={showInfo}
        setShowInfo={setShowInfo}
        listing={currentListing}
      />
      {copyUrl && (
        <p className="fixed bottom-10 left-[50%] translate-x-[-50%] bg-white border px-4 py-2 rounded-2xl text-sm text-gray-700 z-10">
          링크가 복사되었습니다!
        </p>
      )}
    </main>
  )
}
