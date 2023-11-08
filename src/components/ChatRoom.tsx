import React from 'react'
import useSnapShot from '../hooks/useSnapShot'
import { FaUserCircle } from 'react-icons/fa'
import { ChatRoomType, MessageType } from '../interfaces/interfaces'
import { auth } from '../firebase'

interface ChatRoomProps {
  chatRoom: ChatRoomType
  currentChatRoom: ChatRoomType | null
  user1: string | undefined
  setCurrentChatRoom: React.Dispatch<React.SetStateAction<ChatRoomType | null>>
}

export default function ChatRoom({
  chatRoom,
  currentChatRoom,
  user1,
  setCurrentChatRoom,
}: ChatRoomProps) {
  const user2 = chatRoom.other?.uid
  const chatId =
    user1 && user1 > user2
      ? `${user1}.${user2}.${chatRoom.listing?.id}`
      : `${user2}.${user1}.${chatRoom.listing?.id}`
  const { value } = useSnapShot<MessageType>('messages', chatId)

  return (
    <div
      className={`flex flex-col justify-center sm:flex-row sm:items-center p-2 border-b-[1px] overflow-hidden cursor-pointer ${
        chatRoom.listing?.id === currentChatRoom?.listing?.id &&
        chatRoom.other?.name === currentChatRoom?.other?.name &&
        'bg-gray-100 shadow-[inset_0px_0px_10px_#6868681f]'
      }`}
      onClick={() => {
        setCurrentChatRoom({ ...chatRoom })
      }}
    >
      <div>
        {chatRoom.other?.photoUrl ? (
          <img
            src={chatRoom.other?.photoUrl}
            className="w-[50px] h-[50px] rounded-full object-fill"
          />
        ) : (
          <FaUserCircle size={50} className="w-[50px] h-[50px]" />
        )}
      </div>

      <div className="flex-1 ml-2 hidden sm:block truncate">
        <p>{chatRoom.other?.name}</p>
        <small className="text-gray-500">{value?.lastText}</small>
      </div>

      {auth.currentUser?.uid !== value?.lastSender && value?.lastUnread && (
        <span className="bg-red-100 text-red-600 text-xs text-center font-medium px-2.5 py-0.5 mt-2 sm:mt-0 rounded-full dark:bg-red-600 dark:text-red-300">
          <small>New</small>
        </span>
      )}
    </div>
  )
}
