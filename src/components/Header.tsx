import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import useAuthStatus from '../hooks/useAuthStatus'
import { auth } from '../firebase'
import MenuIcon from './MenuIcon'
import { useAppSelector } from '../store/store'

const { kakao } = window as any

export default function Header() {
  const map = useAppSelector((state) => state.map.map)

  const location = useLocation()
  const navigate = useNavigate()

  const { loggedIn, unread, setLoggedIn, checkingStatus } = useAuthStatus()
  const [showMenu, setShowMenu] = useState(false)

  const goHome = () => {
    navigate('/')
    if (map) {
      kakao.maps.load(() => {
        const moveLatLon = new kakao.maps.LatLng(37.574187, 126.976882)
        map.setCenter(moveLatLon)
        map.setLevel(8)
      })
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
    <header className="border-b">
      <div
        className={`bg-white sticky w-full h-[48px] px-4 top-0 z-50 sm:max-w-6xl sm:mx-auto sm:flex sm:justify-between`}
      >
        <div className="w-full h-full flex items-center justify-between sm:w-auto sm:border-none">
          <div onClick={goHome} className="font-bold text-2xl cursor-pointer">
            부동산직거래
          </div>
          <MenuIcon
            showMenu={showMenu}
            setShowMenu={setShowMenu}
            className={'sm:hidden'}
          />
        </div>
        <div className="h-full hidden sm:block">
          <ul className="h-full text-sm flex gap-4 text-gray-400">
            {loggedIn ? (
              <>
                <li
                  className={`border-b-[3px] border-b-transparent ${
                    pathMatchRoute('/create-listing') &&
                    'sm:border-b-black text-black'
                  }`}
                >
                  <Link to={'/create-listing'} className="block leading-[48px]">
                    매물등록
                  </Link>
                </li>
                <li
                  className={`relative border-b-[3px] border-b-transparent ${
                    pathMatchRoute('/chat') && 'sm:border-b-black text-black'
                  }`}
                >
                  <Link to={'/chat'} className="block leading-[48px]">
                    메시지
                  </Link>
                  {unread.length !== 0 && (
                    <span className="absolute top-2 -right-2 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                  )}
                </li>
                <li
                  className={`border-b-[3px] border-b-transparent ${
                    pathMatchRoute('/profile') && 'sm:border-b-black text-black'
                  }`}
                >
                  <Link to={'/profile'} className="block leading-[48px]">
                    프로필
                  </Link>
                </li>
                <li className="text-red-400">
                  <button onClick={onLogout} className="block h-full">
                    로그아웃
                  </button>
                </li>
              </>
            ) : (
              !checkingStatus && (
                <li
                  className={`text-gray-400 border-b-[3px] border-b-transparent ${
                    pathMatchRoute('/sign-in') &&
                    'sm:border-b-black !text-black'
                  }`}
                >
                  <Link to={'/sign-in'} className="block leading-[48px]">
                    로그인
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      <div
        className={`absolute z-[40] w-full border-b transition sm:hidden
        ${showMenu ? 'translate-y-0' : '-translate-y-full'}
      `}
      >
        <ul className="text-center text-sm bg-gray-50 text-gray-400">
          {loggedIn ? (
            <>
              <li
                className={`${
                  pathMatchRoute('/create-listing') && 'text-black'
                }`}
              >
                <Link to={'/create-listing'} className="block py-2">
                  매물등록
                </Link>
              </li>
              <li className={`${pathMatchRoute('/chat') && 'text-black'}`}>
                <Link to={'/chat'} className="block py-2">
                  메시지
                </Link>
              </li>
              <li className={`${pathMatchRoute('/profile') && 'text-black'}`}>
                <Link to={'/profile'} className="block py-2">
                  프로필
                </Link>
              </li>
              <li className="text-red-400">
                <button onClick={onLogout} className="block w-full h-full py-2">
                  로그아웃
                </button>
              </li>
            </>
          ) : (
            <li
              className={`text-gray-400 border-b-[3px] border-b-transparent ${
                pathMatchRoute('/sign-in') && 'sm:border-b-black !text-black'
              }`}
            >
              <Link to={'/sign-in'} className="block leading-[48px]">
                로그인
              </Link>
            </li>
          )}
        </ul>
      </div>
    </header>
  )
}
