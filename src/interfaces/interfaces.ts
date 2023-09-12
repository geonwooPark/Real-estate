export interface Alert {
  status: 'error' | 'success' | 'pending'
  message: string
}

export interface Imgs {
  url: string
  path: string
}
