import React, { useEffect, useState } from 'react'
import ListingItem from '../components/ListingItem'
import Button from '../components/common/Button'
import {
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
import { auth, db } from '../firebase'
import { initAlert } from './Signup'
import Toast from '../components/Toast'

export default function MyListings() {
  const [listings, setListings] = useState<DocumentData[]>([])

  const [lastFetchedListing, setLastFetchedListing] =
    useState<QueryDocumentSnapshot<DocumentData, DocumentData> | null>(null)

  const [pageLoading, setPageLoading] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [alert, setAlert] = useState(initAlert)

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

  useEffect(() => {
    fetchMyListings()
  }, [])

  return (
    <>
      <section className="max-w-6xl px-4 mx-auto">
        <h4 className="text-center mb-0">내가 올린 매물</h4>
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
