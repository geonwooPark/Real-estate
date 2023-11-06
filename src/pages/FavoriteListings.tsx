import React, { useEffect, useState } from 'react'
import ListingItem from '../components/ListingItem'
import Button from '../components/Button'
import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  documentId,
} from 'firebase/firestore'
import { auth, db } from '../firebase'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import { setAlert } from '../store/features/alertSlice'
import { useAppDispatch } from '../store/store'

export default function FavoriteListings() {
  const dispatch = useAppDispatch()

  const [listings, setListings] = useState<DocumentData[]>([])
  const [lastFetchedListing, setLastFetchedListing] =
    useState<QueryDocumentSnapshot<DocumentData, DocumentData> | null>(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [btnLoading, setBtnLoading] = useState(false)

  const onFetchMore = async () => {
    try {
      setBtnLoading(true)
      const q = query(
        collection(db, 'favorites'),
        where('users', 'array-contains', auth.currentUser?.uid),
        startAfter(lastFetchedListing),
        limit(8),
      )

      const docsSnap = await getDocs(q)
      const lastVisible = docsSnap.docs[docsSnap.docs.length - 1]
      setLastFetchedListing(lastVisible)

      const promises: DocumentData[] = []
      docsSnap.forEach(async (doc) => {
        const q = query(
          collection(db, 'listings'),
          where(documentId(), '==', doc.id),
        )
        promises.push(getDocs(q))
      })

      const listings: DocumentData[] = []
      const docs = await Promise.all(promises)
      docs.forEach((querySnap) =>
        querySnap.forEach((doc: DocumentData) =>
          listings.push({ ...doc.data() }),
        ),
      )

      setListings((prev) => [...prev, ...listings])
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          setAlert({
            status: 'error',
            message: error.message,
          }),
        )
      }
    } finally {
      setBtnLoading(false)
    }
  }

  useEffect(() => {
    const fetchFavListings = async () => {
      try {
        setPageLoading(true)
        const q = query(
          collection(db, 'favorites'),
          where('users', 'array-contains', auth.currentUser?.uid),
          limit(8),
        )
        const docsSnap = await getDocs(q)
        const lastVisible = docsSnap.docs[docsSnap.docs.length - 1]
        setLastFetchedListing(lastVisible)

        const promises: DocumentData[] = []
        docsSnap.forEach(async (doc) => {
          const q = query(
            collection(db, 'listings'),
            where(documentId(), '==', doc.id),
          )
          promises.push(getDocs(q))
        })

        const listings: DocumentData[] = []
        const docs = await Promise.all(promises)
        docs.forEach((querySnap) =>
          querySnap.forEach((doc: DocumentData) =>
            listings.push({ ...doc.data() }),
          ),
        )

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
    fetchFavListings()
  }, [])

  if (pageLoading) return <Spinner />

  if (listings.length === 0) {
    return (
      <EmptyState
        label="내가 찜한 매물이 없습니다!"
        className="h-[calc(100vh-48px)]"
      />
    )
  }

  return (
    <section className="max-w-6xl px-4 mx-auto">
      <h4 className="text-center mb-0">관심 있는 매물</h4>
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
