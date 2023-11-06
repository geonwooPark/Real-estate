import React, { useContext, useEffect, useState } from 'react'
import ListingItem from '../components/ListingItem'
import Button from '../components/Button'
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
import { ToastContext } from '../App'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'

export default function MyListings() {
  const [listings, setListings] = useState<DocumentData[]>([])
  const [lastFetchedListing, setLastFetchedListing] =
    useState<QueryDocumentSnapshot<DocumentData, DocumentData> | null>(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [btnLoading, setBtnLoading] = useState(false)
  const setAlert = useContext(ToastContext)

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
    const fetchMyListings = async () => {
      try {
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
  }, [])

  if (pageLoading) return <Spinner />

  if (listings.length === 0) {
    return (
      <EmptyState
        label="등록된 매물이 없습니다!"
        className="h-[calc(100vh-48px)]"
      />
    )
  }

  return (
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
            label="더 보기"
            type="button"
            level="outline"
            size="s"
            onClick={onFetchMore}
            disabled={btnLoading}
          />
        </div>
      )}
    </section>
  )
}
