'use client'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

const SessionProviderContext = ({children}: {children:React.ReactNode}) => {
  return (
    <SessionProvider>
        {children}
    </SessionProvider>
  )
}

export default SessionProviderContext