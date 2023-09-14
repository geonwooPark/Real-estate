import React, { PropsWithChildren } from 'react'
import spinner from '../../assets/svg/spinner.svg'

const btnSize = {
  s: 'w-20 h-11 text-xs px-4',
  m: 'w-40 h-12 text-sm px-4',
  l: 'w-80 h-[52px] text-sm px-6',
}

const btnLevel = {
  primary:
    'bg-blue-600 text-white rounded transition duration-200 ease-in-out hover:bg-blue-500 active:bg-blue-800 disabled:bg-gray-400',
  secondary:
    'bg-white rounded transition duration-200 ease-in-out hover:bg-gray-200 active:bg-gray-300 disabled:bg-gray-400',
  ghost:
    'border border-blue-600 text-blue-600 rounded transition duration-200 ease-in-out',
  outline:
    'border border-gray-400 text-gray-800 rounded transition duration-200 ease-in-out',
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
  className?: string
  fullWidth?: boolean
  disabled?: boolean
  withIcon?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export default function Button({
  children,
  type,
  level,
  size,
  className,
  disabled = false,
  withIcon = false,
  fullWidth = false,
  onClick,
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${btnSize[size]} ${btnLevel[level]} ${
        withIcon && 'flex justify-center items-center'
      } ${fullWidth && '!w-full'} ${className}`}
    >
      <>
        {disabled ? (
          <img src={spinner} alt="Loading" className="h-6 mx-auto" />
        ) : (
          children
        )}
      </>
    </button>
  )
}
