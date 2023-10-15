import React, { PropsWithChildren } from 'react'
import spinner from '../assets/svg/spinner.svg'
import { IconType } from 'react-icons'

const btnSize = {
  s: 'w-20 h-11 text-xs px-4',
  m: 'w-40 h-12 text-sm px-4',
  l: 'w-80 h-[52px] text-sm px-6',
}

const btnLevel = {
  primary: `bg-blue-600 text-white rounded transition duration-200 ease-in-out hover:opacity-80 disabled:bg-gray-400`,
  secondary: `bg-gray-700 text-white rounded transition duration-200 ease-in-out hover:opacity-80 disabled:bg-gray-400`,
  ghost: `border border-blue-600 text-blue-600 rounded transition duration-200 ease-in-out`,
  outline: `border border-gray-400 text-gray-800 rounded transition duration-200 ease-in-out`,
}

type ButtonProps = (
  | {
      type: 'submit'
      level: 'primary'
      size: 'l'
    }
  | {
      type: 'button'
      level: keyof typeof btnLevel
      size: keyof typeof btnSize
    }
) & {
  label: string
  className?: string
  fullWidth?: boolean
  disabled?: boolean
  icon?: IconType
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export default function Button({
  label,
  type,
  level,
  size,
  className,
  disabled,
  icon: Icon,
  fullWidth,
  onClick,
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
      ${btnSize[size]}
      ${btnLevel[level]}
      ${Icon && 'flex justify-center items-center'}
      ${fullWidth && '!w-full'}
      ${className}`}
    >
      {disabled ? (
        <img src={spinner} alt="Loading" className="h-6 mx-auto" />
      ) : (
        <>
          {Icon && <Icon size={20} className="mr-1" />}
          <div>{label}</div>
        </>
      )}
    </button>
  )
}
