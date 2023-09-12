import React, { Dispatch, PropsWithChildren } from 'react'
import { ActionWithPayload } from '../reducers/formReducer'

interface OptionBtn {
  dispatch: Dispatch<ActionWithPayload>
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
      className={`${
        option ? 'btn-ghost' : 'btn-outline'
      } h-full px-2 pt-3 pb-2 text-xs flex-col`}
    >
      {children}
      {name}
    </button>
  )
}
