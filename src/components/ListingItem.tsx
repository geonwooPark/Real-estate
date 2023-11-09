import React from 'react'
import { DocumentData } from 'firebase/firestore'
import { numberToKorean } from '../utils/numberToKorean'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import 'moment/locale/ko'

interface ListingItemProps {
  listing: DocumentData
}

export default function ListingItem({ listing }: ListingItemProps) {
  return (
    <li className="bg-white border border-gray-200 rounded-lg overflow-hidden group mb-4 sm:mb-0">
      <Link to={`/category/${listing.itemType}/${listing.id}`}>
        <div className="overflow-hidden">
          <img
            src={listing.images[0].url}
            alt="thumnail"
            loading="lazy"
            className="w-full h-[240px] object-cover transition-scale duration-200 ease-in group-hover:scale-105"
          />
        </div>
        <div className="p-2.5">
          <p className="text-lg font-semibold mb-0.5 truncate">
            {listing.itemType === '매매'
              ? `매매 ${numberToKorean(listing.price)}`
              : listing.itemType === '전세'
              ? `전세 ${numberToKorean(listing.price)}`
              : `월세 ${numberToKorean(listing.price)} / ${numberToKorean(
                  listing.monthly,
                )}`}
          </p>
          <p className="text-md mb-0.5 truncate">{listing.address.roadName}</p>
          <p className="text-md mb-2.5">
            {listing.area}평 ({(listing.area * 3.3058).toFixed(2)}㎡)
          </p>
          <div className="text-sm mb-2 text-gray-700">
            <span className="bg-gray-300 rounded-xl px-1.5 py-1">
              방 {listing.rooms}
            </span>
            <span className="ml-2 bg-gray-300 rounded-xl px-1.5 py-1">
              욕실 {listing.bathrooms}
            </span>
          </div>
          <small className="text-gray-700">
            <Moment fromNow>{listing.publishedAt.toDate()}</Moment>
          </small>
        </div>
      </Link>
    </li>
  )
}
