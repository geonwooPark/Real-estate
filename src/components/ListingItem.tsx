import React from 'react'
import { DocumentData } from 'firebase/firestore'

interface ListingItemProps {
  listing: DocumentData
  id: string
}

export default function ListingItem({ listing, id }: ListingItemProps) {
  return (
    <div>
      {listing.itemType === '매매'
        ? `매매 ${listing.price}`
        : listing.itemType === '전세'
        ? `전세 ${listing.price}`
        : `월세 ${listing.price} / ${listing.monthly}`}
    </div>
  )
}
