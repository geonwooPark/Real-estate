import React, { PropsWithChildren, useEffect, useState } from 'react'

interface DropDownListProps {
  visibility: boolean
  className?: string
}
export type TypeTimer = ReturnType<typeof setTimeout>

export default function DropDownList({
  children,
  className,
  visibility,
}: PropsWithChildren<DropDownListProps>) {
  const [animation, setAnimation] = useState(false)
  useEffect(() => {
    let timer: TypeTimer
    if (visibility) {
      setAnimation(true)
    } else {
      timer = setTimeout(() => {
        setAnimation(false)
      }, 200)
    }

    return () => clearTimeout(timer)
  }, [visibility])

  return (
    <div
      className={`${className} ${
        visibility ? 'animate-slideFadeIn' : 'animate-slideFadeOut'
      }`}
    >
      {animation && children}
    </div>
  )
}
