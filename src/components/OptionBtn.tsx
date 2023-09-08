import React, { Dispatch, PropsWithChildren } from 'react'
import { ActionWithStringPayload } from '../reducers/formReducer'

interface OptionBtn {
  dispatch: Dispatch<ActionWithStringPayload>
  option: boolean
  name: string
}

export default function OptionBtn({
  children,
  dispatch,
  option,
  name,
}: PropsWithChildren<OptionBtn>) {
  return (
    <button
      type="button"
      name={name}
      onClick={(e) =>
        dispatch({ type: 'select-options', payload: e.currentTarget.name })
      }
      className={`px-2 pt-3 pb-2 text-xs text-gray-700 border-2 border-blue-600 rounded flex flex-col justify-center items-center hover:bg-blue-300 active:bg-blue-600 active:text-white ${
        option && 'bg-blue-600 !text-white'
      }`}
    >
      {children}
      {name}
    </button>
  )
}
