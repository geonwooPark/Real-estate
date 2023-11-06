import { configureStore } from '@reduxjs/toolkit'
import { MapSlice } from './features/mapSlice'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AlertSlice } from './features/alertSlice'

export const store = configureStore({
  reducer: {
    map: MapSlice.reducer,
    alert: AlertSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})

export const useAppDispatch: () => typeof store.dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector
