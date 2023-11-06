import { DocumentData } from 'firebase/firestore'

export interface AlertType {
  status: 'error' | 'success' | 'pending'
  message: string
}

export interface ImagesType {
  url: string
  path: string
}

export interface OptionsType {
  name: string
  status: boolean
}

export interface ChatRoomType {
  listing: DocumentData | undefined
  me: DocumentData | undefined
  other: DocumentData | undefined
}

export interface MessageType {
  listing: string
  lastSender?: string
  lastText?: string
  lastUnread?: boolean
  users: string[]
}
