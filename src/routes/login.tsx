import React, { useState, useEffect } from 'react'
import { googleLogout, useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: LoginComponent,
})

interface UserProfile {
  name: string
  email: string
  picture: string
}

export function LoginComponent() {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error),
  })

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: 'application/json',
            },
          },
        )
        .then((res) => {
          setProfile(res.data)
        })
        .catch((err) => console.log(err))
    }
  }, [user])

  const logOut = () => {
    googleLogout()
    setProfile(null)
  }

  return (
    <div>
      <h2>React Google Login</h2>
      <br />
      <br />
      {profile ? (
        <div>
          <img src={profile.picture} alt="user" />
          <h3>User Logged in</h3>
          <p>Name: {profile.name}</p>
          <p>Email Address: {profile.email}</p>
          <br />
          <br />
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
          <button onClick={logOut}>Log out</button>
        </div>
      ) : (
        // biome-ignore lint/a11y/useButtonType: <explanation>
<button onClick={() => login()}>Sign in with Google 🚀 </button>
      )}
    </div>
  )
}
