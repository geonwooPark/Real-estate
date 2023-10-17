import {
  DocumentData,
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { BsSend } from 'react-icons/bs'
import { useLocation } from 'react-router'
import { auth, db } from '../firebase'
import { InitialState } from '../reducers/formReducer'
import { numberToKorean } from '../utils/numberToKorean'
import ChatRoom from '../components/ChatRoom'
import { TypeChatRoom } from '../interfaces/interfaces'
import Message from '../components/Message'
import { ToastContext } from '../App'
import Spinner from '../components/Spinner'

export default function Chat() {
  const location = useLocation()
  const user1 = auth.currentUser?.uid

  const [currentChatRoom, setCurrentChatRoom] = useState<TypeChatRoom | null>(
    null,
  )
  const [chatRooms, setChatRooms] = useState<TypeChatRoom[]>([])
  const [text, setText] = useState('')
  const [messages, setMessages] = useState<DocumentData[]>([])
  const [pageLoading, setPageLoading] = useState(false)
  const setAlert = useContext(ToastContext)

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }

  const getChat = async (listing: InitialState) => {
    if (!user1 || !listing?.postedBy) {
      return
    }

    const buyer = await getDoc(doc(db, 'users', user1))
    const seller = await getDoc(doc(db, 'users', listing.postedBy))
    setCurrentChatRoom({ listing, me: buyer.data(), other: seller.data() })
  }

  const messagesSnapShot = async () => {
    const user2 = currentChatRoom?.other?.uid
    const chatId =
      user1 && user1 > user2
        ? `${user1}.${user2}.${currentChatRoom?.listing?.id}`
        : `${user2}.${user1}.${currentChatRoom?.listing?.id}`

    const messagesRef = collection(db, 'messages', `${chatId}/chat`)
    const q = query(messagesRef, orderBy('sentAt', 'asc'))

    const unsub = onSnapshot(q, (querySnapShot) => {
      const messages: DocumentData[] = []
      querySnapShot.forEach((doc) => messages.push(doc.data()))
      setMessages(messages)
    })

    // const docSnap = await getDoc(doc(db, 'messages', chatId))
    // if (docSnap.exists()) {
    //   if (docSnap.data().lastSender !== user1 && docSnap.data().lastUnread) {
    //     await updateDoc(doc(db, 'messages', chatId), {
    //       lastUnread: false,
    //     })
    //   }
    // }

    return () => unsub()
  }

  const getChatList = async () => {
    try {
      setPageLoading(true)
      const q = query(
        collection(db, 'messages'),
        where('users', 'array-contains', user1),
      )
      const querySnap = await getDocs(q)
      const messages = querySnap.docs.map((doc) => doc.data())

      const chatRooms: TypeChatRoom[] = []
      for (const message of messages) {
        const listingRef = doc(db, 'listings', message.listingId)
        const meRef = doc(
          db,
          'users',
          message.users.find((id: string) => id === user1),
        )
        const otherRef = doc(
          db,
          'users',
          message.users.find((id: string) => id !== user1),
        )

        const listingdDoc = await getDoc(listingRef)
        const meDoc = await getDoc(meRef)
        const otherDoc = await getDoc(otherRef)

        chatRooms.push({
          listing: listingdDoc.data(),
          me: meDoc.data(),
          other: otherDoc.data(),
        })
      }
      setChatRooms(chatRooms)
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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user1 || !currentChatRoom) {
      return
    }

    const user2 = currentChatRoom.other?.uid
    const chatId =
      user1 > user2
        ? `${user1}.${user2}.${currentChatRoom.listing?.id}`
        : `${user2}.${user1}.${currentChatRoom.listing?.id}`
    await addDoc(collection(db, 'messages', chatId, 'chat'), {
      text,
      sender: user1,
      sentAt: Timestamp.fromDate(new Date()),
    })
    await updateDoc(doc(db, 'messages', chatId), {
      lastText: text,
      lastSender: user1,
      lastUnread: true,
    })
    setText('')
  }

  useEffect(() => {
    if (location.state) {
      getChat(location.state)
    }
    getChatList()
  }, [])

  useEffect(() => {
    messagesSnapShot()
  }, [currentChatRoom])

  if (pageLoading) return <Spinner />

  return (
    <section className="max-w-6xl px-4 mx-auto">
      <div className="flex">
        <div className="min-w-[68px] sm:w-[20%] h-[calc(100vh-48px)] border-l-[1px] border-r-[1px]">
          {chatRooms.map((chatRoom, i) => {
            return (
              <ChatRoom
                key={i}
                chatRoom={chatRoom}
                currentChatRoom={currentChatRoom}
                user1={user1}
                setCurrentChatRoom={setCurrentChatRoom}
              />
            )
          })}
        </div>
        {currentChatRoom ? (
          <div className="w-full sm:w-[80%] h-[calc(100vh-48px)] relative border-r-[1px]">
            <div className="border-b-[1px]">
              <h4 className="text-center mt-2 mb-2">
                {currentChatRoom.other?.name}
              </h4>
            </div>
            <div className="p-2 border-b-[1px] flex items-center">
              <img
                className="w-[50px] h-[50px]"
                src={currentChatRoom.listing?.images[0].url}
                alt={currentChatRoom.listing?.roadName}
              />
              <div className="ml-2">
                <h6 className="text-lg font-semibold">
                  {currentChatRoom.listing?.itemType === '매매'
                    ? `매매 ${numberToKorean(currentChatRoom.listing.price)}`
                    : currentChatRoom.listing?.itemType === '전세'
                    ? `전세 ${numberToKorean(currentChatRoom.listing.price)}`
                    : `월세 ${numberToKorean(
                        currentChatRoom.listing?.price,
                      )} / ${numberToKorean(currentChatRoom.listing?.monthly)}`}
                </h6>
                <small>{currentChatRoom.listing?.roadName}</small>
              </div>
            </div>
            <div className="h-[calc(100%-164px)] overflow-auto p-2 shadow-[inset_0px_0px_30px_#46464620]">
              {messages.map((message, i) => {
                return <Message key={i} message={message} user1={user1} />
              })}
            </div>
            <form
              onSubmit={onSubmit}
              className="absolute bottom-0 p-2 bg-white w-full"
            >
              <div className="relative">
                <input
                  type="text"
                  value={text}
                  onChange={onTextChange}
                  className="px-3 py-2 w-full rounded-full text-sm outline-none"
                  placeholder="메시지를 입력하세요."
                />
                <button
                  type="submit"
                  className="absolute top-[50%] -translate-y-[50%] right-0 bg-yellow-400 p-2 mr-1 rounded-full shadow-sm"
                >
                  <BsSend size={20} />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <h4 className="w-[80%] text-center text-gray-400">
            채팅방을 선택해주세요
          </h4>
        )}
      </div>
    </section>
  )
}
