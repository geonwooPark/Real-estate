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

export const MapContext = createContext<any>(null)

export default function App() {
  const [map, setMap] = useState(null)

  return (
    <>
      <Router>
        <MapContext.Provider value={{ map, setMap }}>
          <Header />
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
      </Router>
    </>
  )
}
