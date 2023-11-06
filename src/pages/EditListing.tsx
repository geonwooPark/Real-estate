import React, {
  useContext,
  useEffect,
  useReducer,
  useState,
  useTransition,
} from 'react'
import { TbAirConditioning } from 'react-icons/tb'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { AiOutlinePlus } from 'react-icons/ai'
import { numberToKorean } from '../utils/numberToKorean'
import { formReducer, initialState } from '../reducers/formReducer'
import OptionBtn from '../components/OptionBtn'
import ResearchAddress from '../components/ResearchAddress'
import Button from '../components/Button'
import spinner from '../assets/svg/spinner.svg'
import { auth, db, storage } from '../firebase'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useNavigate, useParams } from 'react-router'
import { Imgs } from '../interfaces/interfaces'
import Spinner from '../components/Spinner'
import { ToastContext } from '../App'

export default function EditListing() {
  const params = useParams()
  const { listingId } = params
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(formReducer, initialState)
  const [URLs, setURLs] = useState<Imgs[]>([])
  const [deletedURLs, setDeletedURLs] = useState<Imgs[]>([])
  const [previewURLs, setPreviewURLs] = useState<Imgs[]>([])
  const [images, setImages] = useState<File[]>([])
  const [showResearchAddress, setShowResearchAddress] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(false)
  const setAlert = useContext(ToastContext)
  const [isPending, startTransition] = useTransition()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setBtnLoading(true)

    if (!listingId) {
      return
    }

    try {
      if (URLs.length + previewURLs.length === 0) {
        throw new Error('사진을 첨부해주세요.')
      }
      if (state.address === '') {
        throw new Error('주소를 입력해주세요.')
      }
      if (state.area === 0) {
        throw new Error('전용면적을 입력해주세요.')
      }
      if (state.price === 0) {
        throw new Error('가격을 입력해주세요.')
      }
      if (state.monthly === 0 && state.itemType === '월세') {
        throw new Error('월세를 입력해주세요.')
      }

      if (deletedURLs) {
        deletedURLs.forEach((deletedURL) =>
          deleteObject(ref(storage, deletedURL.path)),
        )
      }

      const imgs: Imgs[] = []
      for (const image of images) {
        const imgRef = ref(storage, `listings/${Date.now()} - ${image.name}`)
        const result = await uploadBytes(imgRef, image)
        const fileUrl = await getDownloadURL(ref(storage, result.ref.fullPath))

        imgs.push({ url: fileUrl, path: result.ref.fullPath })
      }

      await updateDoc(doc(db, 'listings', listingId), {
        images: [...URLs, ...imgs],
      })

      navigate(`/category/${state.itemType}/${listingId}`)
      setAlert({
        status: 'success',
        message: '매물을 성공적으로 수정했습니다.',
      })
    } catch (error) {
      if (error instanceof Error) {
        setAlert({
          status: 'error',
          message: error.message,
        })
      }
    } finally {
      setBtnLoading(false)
    }
  }

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    if (!files) {
      return
    }

    try {
      if (URLs.length + previewURLs.length + files.length > 9) {
        throw new Error('이미지는 최대 9개까지 첨부 가능합니다.')
      }

      setImages((prev) => [...prev, ...files])

      for (const file of files) {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result
          if (typeof result === 'string') {
            startTransition(() =>
              setPreviewURLs((prev) => [...prev, { url: result, path: '' }]),
            )
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

  useEffect(() => {
    const fetchListing = async () => {
      setPageLoading(true)
      if (!listingId) {
        return
      }
      const docSnap = await getDoc(doc(db, 'listings', listingId))

      if (docSnap.data()?.postedBy !== auth.currentUser?.uid) {
        navigate('/')
        return
      }

      if (docSnap.exists()) {
        const listing: any = { ...docSnap.data() }
        const arr: Imgs[] = []
        listing.images.forEach((image: Imgs) => arr.push(image))
        setURLs(arr)
        dispatch({ type: 'fetch-listing', payload: listing })
      }
      setPageLoading(false)
    }
    fetchListing()
  }, [listingId])

  if (pageLoading) {
    return <Spinner />
  }

  return (
    <main className="max-w-md mx-auto px-4">
      <h1>매물 수정하기</h1>
      <form onSubmit={onSubmit} className="mb-6">
        {/* 사진 업로드 */}
        <h4 className="mb-0">
          매물 사진<span className="text-red-600">*</span>{' '}
          <small className="text-xs text-gray-700 font-normal ml-1">
            이미지는 최대 9개까지 첨부 가능합니다.
          </small>
        </h4>
        <div className="relative">
          {isPending ? (
            <div
              className={`${
                previewURLs.length > 4 ? 'h-[166px]' : 'h-[80px]'
              } flex items-center`}
            >
              <img src={spinner} className="h-8 mx-auto" />
            </div>
          ) : (
            <>
              <div className="bg-white min-h-[80px] pt-2.5 absolute left-0 top-0 z-10">
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
                {URLs.concat(previewURLs).map((elem, i) => {
                  return (
                    <div key={i}>
                      <div className="w-[70px] relative">
                        <img
                          src={elem.url}
                          alt="upload-image"
                          className="w-[70px] h-[70px] rounded border border-gray-400 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (URLs.includes(elem)) {
                              const copy = [...URLs]
                              copy.splice(i, 1)
                              setURLs(copy)
                              setDeletedURLs((prev) => [...prev, elem])
                            }
                            if (previewURLs.includes(elem)) {
                              const copy = [...previewURLs]
                              const copy2 = [...images]
                              copy.splice(i - URLs.length, 1)
                              copy2.splice(i - URLs.length, 1)
                              setImages(copy2)
                              setPreviewURLs(copy)
                            }
                          }}
                          className="bg-white text-gray-700 rounded-3xl absolute -top-2 -right-2"
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
        <h4>
          매물 유형<span className="text-red-600">*</span>
        </h4>
        <div className="flex space-x-4">
          <Button
            label="매매"
            type="button"
            level={state.itemType === '매매' ? 'ghost' : 'outline'}
            size="m"
            onClick={() => dispatch({ type: 'select-type', payload: '매매' })}
          />
          <Button
            label="전세"
            type="button"
            level={state.itemType === '전세' ? 'ghost' : 'outline'}
            size="m"
            onClick={() => dispatch({ type: 'select-type', payload: '전세' })}
          />
          <Button
            label="월세"
            type="button"
            level={state.itemType === '월세' ? 'ghost' : 'outline'}
            size="m"
            onClick={() => dispatch({ type: 'select-type', payload: '월세' })}
          />
        </div>
        {/* 주소 선택 */}
        <h4>
          주소<span className="text-red-600">*</span>
        </h4>
        <div className="flex">
          <input
            className="px-4 py-3 text-sm border border-gray-400 text-gray-800 rounded outline-none w-[88px] mr-2 text-center"
            value={state.zipcode}
            placeholder="우편번호"
            required
            readOnly
            onClick={() => setShowResearchAddress(!showResearchAddress)}
          />
          <input
            className="px-4 py-3 text-sm border border-gray-400 text-gray-800 rounded outline-none w-full"
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
        {/* 평수 */}
        <h4 className="inline-block">
          전용면적<span className="text-red-600">*</span>
        </h4>
        <div className="flex items-center">
          <input
            type="number"
            value={state.area.toString()}
            required
            className="px-4 py-3 text-sm border border-gray-400 text-gray-800 rounded outline-none text-center"
            onChange={(e) => {
              dispatch({
                type: 'set-area',
                payload: e.target.valueAsNumber,
              })
            }}
          />
          <p className="ml-2 text-sm text-gray-700 whitespace-nowrap">
            평 / {state.area ? (state.area * 3.3058).toFixed(2) : 0}㎡
          </p>
        </div>
        {/* 방 갯수 선택 */}
        <div className="flex space-x-4 mt-6">
          <div>
            <h4 className="mt-0">
              방<span className="text-red-600">*</span>
            </h4>
            <input
              type="number"
              value={state.rooms.toString()}
              className="px-4 py-3 text-sm border border-gray-400 text-gray-800 rounded outline-none w-full text-center"
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
            <h4 className="mt-0">
              욕실<span className="text-red-600">*</span>
            </h4>
            <input
              type="number"
              value={state.bathrooms.toString()}
              className="px-4 py-3 text-sm border border-gray-400 text-gray-800 rounded outline-none w-full text-center"
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
        <h4>
          주차<span className="text-red-600">*</span>
        </h4>
        <div className="flex space-x-4">
          <Button
            label="가능"
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
          />
          <Button
            label="불가능"
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
          />
        </div>
        {/* 옵션 선택 */}
        <h4>옵션</h4>
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-5">
          <OptionBtn
            dispatch={dispatch}
            option={state.options.싱크대}
            label="싱크대"
            icon={TbAirConditioning}
          />
          <OptionBtn
            dispatch={dispatch}
            option={state.options.에어컨}
            label="에어컨"
            icon={TbAirConditioning}
          />
          <OptionBtn
            dispatch={dispatch}
            option={state.options.세탁기}
            label="세탁기"
            icon={TbAirConditioning}
          />
          <OptionBtn
            dispatch={dispatch}
            option={state.options.냉장고}
            label="냉장고"
            icon={TbAirConditioning}
          />
          <OptionBtn
            dispatch={dispatch}
            option={state.options.가스레인지}
            label="가스레인지"
            icon={TbAirConditioning}
          />
          <OptionBtn
            dispatch={dispatch}
            option={state.options.옷장}
            label="옷장"
            icon={TbAirConditioning}
          />
          <OptionBtn
            dispatch={dispatch}
            option={state.options.책상}
            label="책상"
            icon={TbAirConditioning}
          />
          <OptionBtn
            dispatch={dispatch}
            option={state.options.침대}
            label="침대"
            icon={TbAirConditioning}
          />
          <OptionBtn
            dispatch={dispatch}
            option={state.options.전자레인지}
            label="전자레인지"
            icon={TbAirConditioning}
          />
          <OptionBtn
            dispatch={dispatch}
            option={state.options.TV}
            label="TV"
            icon={TbAirConditioning}
          />
        </div>
        {/* 가격 설정 */}
        <h4>
          {state.itemType === '매매'
            ? '매물가'
            : state.itemType === '전세'
            ? '전세금'
            : '보증금'}
          <span className="text-red-600">*</span>
        </h4>
        <div className="flex items-center relative">
          <input
            type="number"
            value={state.price.toString()}
            required
            className="px-4 py-3 text-sm border border-gray-400 text-gray-800 rounded outline-none w-full text-center"
            onChange={(e) => {
              dispatch({
                type: 'set-price',
                payload: e.target.valueAsNumber,
              })
            }}
          />
          <p className="ml-2 text-sm text-gray-700 whitespace-nowrap">만원</p>
          <small className="absolute right-0 top-14">
            {state.price ? numberToKorean(state.price) + '원' : ''}
          </small>
        </div>
        <div className="flex space-x-4 mt-6">
          {/* 월세 */}
          {state.itemType === '월세' && (
            <div>
              <h4 className="mt-0">
                월세<span className="text-red-600">*</span>
              </h4>
              <div className="flex items-center">
                <input
                  type="number"
                  value={state.monthly.toString()}
                  required
                  className="px-4 py-3 text-sm border border-gray-400 text-gray-800 rounded outline-none w-full text-center"
                  onChange={(e) => {
                    dispatch({
                      type: 'set-monthly',
                      payload: e.target.valueAsNumber,
                    })
                  }}
                />
                <p className="ml-2 text-sm text-gray-700 whitespace-nowrap">
                  만원
                </p>
              </div>
            </div>
          )}
          {/* 관리비 */}
          <div>
            <h4 className="mt-0">관리비</h4>
            <div className="flex items-center">
              <input
                type="number"
                value={state.maintenanceFee.toString()}
                required
                className="px-4 py-3 text-sm border border-gray-400 text-gray-800 rounded outline-none w-full text-center"
                onChange={(e) => {
                  dispatch({
                    type: 'set-maintenanceFee',
                    payload: e.target.valueAsNumber,
                  })
                }}
              />
              <p className="ml-2 text-sm text-gray-700 whitespace-nowrap">
                만원
              </p>
            </div>
          </div>
        </div>
        {/* 입주 가능일 선택 */}
        <h4>입주 가능 날짜</h4>
        <input
          type="date"
          value={state.availableDate}
          className="px-4 py-3 text-sm border border-gray-400 text-gray-800 rounded outline-none text-center"
          onChange={(e) => {
            dispatch({
              type: 'select-availableDate',
              payload: e.target.value.toString(),
            })
          }}
        />
        {/* 상세설명 작성 */}
        <h4>
          상세설명<span className="text-red-600">*</span>
        </h4>
        <textarea
          cols={30}
          rows={10}
          value={state.detail}
          required
          placeholder="상세한 설명을 적어주세요."
          onChange={(e) =>
            dispatch({ type: 'write-detail', payload: e.target.value })
          }
          className="px-4 py-3 text-sm border border-gray-400 text-gray-800 rounded outline-none w-full mb-6"
        ></textarea>

        <Button
          label="매물 수정하기"
          type="submit"
          level="primary"
          size="l"
          disabled={btnLoading}
          fullWidth={true}
        />
      </form>
    </main>
  )
}
