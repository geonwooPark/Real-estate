import React, { useReducer, useState } from 'react'
import ResearchAddress from '../components/ResearchAddress'
import { TbAirConditioning } from 'react-icons/tb'
import OptionBtn from '../components/OptionBtn'
import { numberToKorean } from '../utils/numberToKorean'
import { formReducer, initialState } from '../reducers/formReducer'

export default function CreateListing() {
  const [
    {
      itemType,
      address,
      rooms,
      bathrooms,
      parking,
      options,
      detail,
      price,
      maintenanceFee,
      availableDate,
    },
    dispatch,
  ] = useReducer(formReducer, initialState)
  const [showResearchAddress, setShowResearchAddress] = useState(false)

  return (
    <main className="max-w-md mx-auto px-2">
      <h1 className="text-3xl text-center mt-6 font-bold">매물 올리기</h1>
      <form>
        {/* 사진 업로드 */}
        <p className="text-lg mt-6 mb-1 font-semibold">매물 사진</p>
        <label
          htmlFor="input-file"
          className="bg-blue-600 text-white text-sm rounded-2xl px-2 py-1.5 cursor-pointer transition duration-200 ease-in-out hover:bg-blue-500 "
        >
          사진 선택
        </label>
        <input
          type="file"
          id="input-file"
          accept=".jpg, .png, .jpeg"
          multiple
          required
          className="hidden"
        />
        <small className="text-gray-700 ml-1">
          이미지는 최대 6개까지 첨부 가능합니다.
        </small>
        <div className="flex flex-nowrap overflow-x-scroll gap-4 mt-3 sm:flex-wrap">
          <div className="w-[96px] h-[62px] basis-auto grow-0 shrink-0 border border-blue-700 rounded">
            <img />
          </div>
          <div className="w-[96px] h-[62px] basis-auto grow-0 shrink-0 border border-blue-700 rounded">
            <img />
          </div>
          <div className="w-[96px] h-[62px] basis-auto grow-0 shrink-0 border border-blue-700 rounded">
            <img />
          </div>
          <div className="w-[96px] h-[62px] basis-auto grow-0 shrink-0 border border-blue-700 rounded">
            <img />
          </div>
          <div className="w-[96px] h-[62px] basis-auto grow-0 shrink-0 border border-blue-700 rounded">
            <img />
          </div>
          <div className="w-[96px] h-[62px] basis-auto grow-0 shrink-0 border border-blue-700 rounded">
            <img />
          </div>
        </div>
        {/* 유형 선택 */}
        <p className="text-lg mt-6 font-semibold">매물 유형</p>
        <div className="flex space-x-4">
          <button
            type="button"
            name="sale"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              dispatch({ type: 'select-type', payload: e.currentTarget.name })
            }
            className={`px-7 py-3 font-medium text-sm text-blue-600 rounded border-2 border-blue-600 transition duration-200 ease-in-out w-full hover:bg-blue-300 active:bg-blue-600 active:text-white ${
              itemType === 'sale' && 'bg-blue-600 !text-white'
            } `}
          >
            매매
          </button>
          <button
            type="button"
            name="jeonse"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              dispatch({ type: 'select-type', payload: e.currentTarget.name })
            }
            className={`px-7 py-3 font-medium text-sm text-blue-600 rounded border-2 border-blue-600 transition duration-200 ease-in-out w-full hover:bg-blue-300 active:bg-blue-600 active:text-white ${
              itemType === 'jeonse' && 'bg-blue-600 !text-white'
            } `}
          >
            전세
          </button>
          <button
            type="button"
            name="monthly"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              dispatch({ type: 'select-type', payload: e.currentTarget.name })
            }
            className={`px-7 py-3 font-medium text-sm text-blue-600 border-2 border-blue-600 transition duration-200 ease-in-out w-full rounded hover:bg-blue-300 active:bg-blue-600 active:text-white ${
              itemType === 'monthly' && 'bg-blue-600 !text-white'
            } `}
          >
            월세
          </button>
        </div>
        {/* 주소 선택 */}
        <p className="text-lg mt-6 font-semibold">주소</p>
        <input
          className="w-full mb-6 rounded text-sm px-4 py-3"
          value={address}
          placeholder="주소를 검색해보세요."
          required
          readOnly
          onClick={() => {
            setShowResearchAddress(!showResearchAddress)
          }}
        />
        {showResearchAddress && (
          <ResearchAddress
            dispatch={dispatch}
            setShowResearchAddress={setShowResearchAddress}
          />
        )}
        {/* 방 갯수 선택 */}
        <div className="flex space-x-4 mb-6">
          <div>
            <p className="text-lg font-semibold">방</p>
            <input
              type="number"
              value={rooms}
              className="w-full px-4 py-3 rounded text-sm text-center"
              min={1}
              max={10}
              required
              onChange={(e) => {
                dispatch({
                  type: 'select-rooms',
                  payload: e.target.valueAsNumber,
                })
              }}
            />
          </div>
          {/* 욕실 갯수 선택 */}
          <div>
            <p className="text-lg font-semibold">욕실</p>
            <input
              type="number"
              value={bathrooms}
              className="w-full px-4 py-3 rounded text-sm text-center"
              min={1}
              max={10}
              required
              onChange={(e) => {
                dispatch({
                  type: 'select-bathrooms',
                  payload: e.target.valueAsNumber,
                })
              }}
            />
          </div>
        </div>
        {/* 주차 여부 선택 */}
        <p className="text-lg mt-6 font-semibold">주차</p>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() =>
              dispatch({
                type: 'select-parking',
              })
            }
            className={`px-7 py-3 font-medium text-sm text-blue-600 rounded border-2 border-blue-600 transition duration-200 ease-in-out w-full hover:bg-blue-300 active:bg-blue-600 active:text-white ${
              parking && 'bg-blue-600 !text-white'
            } `}
          >
            가능
          </button>
          <button
            type="button"
            onClick={() =>
              dispatch({
                type: 'select-parking',
              })
            }
            className={`px-7 py-3 font-medium text-sm text-blue-600 rounded border-2 border-blue-600 transition duration-200 ease-in-out w-full hover:bg-blue-300 active:bg-blue-600 active:text-white ${
              !parking && 'bg-blue-600 !text-white'
            } `}
          >
            불가능
          </button>
        </div>
        {/* 옵션 선택 */}
        <p className="text-lg mt-6 font-semibold">옵션</p>
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-5">
          <OptionBtn dispatch={dispatch} option={options.싱크대} name="싱크대">
            <TbAirConditioning size={20} className="mb-1" />
          </OptionBtn>
          <OptionBtn dispatch={dispatch} option={options.에어컨} name="에어컨">
            <TbAirConditioning size={20} className="mb-1" />
          </OptionBtn>
          <OptionBtn dispatch={dispatch} option={options.세탁기} name="세탁기">
            <TbAirConditioning size={20} className="mb-1" />
          </OptionBtn>
          <OptionBtn dispatch={dispatch} option={options.냉장고} name="냉장고">
            <TbAirConditioning size={20} className="mb-1" />
          </OptionBtn>
          <OptionBtn
            dispatch={dispatch}
            option={options.가스레인지}
            name="가스레인지"
          >
            <TbAirConditioning size={20} className="mb-1" />
          </OptionBtn>
          <OptionBtn dispatch={dispatch} option={options.옷장} name="옷장">
            <TbAirConditioning size={20} className="mb-1" />
          </OptionBtn>
          <OptionBtn dispatch={dispatch} option={options.책상} name="책상">
            <TbAirConditioning size={20} className="mb-1" />
          </OptionBtn>
          <OptionBtn dispatch={dispatch} option={options.침대} name="침대">
            <TbAirConditioning size={20} className="mb-1" />
          </OptionBtn>
          <OptionBtn
            dispatch={dispatch}
            option={options.전자레인지}
            name="전자레인지"
          >
            <TbAirConditioning size={20} className="mb-1" />
          </OptionBtn>
          <OptionBtn dispatch={dispatch} option={options.TV} name="TV">
            <TbAirConditioning size={20} className="mb-1" />
          </OptionBtn>
        </div>
        {/* 가격 설정 */}
        <p className="text-lg mt-6 font-semibold">매물가</p>
        <div className="flex items-center relative">
          <input
            type="number"
            value={price}
            required
            className="w-full rounded text-sm text-center px-4 py-3"
            onChange={(e) => {
              dispatch({
                type: 'set-price',
                payload: e.target.valueAsNumber,
              })
            }}
          />
          <p className="ml-2 text-sm text-gray-700 whitespace-nowrap">
            만원 <span>{itemType === 'monthly' && '/ 월'}</span>
          </p>
          <small className="absolute right-0 top-14">
            {price ? numberToKorean(price) + '원' : ''}
          </small>
        </div>
        {/* 관리비 */}
        <p className="text-lg mt-6 font-semibold">관리비</p>
        <div className="flex items-center relative">
          <input
            type="number"
            value={maintenanceFee}
            required
            className="rounded text-sm text-center px-4 py-3"
            onChange={(e) => {
              dispatch({
                type: 'set-maintenanceFee',
                payload: e.target.valueAsNumber,
              })
            }}
          />
          <p className="ml-2 text-sm text-gray-700 whitespace-nowrap">
            만원 / 월
          </p>
        </div>
        {/* 입주 가능일 선택 */}
        <p className="text-lg mt-6 font-semibold">입주 가능 날짜</p>
        <input
          type="date"
          value={availableDate}
          className="rounded text-sm text-center px-4 py-3"
          onChange={(e) => {
            dispatch({
              type: 'select-availableDate',
              payload: e.target.value.toString(),
            })
          }}
        />

        {/* 상세설명 작성 */}
        <p className="text-lg mt-6 font-semibold">상세설명</p>
        <textarea
          cols={30}
          rows={10}
          value={detail}
          placeholder="상세한 설명을 적어주세요."
          onChange={(e) =>
            dispatch({ type: 'write-detail', payload: e.target.value })
          }
          className="w-full rounded text-sm px-4 py-3 mb-6"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium rounded transition duration-200 ease-in-out hover:bg-blue-400  active:bg-blue-800 disabled:bg-gray-400"
        >
          매물 등록
        </button>
      </form>
    </main>
  )
}
