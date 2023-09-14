import { deleteDoc, doc } from 'firebase/firestore'
import React from 'react'
import { useNavigate, useParams } from 'react-router'
import { db } from '../firebase'

export default function Detail() {
  const params = useParams()
  const { listingId } = params
  const navigate = useNavigate()
  const onDelete = async () => {
    if (!listingId) {
      return
    }
    await deleteDoc(doc(db, 'listings', listingId))
    await deleteDoc(doc(db, 'favorites', listingId))
    navigate('/profile')
  }

  const onEdit = () => {
    navigate(`/edit-listing/${listingId}`)
  }
  return (
    <div>
      <button onClick={onDelete}>삭제</button>
      <button onClick={onEdit}>수정</button>
    </div>
  )
}
