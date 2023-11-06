import React, { PropsWithChildren, useEffect, useState } from 'react'

interface DropDownMenuProps {
  label: string
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DropDownMenu({
  label,
  isOpen,
  children,
  setIsOpen,
}: PropsWithChildren<DropDownMenuProps>) {
  const [animation, setAnimation] = useState(false)

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
        onClick={() => setIsOpen(!isOpen)}
        className="w-[60px] bg-white px-4 py-2 border shadow-md rounded-sm cursor-pointer"
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
