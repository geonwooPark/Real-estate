import { Timestamp } from 'firebase/firestore'
import { ImagesType, OptionsType } from '../interfaces/interfaces'

export type InitialState = {
  itemType: '매매' | '전세' | '월세'
  address: string
  zipcode: string
  roadName: string
  latitude: number
  longitude: number
  area: number
  rooms: number
  bathrooms: number
  parking: boolean
  options: OptionsType[]
  detail: string
  price: number
  monthly: number
  maintenanceFee: number
  availableDate: string
  images: ImagesType[]
  publishedAt?: Timestamp
  postedBy?: string
  id?: string
}

export const initialState: InitialState = {
  itemType: '매매',
  address: '',
  zipcode: '',
  roadName: '',
  latitude: 0,
  longitude: 0,
  area: 0,
  rooms: 1,
  bathrooms: 1,
  parking: false,
  options: [
    { name: '싱크대', status: false },
    { name: '에어컨', status: false },
    { name: '세탁기', status: false },
    { name: '냉장고', status: false },
    { name: '가스레인지', status: false },
    { name: '옷장', status: false },
    { name: '책상', status: false },
    { name: '침대', status: false },
    { name: '전자레인지', status: false },
    { name: 'TV', status: false },
  ],
  detail: '',
  price: 0,
  monthly: 0,
  maintenanceFee: 0,
  availableDate: '',
  images: [],
  publishedAt: undefined,
  postedBy: '',
  id: '',
}

export type ActionWithPayload =
  | {
      type: 'select-type'
      payload: '매매' | '전세' | '월세'
    }
  | {
      type:
        | 'research-address'
        | 'research-zipcode'
        | 'research-roadName'
        | 'select-parking'
        | 'select-options'
        | 'write-detail'
        | 'select-availableDate'
      payload: string
    }
  | {
      type:
        | 'research-latitude'
        | 'research-longitude'
        | 'select-rooms'
        | 'select-bathrooms'
        | 'set-price'
        | 'set-monthly'
        | 'set-maintenanceFee'
        | 'set-area'
      payload: number
    }
  | {
      type: 'fetch-listing'
      payload: InitialState
    }

export const formReducer = (
  state = initialState,
  action: ActionWithPayload,
) => {
  const { options } = state

  switch (action.type) {
    default:
      return state
    case 'select-type': {
      return { ...state, itemType: action.payload }
    }
    case 'research-address': {
      return { ...state, address: action.payload }
    }
    case 'research-zipcode': {
      return { ...state, zipcode: action.payload }
    }
    case 'research-roadName': {
      return { ...state, roadName: action.payload }
    }
    case 'research-longitude': {
      return { ...state, longitude: action.payload }
    }
    case 'research-latitude': {
      return { ...state, latitude: action.payload }
    }
    case 'set-area': {
      if (action.payload < 0) {
        return state
      }
      return { ...state, area: Number(action.payload.toFixed(2)) }
    }
    case 'select-rooms': {
      if (action.payload <= 0 || action.payload > 10) {
        return state
      }
      return { ...state, rooms: action.payload }
    }
    case 'select-bathrooms': {
      if (action.payload <= 0 || action.payload > 10) {
        return state
      }
      return { ...state, bathrooms: action.payload }
    }
    case 'select-parking': {
      return { ...state, parking: JSON.parse(action.payload) as boolean }
    }
    case 'select-options': {
      const result = options.map((option) => {
        if (option.name === action.payload) {
          option = { ...option, status: !option.status }
        }
        return option
      })
      return { ...state, options: result }
    }
    case 'write-detail': {
      return { ...state, detail: action.payload }
    }
    case 'set-price': {
      if (action.payload < 0) {
        return state
      }
      return { ...state, price: action.payload }
    }
    case 'set-maintenanceFee': {
      if (action.payload < 0) {
        return state
      }
      return { ...state, maintenanceFee: action.payload }
    }
    case 'set-monthly': {
      if (action.payload < 0) {
        return state
      }
      return { ...state, monthly: action.payload }
    }
    case 'select-availableDate': {
      return { ...state, availableDate: action.payload }
    }
    case 'fetch-listing': {
      return { ...action.payload }
    }
  }
}
