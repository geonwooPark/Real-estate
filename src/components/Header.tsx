import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()

  const pathMathRoute = (route: string) => {
    if (route === location.pathname) {
      return true
    }
  }

  return (
    <div className="bg-white border-b sticky top-0 z-50">
      <header className="flex justify-between items-center px-3 max-w-6xl mx-auto">
        <div>
          <img
            src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg"
            alt="logo"
            className="h-5 cursor-pointer"
            onClick={() => navigate('/')}
          />
        </div>
        <div>
          <ul className="flex space-x-10">
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${
                pathMathRoute('/') && 'border-b-red-400 text-black'
              }`}
              onClick={() => navigate('/profile')}
            >
              홈
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${
                pathMathRoute('/offers') && 'border-b-red-400 text-black'
              }`}
              onClick={() => navigate('/offers')}
            >
              판매
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${
                pathMathRoute('/sign-in') && 'border-b-red-400 text-black'
              }`}
              onClick={() => navigate('/sign-in')}
            >
              로그인
            </li>
          </ul>
        </div>
      </header>
    </div>
  )
}
