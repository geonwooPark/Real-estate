import React from 'react'
import { IconType } from 'react-icons'

interface InputProps {
  type: 'text' | 'name' | 'email' | 'password'
  name: string
  value: string
  label?: string
  disabled?: boolean
  className?: string
  icon?: IconType
  iconAction?: () => void
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Input({
  type,
  name,
  value,
  label,
  disabled,
  className,
  onChange,
  icon: Icon,
  iconAction,
}: InputProps) {
  return (
    <div className="w-full relative">
      <input
        type={type}
        name={name}
        value={value}
        disabled={disabled}
        placeholder=" "
        autoComplete="off"
        onChange={onChange}
        className={`peer w-full px-4 pb-2 pt-5 text-sm bg-white border rounded-md outline-none transition
          ${className}
        `}
      />
      <label
        className={`absolute top-4 left-4 z-10 text-sm duration-150 origin-[0] -translate-y-3.5 text-gray-400 scale-75
          peer-placeholder-shown:scale-100
          peer-placeholder-shown:translate-y-0
          peer-focus:scale-75
          peer-focus:-translate-y-3.5
          peer-focus:text-gray-400`}
      >
        {label}
      </label>
      {Icon && (
        <div
          onClick={iconAction}
          className="absolute right-3 top-4 cursor-pointer"
        >
          <Icon size={20} />
        </div>
      )}
    </div>
  )
}
