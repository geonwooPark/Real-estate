import { DocumentData } from 'firebase/firestore'

export interface Alert {
  status: 'error' | 'success' | 'pending'
  message: string
}

export interface Imgs {
  url: string
  path: string
}

export interface TypeChatRoom {
  listing: DocumentData | undefined
  me: DocumentData | undefined
  other: DocumentData | undefined
}

export interface TypeMessage {
  listing: string
  lastSender?: string
  lastText?: string
  lastUnread?: boolean
  users: string[]
}
