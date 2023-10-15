import React from 'react'
import { IconType } from 'react-icons'

interface InputProps {
  type: 'text' | 'name' | 'email' | 'password'
  name: string
  value: string
  disabled?: boolean
  placeholder?: string
  className: string
  icon?: IconType
  iconAction?: () => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Input({
  type,
  name,
  value,
  disabled,
  placeholder,
  className,
  onChange,
  icon: Icon,
  iconAction,
}: InputProps) {
  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={onChange}
        className={`px-4 py-3 text-sm text-gray-700 bg-white border border-gray-300 rounded outline-none focus:border-blue-400
        ${className}
        `}
      />
      {Icon && (
        <div
          onClick={iconAction}
          className="absolute right-3 top-3 cursor-pointer"
        >
          <Icon size={20} />
        </div>
      )}
    </div>
  )
}
