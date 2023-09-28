import React, { useContext, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuthStatus from '../hooks/useAuthStatus'
import { auth } from '../firebase'
import MenuIcon from './MenuIcon'
import { MapContext } from '../App'

const { kakao } = window as any

export default function Header() {
  const { map } = useContext(MapContext)

  const location = useLocation()
  const navigate = useNavigate()
  const { loggedIn, setLoggedIn, checkingStatus } = useAuthStatus()
  const [showMenu, setShowMenu] = useState(false)

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
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="px-4 sm:max-w-6xl sm:mx-auto sm:flex sm:flex-row sm:justify-between">
        <div className="w-full border-b flex items-center justify-between sm:w-auto sm:border-none">
          <img
            src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg"
            alt="logo"
            className="h-5 my-3 cursor-pointer"
            onClick={() => {
              navigate('/')
              const moveLatLon = new kakao.maps.LatLng(37.574187, 126.976882)
              map.setCenter(moveLatLon)
              map.setLevel(8)
            }}
          />
          <MenuIcon
            showMenu={showMenu}
            setShowMenu={setShowMenu}
            className={'sm:hidden'}
          />
        </div>

        <div
          className={`absolute sm:relative left-0 w-full sm:w-auto transition-transform duration-200 ease-in-out shadow-md sm:shadow-none ${
            showMenu ? 'translate-y-0' : '-translate-y-[300px]'
          } sm:translate-y-0`}
        >
          <ul className="bg-white px-0 flex flex-col sm:flex-row sm:space-x-10 text-center">
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
