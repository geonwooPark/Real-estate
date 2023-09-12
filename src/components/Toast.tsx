import React, { useEffect, useState } from 'react'
import { Alert } from '../interfaces/interfaces'
import { initAlert } from '../pages/Signup'

interface ToastProps {
  alert: Alert
  setAlert: React.Dispatch<React.SetStateAction<Alert>>
}

export default function Toast({ alert, setAlert }: ToastProps) {
  const [animation, setAnimation] = useState(false)

  useEffect(() => {
    const upToast = setTimeout(() => setAnimation(true), 100)
    const downToast = setTimeout(() => setAnimation(false), 2600)
    const closeToast = setTimeout(() => {
      setAlert(initAlert)
    }, 3100)

    return () => {
      clearTimeout(upToast)
      clearTimeout(downToast)
      clearTimeout(closeToast)
    }
  }, [alert])

  return (
    <div
      className={`fixed bottom-0 w-full bg-slate-800 px-4 py-2 text-white text-xs text-center border-b-2 border-solid transition duration-500 ease-in-out ${
        alert.status === 'error'
          ? 'border-red-600'
          : alert.status === 'success'
          ? 'border-green-600'
          : 'border-none'
      } ${animation ? 'translate-y-0' : 'translate-y-10'}`}
    >
      {alert.message}
    </div>
  )
}
