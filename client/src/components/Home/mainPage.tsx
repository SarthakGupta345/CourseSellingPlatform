import React from 'react'
import Sidebar from '../Instructor/sidebar'
import { useVerifiedLogin } from '@/hooks/useAuth.state'
import { useAppSelector } from '@/Store/hooks'

const MainPage = () => {
  const { } = useVerifiedLogin()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  return (
    <div>
      {
        isAuthenticated ? (
          <p>Authenticated</p>
        ) : (
          <p>Not Authenticated</p>
        )
      }

      this is a main page

    </div>
  )
}

export default MainPage
