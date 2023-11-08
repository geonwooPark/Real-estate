import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore'

export default function useAuthStatus() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const [unread, setUnread] = useState<any>([])

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true)
      }
      setCheckingStatus(false)

      if (user) {
        const msgRef = collection(db, 'messages')
        const q = query(msgRef, where('users', 'array-contains', user.uid))

        const unsub = onSnapshot(q, (querySnapshot) => {
          const unread: any = []
          querySnapshot.forEach((snap) => {
            const data = snap.data()
            if (data.lastSender !== user.uid && data.lastUnread) {
              unread.push({ ...data, id: snap.id })
            }
          })
          setUnread(unread)
        })
        return () => unsub()
      }
    })
  }, [])

  return { loggedIn, unread, checkingStatus, setLoggedIn }
}
