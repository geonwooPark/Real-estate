import React, { Dispatch } from 'react'
import { ActionWithPayload } from '../reducers/formReducer'
import { IconType } from 'react-icons'

interface OptionBtnProps {
  dispatch: Dispatch<ActionWithPayload>
  option: boolean
  label: string
  icon: IconType
}

export default function OptionBtn({
  dispatch,
  option,
  label,
  icon: Icon,
}: OptionBtnProps) {
  return (
    <button
      type="button"
      name={label}
      onClick={(e) =>
        dispatch({ type: 'select-options', payload: e.currentTarget.name })
      }
      className={`
      h-full px-2 pt-3 pb-2 flex flex-col items-center border border-gray-400 text-gray-800 rounded
      ${option ? 'btn-ghost' : 'btn-outline'}`}
    >
      <Icon size={20} className="mb-1" />
      <div className="text-xs">{label}</div>
    </button>
  )
}
