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
            const {
              address: dAddress,
              zonecode,
              bname,
              sido,
              sigungu,
              roadname,
            } = data

            await axios({
              url:
                'https://dapi.kakao.com/v2/local/search/address.json?query=' +
                dAddress,
              headers: {
                Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_API_KEY}`,
              },
            }).then((result) => {
              const { x, y }: { x: number; y: number } =
                result.data.documents[0]
              const latitude = y
              const longitude = x
              dispatch({ type: 'research-latitude', payload: latitude })
              dispatch({ type: 'research-longitude', payload: longitude })
            })

            const address = {
              dAddress,
              zonecode,
              roadName: `${sido} ${sigungu} ${roadname}`,
              bname,
            }
            dispatch({ type: 'research-address', payload: address })
            setShowResearchAddress(false)
          }}
        />
      </div>
    </div>
  )
}
