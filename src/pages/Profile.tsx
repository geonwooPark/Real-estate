import React, { useEffect, useState } from 'react'
import { AiOutlineEdit, AiOutlineHome } from 'react-icons/ai'
import { auth, db } from '../firebase'
import { initAlert } from './Signup'
import { updateProfile } from 'firebase/auth'
import {
  updateDoc,
  doc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  DocumentData,
  limit,
  startAfter,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import Toast from '../components/Toast'
import Button from '../components/common/Button'
import { useNavigate } from 'react-router'
import ListingItem from '../components/ListingItem'

export default function Profile() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName,
    email: auth.currentUser?.email,
  })
  const { name, email } = formData
  const [changeDetail, setChangeDetail] = useState(false)

  const [listings, setListings] = useState<DocumentData[]>([])
  const [lastFetchedListing, setLastFetchedListing] =
    useState<QueryDocumentSnapshot<DocumentData, DocumentData> | null>(null)
  const [pageLoading, setPageLoading] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [alert, setAlert] = useState(initAlert)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const onEdit = async () => {
    setChangeDetail(!changeDetail)
    if (!changeDetail) {
      return
    }
    if (!auth.currentUser) {
      return
    }

    try {
      if (auth.currentUser?.displayName !== name) {
        const confirm = window.confirm('프로필 이름을 변경 하시겠습니까?')
        if (confirm) {
          await updateProfile(auth.currentUser, {
            displayName: name,
          })
          await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            name,
          })
          setAlert({
            status: 'success',
            message: '프로필 이름을 성공적으로 변경했습니다.',
          })
        } else {
          setFormData({
            name: auth.currentUser?.displayName,
            email: auth.currentUser?.email,
          })
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setAlert({
          status: 'error',
          message: '프로필 이름 변경에 실패했습니다.',
        })
      }
    }
  }

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        setPageLoading(true)
        const q = query(
          collection(db, 'listings'),
          where('postedBy', '==', auth.currentUser?.uid),
          orderBy('publishedAt', 'desc'),
          limit(8),
        )
        const querySnap = await getDocs(q)
        const lastVisible = querySnap.docs[querySnap.docs.length - 1]
        setLastFetchedListing(lastVisible)
        const listings: DocumentData[] = []
        querySnap.forEach((doc) => listings.push(doc.data()))
        setListings(listings)
      } catch (error) {
        if (error instanceof Error) {
          setAlert({
            status: 'error',
            message: error.message,
          })
        }
      } finally {
        setPageLoading(false)
      }
    }
    fetchMyListings()
  }, [auth.currentUser?.uid])

  const onFetchMore = async () => {
    try {
      setBtnLoading(true)
      const q = query(
        collection(db, 'listings'),
        where('postedBy', '==', auth.currentUser?.uid),
        orderBy('publishedAt', 'desc'),
        startAfter(lastFetchedListing),
        limit(8),
      )
      const querySnap = await getDocs(q)
      const lastVisible = querySnap.docs[querySnap.docs.length - 1]
      setLastFetchedListing(lastVisible)
      const listings: DocumentData[] = []
      querySnap.forEach((doc) => listings.push(doc.data()))
      setListings((prev) => [...prev, ...listings])
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

  return (
    <>
      <section className="max-w-6xl px-4 mx-auto">
        <h1>내 프로필</h1>
        <div className="w-full sm:w-[50%] mt-6 mx-auto">
          <form>
            <div className="relative mb-3">
              <input
                type="text"
                name="name"
                value={name!}
                disabled={!changeDetail}
                onChange={onChange}
                className={`w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${
                  changeDetail && 'bg-blue-100'
                }`}
              />
              <AiOutlineEdit
                size={20}
                onClick={onEdit}
                className={`absolute right-3 top-2 cursor-pointer ${
                  changeDetail && 'text-blue-600'
                }`}
              />
            </div>
            <input
              type="email"
              name="email"
              value={email!}
              disabled
              className="w-full px-4 py-2 mb-3 text-sm text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
            />
            <Button
              type="button"
              level="primary"
              size="l"
              withIcon={true}
              fullWidth={true}
              onClick={() => navigate('/create-listing')}
            >
              <AiOutlineHome size={20} className="mr-1" />내 매물 등록하기
            </Button>
          </form>
        </div>
      </section>
      <section className="max-w-6xl px-4 mx-auto">
        <h4 className="text-center mb-0">나의 매물 목록</h4>
        <main>
          {!pageLoading && listings.length > 0 && (
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6 mb-6">
              {listings.map((listing) => (
                <ListingItem key={listing.id} listing={listing} />
              ))}
            </ul>
          )}
        </main>
        {lastFetchedListing && (
          <div className="flex justify-center mb-4">
            <Button
              type="button"
              level="outline"
              size="s"
              onClick={onFetchMore}
              disabled={btnLoading}
            >
              더 보기
            </Button>
          </div>
        )}
      </section>
      {alert.status !== 'pending' && (
        <Toast alert={alert} setAlert={setAlert} />
      )}
    </>
  )
}
