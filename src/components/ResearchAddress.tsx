import React, { Dispatch } from 'react'
import DaumPostcode from 'react-daum-postcode'
import { ActionWithStringPayload } from '../reducers/formReducer'

interface ResearchAddressProps {
  setShowResearchAddress: React.Dispatch<React.SetStateAction<boolean>>
  dispatch: Dispatch<ActionWithStringPayload>
}

export default function ResearchAddress({
  setShowResearchAddress,
  dispatch,
}: ResearchAddressProps) {
  return (
    <div
      className="bg-black bg-opacity-50 flex items-center justify-center fixed left-0 right-0 bottom-0 top-0 z-50"
      onClick={() => {
        setShowResearchAddress(false)
      }}
    >
      <div>
        <DaumPostcode
          onComplete={(data) => {
            setShowResearchAddress(false)
            dispatch({ type: 'select-address', payload: data.address })
          }}
        />
      </div>
    </div>
  )
}
