import React, { PropsWithChildren, useEffect, useState } from 'react'

interface DropDownMenuProps {
  label: '전체' | '매매' | '전세' | '월세'
  labelClassName?: string
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DropDownMenu({
  label,
  labelClassName,
  isOpen,
  children,
  setIsOpen,
}: PropsWithChildren<DropDownMenuProps>) {
  const [animation, setAnimation] = useState(false)

  const onClick = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (isOpen) {
      setAnimation(true)
    } else {
      timer = setTimeout(() => {
        setAnimation(false)
      }, 200)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [isOpen])

  return (
    <div className="relative text-gray-700 text-sm">
      <div
        onClick={onClick}
        className={`w-[60px] bg-white px-4 py-2 border shadow-sm cursor-pointer 
          ${labelClassName}
        `}
      >
        {label}
      </div>
      <div className="w-full absolute z-20 overflow-hidden">
        <div
          className={`${
            isOpen ? 'animate-slideFadeIn' : 'animate-slideFadeOut'
          }`}
        >
          {animation && children}
        </div>
      </div>
    </div>
  )
}
