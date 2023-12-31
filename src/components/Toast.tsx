import React, { useEffect, useState } from 'react'
import { AlertType } from '../interfaces/interfaces'
import { useAppDispatch } from '../store/store'
import { initialState, setAlert } from '../store/features/alertSlice'

interface ToastProps {
  alert: AlertType
}

export default function Toast({ alert }: ToastProps) {
  const [animation, setAnimation] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const upToast = setTimeout(() => setAnimation(true), 100)
    const downToast = setTimeout(() => setAnimation(false), 2600)
    const closeToast = setTimeout(() => {
      dispatch(setAlert(initialState))
    }, 3100)

    return () => {
      clearTimeout(upToast)
      clearTimeout(downToast)
      clearTimeout(closeToast)
    }
  }, [alert])

  return (
    <div
      className={`fixed z-[100] bottom-0 w-full bg-slate-800 px-4 py-2 text-white text-xs text-center border-b-2 border-solid transition duration-500 ease-in-out ${
        alert.status === 'error'
          ? 'border-red-600'
          : alert.status === 'success'
          ? 'border-green-600'
          : 'border-none'
      } ${animation ? 'translate-y-0' : 'translate-y-full'}`}
    >
      {alert.message}
    </div>
  )
}
