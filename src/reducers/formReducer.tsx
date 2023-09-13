export type InitialState = {
  itemType: '매매' | '전세' | '월세'
  address: string
  zipcode: string
  roadName: string
  latitude: string
  longitude: string
  area: number
  rooms: number
  bathrooms: number
  parking: boolean
  options: {
    [key: string]: boolean
  }
  detail: string
  price: number
  monthly: number
  maintenanceFee: number
  availableDate: string
}

export const initialState: InitialState = {
  itemType: '매매',
  address: '',
  zipcode: '',
  roadName: '',
  latitude: '',
  longitude: '',
  area: 0,
  rooms: 1,
  bathrooms: 1,
  parking: false,
  options: {
    싱크대: false,
    에어컨: false,
    세탁기: false,
    냉장고: false,
    가스레인지: false,
    옷장: false,
    책상: false,
    침대: false,
    전자레인지: false,
    TV: false,
  },
  detail: '',
  price: 0,
  monthly: 0,
  maintenanceFee: 0,
  availableDate: '',
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
        | 'research-latitude'
        | 'research-longitude'
        | 'select-parking'
        | 'select-options'
        | 'write-detail'
        | 'select-availableDate'
      payload: string
    }
  | {
      type:
        | 'select-rooms'
        | 'select-bathrooms'
        | 'set-price'
        | 'set-monthly'
        | 'set-maintenanceFee'
        | 'set-area'
      payload: number
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
      for (const key of Object.keys(options)) {
        if (key === action.payload) {
          options[key] = !options[key]
        }
      }
      return { ...state, options }
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
  }
}
