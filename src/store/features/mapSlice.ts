import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type MapState = { map: any }

const initialState: MapState = { map: null }

export const MapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setMap: (state, action: PayloadAction<{ map: any }>) => {
      state.map = action.payload
    },
  },
})

export default MapSlice.reducer
export const { setMap } = MapSlice.actions
