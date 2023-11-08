import { DocumentData } from 'firebase/firestore'
import React, { useEffect, useRef } from 'react'
import Moment from 'react-moment'

export default function Message({
  message,
  user1,
}: {
  message: DocumentData
  user1: string | undefined
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [message])

  return (
    <div
      className={`text-sm mb-2 ${message.sender === user1 ? 'text-end' : ''}`}
      ref={scrollRef}
    >
      <p
        className={`px-4 py-2 max-w-[50%] inline-block rounded-sm break-all	 
          ${
            message.sender === user1
              ? 'bg-yellow-400 text-gray-700'
              : 'bg-gray-400 text-white'
          }`}
      >
        {message.text}
        <br />
      </p>
      <div className="text-gray-400">
        <small>
          <Moment fromNow>{message.sentAt.toDate()}</Moment>
        </small>
      </div>
    </div>
  )
}
