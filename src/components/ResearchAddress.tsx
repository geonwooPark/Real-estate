import React, { Dispatch } from 'react'
import DaumPostcode from 'react-daum-postcode'
import { ActionWithPayload } from '../reducers/formReducer'
import axios from 'axios'

interface ResearchAddressProps {
  setShowResearchAddress: React.Dispatch<React.SetStateAction<boolean>>
  dispatch: Dispatch<ActionWithPayload>
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
          onComplete={async (data) => {
            setShowResearchAddress(false)
            dispatch({ type: 'research-address', payload: data.address })
            dispatch({ type: 'research-zipcode', payload: data.zonecode })
            const placeAddress = data.address
            await axios({
              url:
                'https://dapi.kakao.com/v2/local/search/address.json?query=' +
                placeAddress,
              headers: {
                Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_API_KEY}`,
              },
            }).then((result) => {
              const { x, y } = result.data.documents[0]
              dispatch({ type: 'research-latitude', payload: y })
              dispatch({ type: 'research-longitude', payload: x })
            })
          }}
        />
      </div>
    </div>
  )
}
