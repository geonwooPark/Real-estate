export type InitialState = {
  itemType: string // 'sale' | 'jeonse' | 'monthly'
  address: string
  rooms: number
  bathrooms: number
  parking: boolean
  options: {
    [key: string]: boolean
  }
  detail: string
  price: number
  maintenanceFee: number
  availableDate: string
}

export const initialState: InitialState = {
  itemType: 'sale',
  address: '',
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
  maintenanceFee: 0,
  availableDate: '',
}

export type Action = {
  type: 'select-parking'
}

export type ActionWithStringPayload = {
  type:
    | 'select-type'
    | 'select-address'
    | 'select-options'
    | 'write-detail'
    | 'select-availableDate'
  payload: string
}

export type ActionWithNumberPayload = {
  type: 'select-rooms' | 'select-bathrooms' | 'set-price' | 'set-maintenanceFee'
  payload: number
}

export const formReducer = (
  state = initialState,
  action: Action | ActionWithStringPayload | ActionWithNumberPayload,
) => {
  const {
    itemType,
    address,
    rooms,
    bathrooms,
    parking,
    options,
    detail,
    price,
  } = state

  switch (action.type) {
    default:
      return state
    case 'select-type': {
      return { ...state, itemType: action.payload }
    }
    case 'select-address': {
      return { ...state, address: action.payload }
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
      return { ...state, parking: !parking }
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
    case 'select-availableDate': {
      return { ...state, availableDate: action.payload }
    }
  }
}
