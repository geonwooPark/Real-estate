import { DocumentData, doc, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'

export default function useSnapShot<T>(collectionName: string, docId: string) {
  const [value, setValue] = useState<T | null>(null)

  useEffect(() => {
    if (!docId) {
      return
    }
    const docRef = doc(db, collectionName, docId)
    const unsub = onSnapshot(docRef, (doc: DocumentData) => {
      setValue(doc.data())
    })

    return () => unsub()
  }, [docId])

  return { value }
}
