import React, { useContext, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuthStatus from '../hooks/useAuthStatus'
import { auth } from '../firebase'
import MenuIcon from './MenuIcon'
import { MapContext, ToastContext } from '../App'

const { kakao } = window as any

export default function Header() {
  const { map } = useContext(MapContext)

  const location = useLocation()
  const navigate = useNavigate()
  const { loggedIn, setLoggedIn, checkingStatus } = useAuthStatus()
  const [showMenu, setShowMenu] = useState(false)
  const setAlert = useContext(ToastContext)

  const goHome = () => {
    navigate('/')
    try {
      kakao.maps.load(() => {
        const moveLatLon = new kakao.maps.LatLng(37.574187, 126.976882)
        map.setCenter(moveLatLon)
        map.setLevel(8)
      })
    } catch (error) {
      if (error instanceof Error) {
        setAlert({
          status: 'error',
          message: error.message,
        })
      }
    }
  }

  const onLogout = () => {
    auth.signOut()
    setLoggedIn(false)
    navigate('/sign-in')
  }

  const pathMatchRoute = (route: string) => {
    if (route === location.pathname) {
      return true
    }
  }

  return (
    <header
      className={`bg-white border-b sticky w-full h-[48px] top-0 z-50 sm:max-w-6xl sm:mx-auto sm:flex sm:justify-between
                  ${!showMenu && 'overflow-hidden sm:overflow-auto'}
                `}
    >
      <div className="w-full h-[48px] px-4 border-b flex items-center justify-between sm:w-auto sm:border-none">
        {/* <img
          src=""
          alt="logo"
          className="h-5 my-3 cursor-pointer"
          onClick={() => {
            navigate('/')
            const moveLatLon = new kakao.maps.LatLng(37.574187, 126.976882)
            map.setCenter(moveLatLon)
            map.setLevel(8)
          }}
        /> */}
        <div onClick={goHome} className="font-bold text-3xl cursor-pointer">
          부동산직거래
        </div>
        <MenuIcon
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          className={'sm:hidden'}
        />
      </div>

      <div className="overflow-hidden border-b sm:border-none">
        <div
          className={`w-full transition-transform duration-200 ease-in-out sm:translate-y-0 bg-white
                      ${showMenu ? 'translate-y-0' : '-translate-y-full'}
                    `}
        >
          <ul className="px-4 flex flex-col sm:flex-row sm:gap-10 sm:justify-end text-center">
            {loggedIn ? (
              <>
                <li
                  className={`cursor-pointer py-3 text-sm text-gray-400 border-b-[3px] border-b-transparent ${
                    pathMatchRoute('/create-listing') &&
                    'sm:border-b-black !text-black'
                  }`}
                  onClick={() => navigate('/create-listing')}
                >
                  매물등록
                </li>
                <li
                  className={`cursor-pointer py-3 text-sm text-gray-400 border-b-[3px] border-b-transparent ${
                    pathMatchRoute('/chat') && 'sm:border-b-black !text-black'
                  }`}
                  onClick={() => navigate('/chat')}
                >
                  메시지
                </li>
                <li
                  className={`cursor-pointer py-3 text-sm text-gray-400 border-b-[3px] border-b-transparent ${
                    pathMatchRoute('/profile') &&
                    'sm:border-b-black !text-black'
                  }`}
                  onClick={() => navigate('/profile')}
                >
                  프로필
                </li>
                <li className="py-3 text-sm border-b-[3px] border-b-transparent">
                  <button
                    onClick={onLogout}
                    className="text-red-400 rounded-md transition duration-200 ease-in-out"
                  >
                    로그아웃
                  </button>
                </li>
              </>
            ) : (
              !checkingStatus && (
                <li
                  className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${
                    pathMatchRoute('/sign-in') && '!border-b-black !text-black'
                  }`}
                  onClick={() => navigate('/sign-in')}
                >
                  로그인
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </header>
  )
}
