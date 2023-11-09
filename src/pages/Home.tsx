import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import { db } from '../firebase'
import SideSlider from '../components/SideSlider'
import { HiOutlineRefresh } from 'react-icons/hi'
import { useAppDispatch, useAppSelector } from '../store/store'
import { setMap } from '../store/features/mapSlice'
import DropDownMenu from '../components/DropdownMenu'
import { setAlert } from '../store/features/alertSlice'
import { flushSync } from 'react-dom'

const { kakao } = window as any

export default function Home() {
  const map = useAppSelector((state) => state.map.map)
  const dispatch = useAppDispatch()

  const [listings, setListings] = useState<DocumentData[]>([])
  const [currentListing, setCurrentListing] = useState<DocumentData>({})
  const [keyword, setKeyword] = useState('')
  const [markers, setMarkers] = useState<any[]>([])
  const [clusterer, setClusterer] = useState<any>(null)
  const [showInfo, setShowInfo] = useState(false)
  const [showDropDownList, setShowDropDownList] = useState(false)
  const [itemType, setItemType] = useState<'매매' | '전세' | '월세' | '전체'>(
    '전체',
  )
  const [Isfiltered, setIsFlitered] = useState(false)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!keyword.replace(/^\s+|\s+$/g, '')) {
      return dispatch(
        setAlert({
          status: 'error',
          message: '키워드를 입력해주세요!',
        }),
      )
    }
    searchListings()
    setShowInfo(false)
    setKeyword('')
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setKeyword(value)
  }

  const searchListings = async () => {
    const regex = new RegExp(`${keyword}`)
    const result = listings.filter((listing) => {
      return (
        regex.test(listing.address.roadName) ||
        regex.test(listing.address.bname)
      )
    })
    if (result.length !== 0) {
      const bounds = new kakao.maps.LatLngBounds()
      for (let i = 0; i < result.length; i++) {
        bounds.extend(
          new kakao.maps.LatLng(result[i].latitude, result[i].longitude),
        )
      }
      map.setBounds(bounds)

      setIsFlitered(true)
      setListings(result)
    } else {
      const ps = new kakao.maps.services.Places()
      ps.keywordSearch(keyword, placesSearchCB)
      dispatch(
        setAlert({
          status: 'error',
          message: '검색 조건에 맞는 결과가 없습니다!',
        }),
      )
    }
  }

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

  const fetchData = async () => {
    const q = query(collection(db, 'listings'))
    const querySnap = await getDocs(q)
    const listings: DocumentData[] = []
    querySnap.forEach((doc) => listings.push(doc.data()))
    setListings(listings)
  }

  const fetchFilteredData = async (itemType?: '매매' | '전세' | '월세') => {
    const q = query(
      collection(db, 'listings'),
      where('itemType', '==', itemType),
    )
    const querySnap = await getDocs(q)
    const listings: DocumentData[] = []
    querySnap.forEach((doc) => listings.push(doc.data()))
    setListings(listings)
  }

  const resetFilter = async () => {
    await fetchData()
    setItemType('전체')
    setIsFlitered(false)
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
      dispatch(setMap(map))
    })
  }, [])

  useEffect(() => {
    if (markers) {
      markers.forEach((marker) => marker.setMap(null))
    }

    kakao.maps.load(async () => {
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
            `/category/${listings[i].itemType}/${listings[i].id}`,
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
    })
  }, [listings])

  useEffect(() => {
    if (clusterer) {
      clusterer.clear()
    }

    kakao.maps.load(async () => {
      const clusterer = new kakao.maps.MarkerClusterer({
        map: map,
        averageCenter: true,
        minLevel: 8,
      })
      setClusterer(clusterer)
      clusterer.addMarkers(markers)
    })
  }, [markers])

  return (
    <main className="relative overflow-hidden">
      <section className="w-full h-[300px] sm:h-[400px] md:h-[calc(100vh-48px)] relative">
        {Isfiltered ? (
          <button className="bg-white border rounded-md p-4 absolute top-2 left-2 z-10 shadow-md">
            <HiOutlineRefresh
              size={20}
              className={`cursor-pointer`}
              onClick={resetFilter}
            />
          </button>
        ) : (
          <div className="bg-white border rounded-md p-4 absolute top-2 left-2 z-10 flex gap-2 items-center shadow-md">
            <DropDownMenu
              label={itemType}
              labelClassName={itemType !== '전체' ? 'text-blue-600' : ''}
              isOpen={showDropDownList}
              setIsOpen={setShowDropDownList}
            >
              <ul className="bg-gray-50 border">
                <li className="border-b">
                  <button
                    type="button"
                    className="px-4 py-2"
                    onClick={() => {
                      fetchData()
                      setItemType('전체')
                      setShowDropDownList(false)
                    }}
                  >
                    전체
                  </button>
                </li>
                <li className="border-b">
                  <button
                    type="button"
                    className="px-4 py-2"
                    onClick={() => {
                      fetchFilteredData('매매')
                      setItemType('매매')
                      setShowDropDownList(false)
                    }}
                  >
                    매매
                  </button>
                </li>
                <li className="border-b">
                  <button
                    type="button"
                    className="px-4 py-2"
                    onClick={() => {
                      fetchFilteredData('전세')
                      setItemType('전세')
                      setShowDropDownList(false)
                    }}
                  >
                    전세
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="px-4 py-2"
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
            </DropDownMenu>
            <form onSubmit={onSubmit}>
              <div className="relative">
                <input
                  id="keyword"
                  type="text"
                  value={keyword}
                  onChange={onChange}
                  className="text-gray-700 w-full px-4 py-2 border shadow-sm text-sm focus:outline-none"
                  placeholder="장소를 검색해보세요."
                />
                <button
                  type="submit"
                  className="text-gray-700 absolute top-[50%] right-0 -translate-y-[50%]"
                >
                  <BsSearch size={16} className="mr-4" />
                </button>
              </div>
            </form>
          </div>
        )}
        <div id="map" className="w-full h-full"></div>
      </section>
      {currentListing.images ? (
        <SideSlider
          showInfo={showInfo}
          setShowInfo={setShowInfo}
          listing={currentListing}
        />
      ) : (
        <div className="flex justify-center items-center h-[calc(100vh-48px-300px)] sm:h-[calc(100vh-48px-400px)] md:hidden">
          <h6 className="text-center text-gray-400">매물을 선택해주세요.</h6>
        </div>
      )}
    </main>
  )
}
