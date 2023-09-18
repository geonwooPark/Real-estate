import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuthStatus from '../hooks/useAuthStatus'
import { auth } from '../firebase'
import MenuIcon from './MenuIcon'

export default function Header() {
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
    <div className="bg-white border-b sticky top-0 z-50">
      <header className="flex flex-col justify-between px-4 sm:max-w-6xl sm:mx-auto sm:flex-row">
        <div className="w-full border-b flex items-center justify-between z-99 sm:w-auto sm:border-none ">
          <img
            src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg"
            alt="logo"
            className="h-5 my-3 cursor-pointer"
            onClick={() => navigate('/')}
          />
          <MenuIcon
            showMenu={showMenu}
            setShowMenu={setShowMenu}
            className={'sm:hidden'}
          />
        </div>

        <div>
          <ul className="bg-white flex flex-col text-center sm:flex-row sm:space-x-10 px-0">
            {loggedIn ? (
              <>
                <li
                  className={`cursor-pointer py-3 text-sm text-gray-400 border-b-[3px] border-b-transparent ${
                    pathMatchRoute('/contact') &&
                    'sm:border-b-red-400 !text-black'
                  }`}
                  onClick={() => navigate('/contact')}
                >
                  메시지
                </li>
                <li
                  className={`cursor-pointer py-3 text-sm text-gray-400 border-b-[3px] border-b-transparent ${
                    pathMatchRoute('/profile') &&
                    'sm:border-b-red-400 !text-black'
                  }`}
                  onClick={() => navigate('/profile')}
                >
                  프로필
                </li>
                <li
                  className={`cursor-pointer py-3 text-sm text-gray-400 border-b-[3px] border-b-transparent ${
                    pathMatchRoute('/create-listing') &&
                    'sm:border-b-red-400 !text-black'
                  }`}
                  onClick={() => navigate('/create-listing')}
                >
                  매물등록
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
                    pathMatchRoute('/sign-in') &&
                    '!border-b-red-400 !text-black'
                  }`}
                  onClick={() => navigate('/sign-in')}
                >
                  로그인
                </li>
              )
            )}
          </ul>
        </div>
      </header>
    </div>
  )
}
