import React, { useReducer, useState, useTransition } from 'react'
import { TbAirConditioning } from 'react-icons/tb'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { AiOutlinePlus } from 'react-icons/ai'
import { numberToKorean } from '../utils/numberToKorean'
import { formReducer, initialState } from '../reducers/formReducer'
import { initAlert } from './Signup'
import OptionBtn from '../components/OptionBtn'
import ResearchAddress from '../components/ResearchAddress'
import Toast from '../components/Toast'
import Button from '../components/common/Button'
import spinner from '../assets/svg/spinner.svg'
import { auth, db, storage } from '../firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { Timestamp, addDoc, collection, doc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router'
import { Imgs } from '../interfaces/interfaces'

export default function CreateListing() {
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(formReducer, initialState)
  const [fileURLs, setfileURLs] = useState<string[]>([])
  const [images, setImages] = useState<File[]>([])
  const [showResearchAddress, setShowResearchAddress] = useState(false)
  const [alert, setAlert] = useState(initAlert)
  const [loading, setLoading] = useState(false)
  const [isPending, startTransition] = useTransition()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (fileURLs.length === 0) {
        throw new Error('사진을 첨부해주세요.')
      }
      if (state.address === '') {
        throw new Error('주소를 입력해주세요.')
      }
      if (state.price === 0) {
        throw new Error('가격을 입력해주세요.')
      }

      const imgs: Imgs[] = []
      for (const image of images) {
        const imgRef = ref(storage, `listings/${Date.now()} - ${image.name}`)
        const result = await uploadBytes(imgRef, image)
        const fileUrl = await getDownloadURL(ref(storage, result.ref.fullPath))

        imgs.push({ url: fileUrl, path: result.ref.fullPath })
      }

      const result = await addDoc(collection(db, 'listings'), {
        ...state,
        images: imgs,
        publishedAt: Timestamp.fromDate(new Date()),
        postedBy: auth.currentUser?.uid,
      })

      await setDoc(
        doc(db, 'listings', result.id),
        {
          adId: result.id,
        },
        { merge: true },
      )

      await setDoc(doc(db, 'favorites', result.id), {
        users: [],
      })

      navigate(`/profile`)
    } catch (error) {
      if (error instanceof Error) {
        setAlert({
          status: 'error',
          message: error.message,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    if (!files) {
      return
    }

    try {
      if (fileURLs.length + files.length > 9) {
        throw new Error('이미지는 최대 9개까지 첨부 가능합니다.')
      }

      setImages((prev) => [...prev, ...files])

      for (const file of files) {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result
          if (typeof result === 'string') {
            startTransition(() => setfileURLs((prev) => [...prev, result]))
          }
        }
        reader.readAsDataURL(file)
      }
    } catch (error) {
      if (error instanceof Error) {
        setAlert({
          status: 'error',
          message: error.message,
        })
      }
    }
  }

  return (
    <>
      <main className="max-w-md mx-auto px-4">
        <h1>매물 올리기</h1>
        <form onSubmit={onSubmit} className="mb-6">
          {/* 사진 업로드 */}
          <h4 className="mb-0">
            매물 사진{' '}
            <small className="text-xs text-gray-700 font-normal ml-1">
              이미지는 최대 9개까지 첨부 가능합니다.
            </small>
          </h4>
          <div className="relative">
            {isPending ? (
              <div
                className={`${
                  fileURLs.length > 4 ? 'h-[166px]' : 'h-[80px]'
                } flex items-center`}
              >
                <img src={spinner} className="h-8 mx-auto" />
              </div>
            ) : (
              <>
                <div className="bg-sky-100 min-h-[80px] pt-2.5 absolute left-0 top-0 z-10">
                  <label
                    htmlFor="input-file"
                    className="text-blue-600 bg-white rounded border border-blue-600 text-md w-[70px] h-[70px] flex justify-center items-center cursor-pointer"
                  >
                    <AiOutlinePlus size={20} className="w-[70px]" />
                  </label>
                </div>
                <input
                  type="file"
                  name="input-file"
                  id="input-file"
                  accept=".jpg, .png, .jpeg"
                  multiple
                  onChange={onFileChange}
                  className="hidden"
                />
                <div className="pt-2.5 overflow-auto sm:overflow-visible	flex items-end sm:flex-wrap gap-4 min-h-[80px]">
                  <div className="invisible">
                    <div className="rounded border border-blue-600 w-[70px] h-[70px]" />
                  </div>
                  {fileURLs.map((image, i) => {
                    return (
                      <div key={i}>
                        <div className="w-[70px] relative">
                          <img
                            src={image}
                            alt="upload-image"
                            className="w-[70px] h-[70px] rounded border border-gray-400 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const copy = [...fileURLs]
                              const copy2 = [...images]
                              copy.splice(i, 1)
                              copy2.splice(i, 1)
                              setfileURLs(copy)
                              setImages(copy2)
                            }}
                            className="bg-white text-gray-700 rounded-3xl absolute -top-2
                          -right-2"
                          >
                            <IoCloseCircleOutline size={20} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
          {/* 유형 선택 */}
          <h4>매물 유형</h4>
          <div className="flex space-x-4">
            <Button
              type="button"
              level={state.itemType === 'sale' ? 'ghost' : 'outline'}
              size="m"
              onClick={() => dispatch({ type: 'select-type', payload: 'sale' })}
            >
              매매
            </Button>
            <Button
              type="button"
              level={state.itemType === 'jeonse' ? 'ghost' : 'outline'}
              size="m"
              onClick={() =>
                dispatch({ type: 'select-type', payload: 'jeonse' })
              }
            >
              전세
            </Button>
            <Button
              type="button"
              level={state.itemType === 'monthly' ? 'ghost' : 'outline'}
              size="m"
              onClick={() =>
                dispatch({ type: 'select-type', payload: 'monthly' })
              }
            >
              월세
            </Button>
          </div>
          {/* 주소 선택 */}
          <h4>주소</h4>
          <div className="flex">
            <input
              className="input w-20 px-2 mr-2 text-center"
              value={state.zipcode}
              placeholder="우편번호"
              required
              readOnly
              onClick={() => {
                setShowResearchAddress(!showResearchAddress)
              }}
            />
            <input
              className="input w-full"
              value={state.address}
              placeholder="주소를 검색해보세요."
              required
              readOnly
              onClick={() => {
                setShowResearchAddress(!showResearchAddress)
              }}
            />
          </div>
          {showResearchAddress && (
            <ResearchAddress
              dispatch={dispatch}
              setShowResearchAddress={setShowResearchAddress}
            />
          )}
          {/* 방 갯수 선택 */}
          <div className="flex space-x-4 mt-6">
            <div>
              <h4 className="mt-0">방</h4>
              <input
                type="number"
                value={state.rooms.toString()}
                className="input w-full text-center"
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
              <h4 className="mt-0">욕실</h4>
              <input
                type="number"
                value={state.bathrooms.toString()}
                className="input w-full text-center"
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
          <h4>주차</h4>
          <div className="flex space-x-4">
            <Button
              type="button"
              level={state.parking ? 'ghost' : 'outline'}
              size="m"
              fullWidth={true}
              onClick={() =>
                dispatch({
                  type: 'select-parking',
                  payload: 'true',
                })
              }
            >
              가능
            </Button>
            <Button
              type="button"
              level={!state.parking ? 'ghost' : 'outline'}
              size="m"
              fullWidth={true}
              onClick={() =>
                dispatch({
                  type: 'select-parking',
                  payload: 'false',
                })
              }
            >
              불가능
            </Button>
          </div>
          {/* 옵션 선택 */}
          <h4>옵션</h4>
          <div className="grid grid-cols-4 gap-4 sm:grid-cols-5">
            <OptionBtn
              dispatch={dispatch}
              option={state.options.싱크대}
              name="싱크대"
            >
              <TbAirConditioning size={20} className="mb-1" />
            </OptionBtn>
            <OptionBtn
              dispatch={dispatch}
              option={state.options.에어컨}
              name="에어컨"
            >
              <TbAirConditioning size={20} className="mb-1" />
            </OptionBtn>
            <OptionBtn
              dispatch={dispatch}
              option={state.options.세탁기}
              name="세탁기"
            >
              <TbAirConditioning size={20} className="mb-1" />
            </OptionBtn>
            <OptionBtn
              dispatch={dispatch}
              option={state.options.냉장고}
              name="냉장고"
            >
              <TbAirConditioning size={20} className="mb-1" />
            </OptionBtn>
            <OptionBtn
              dispatch={dispatch}
              option={state.options.가스레인지}
              name="가스레인지"
            >
              <TbAirConditioning size={20} className="mb-1" />
            </OptionBtn>
            <OptionBtn
              dispatch={dispatch}
              option={state.options.옷장}
              name="옷장"
            >
              <TbAirConditioning size={20} className="mb-1" />
            </OptionBtn>
            <OptionBtn
              dispatch={dispatch}
              option={state.options.책상}
              name="책상"
            >
              <TbAirConditioning size={20} className="mb-1" />
            </OptionBtn>
            <OptionBtn
              dispatch={dispatch}
              option={state.options.침대}
              name="침대"
            >
              <TbAirConditioning size={20} className="mb-1" />
            </OptionBtn>
            <OptionBtn
              dispatch={dispatch}
              option={state.options.전자레인지}
              name="전자레인지"
            >
              <TbAirConditioning size={20} className="mb-1" />
            </OptionBtn>
            <OptionBtn dispatch={dispatch} option={state.options.TV} name="TV">
              <TbAirConditioning size={20} className="mb-1" />
            </OptionBtn>
          </div>
          {/* 가격 설정 */}
          <h4>매물가</h4>
          <div className="flex items-center relative">
            <input
              type="number"
              value={state.price.toString()}
              required
              className="input w-full text-center"
              onChange={(e) => {
                dispatch({
                  type: 'set-price',
                  payload: e.target.valueAsNumber,
                })
              }}
            />
            <p className="ml-2 text-sm text-gray-700 whitespace-nowrap">
              만원 <span>{state.itemType === 'monthly' && '/ 월'}</span>
            </p>
            <small className="absolute right-0 top-14">
              {state.price ? numberToKorean(state.price) + '원' : ''}
            </small>
          </div>
          {/* 관리비 */}
          <p className="text-lg mt-6 font-semibold">관리비</p>
          <div className="flex items-center relative">
            <input
              type="number"
              value={state.maintenanceFee.toString()}
              required
              className="input text-center"
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
          <h4>입주 가능 날짜</h4>
          <input
            type="date"
            value={state.availableDate}
            required
            className="input text-center"
            onChange={(e) => {
              dispatch({
                type: 'select-availableDate',
                payload: e.target.value.toString(),
              })
            }}
          />
          {/* 상세설명 작성 */}
          <h4>상세설명</h4>
          <textarea
            cols={30}
            rows={10}
            value={state.detail}
            required
            placeholder="상세한 설명을 적어주세요."
            onChange={(e) =>
              dispatch({ type: 'write-detail', payload: e.target.value })
            }
            className="input w-full mb-6"
          ></textarea>

          <Button
            type="submit"
            level="primary"
            size="l"
            disabled={loading}
            fullWidth={true}
          >
            매물 등록
          </Button>
        </form>
      </main>
      {alert.status !== 'pending' && (
        <Toast alert={alert} setAlert={setAlert} />
      )}
    </>
  )
}
