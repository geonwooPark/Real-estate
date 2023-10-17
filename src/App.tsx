import React, { createContext, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './pages/CreateListing'
import Detail from './pages/Detail'
import EditListing from './pages/EditListing'
import Chat from './pages/Chat'
import MyListings from './pages/MyListings'
import FavoriteListings from './pages/FavoriteListings'
import { Alert } from './interfaces/interfaces'
import Toast from './components/Toast'

export type AlertContext = React.Dispatch<React.SetStateAction<Alert>>

export const initAlert: Alert = { status: 'pending', message: '' }

export const MapContext = createContext<any>(null)
export const ToastContext = createContext<AlertContext>(() => null)

export default function App() {
  const [map, setMap] = useState(null)
  const [alert, setAlert] = useState<Alert>(initAlert)

  return (
    <>
      <Router>
        <ToastContext.Provider value={setAlert}>
          <MapContext.Provider value={{ map, setMap }}>
            <Header />
            {alert.status !== 'pending' && (
              <Toast alert={alert} setAlert={setAlert} />
            )}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route element={<PrivateRoute />}>
                <Route path="/chat" element={<Chat />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/my-listings" element={<MyListings />} />
                <Route
                  path="/profile/favorite-listings"
                  element={<FavoriteListings />}
                />
                <Route path="/create-listing" element={<CreateListing />} />
                <Route
                  path="/edit-listing/:listingId"
                  element={<EditListing />}
                />
              </Route>
              <Route path="/sign-in" element={<Signin />} />
              <Route path="/sign-up" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path={`/category/:category/:listingId`}
                element={<Detail />}
              />
            </Routes>
          </MapContext.Provider>
        </ToastContext.Provider>
      </Router>
    </>
  )
}
