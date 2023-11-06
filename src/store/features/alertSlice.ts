import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { AlertType } from '../../interfaces/interfaces'

export const initialState: AlertType = { status: 'pending', message: '' }

export const AlertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlert: (state, action: PayloadAction<AlertType>) => {
      return (state = {
        status: action.payload.status,
        message: action.payload.message,
      })
    },
  },
})

export default AlertSlice.reducer
export const { setAlert } = AlertSlice.actions
