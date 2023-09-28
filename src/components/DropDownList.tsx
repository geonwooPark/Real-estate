import React, { PropsWithChildren, useEffect, useState } from 'react'

interface DropDownListProps {
  visibility: boolean
}
type TypeTimer = ReturnType<typeof setTimeout>

export default function DropDownList({
  children,
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
      }, 400)
    }

    return () => clearTimeout(timer)
  }, [visibility])

  return (
    <div
      className={visibility ? 'animate-slideFadeIn' : 'animate-slideFadeOut'}
    >
      {animation && children}
    </div>
  )
}
