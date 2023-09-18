import React from 'react'

interface MenuIconProps {
  showMenu: boolean
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>
  className: string
}

export default function MenuIcon({
  showMenu,
  setShowMenu,
  className,
}: MenuIconProps) {
  return (
    <div
      className={`flex flex-col items-center px-2 py-3 cursor-pointer ${className}`}
      onClick={() => setShowMenu(!showMenu)}
    >
      <div
        className={`w-6 h-[2px] bg-black mb-2 rounded-xl transition duration-200 ease-in-out ${
          showMenu && 'rotate-45 translate-y-[5px]'
        }`}
      ></div>
      <div
        className={`w-6 h-[2px] bg-black rounded-xl transition duration-200 ease-in-out ${
          showMenu && '-rotate-45 -translate-y-[5px]'
        }`}
      ></div>
    </div>
  )
}
