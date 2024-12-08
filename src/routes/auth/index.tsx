import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { googleLogout, useGoogleLogin } from '@react-oauth/google'
import { createFileRoute } from '@tanstack/react-router'
import axios from 'axios'
import { LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/auth/')({
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader className="text-center py-6 rounded-t-xl">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {profile ? (
            <div className="space-y-6 text-center">
              <Avatar className="w-24 h-24 mx-auto border-4 border-blue-500 shadow-lg">
                <AvatarImage
                  src={profile.picture}
                  alt={profile.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-blue-500 text-white text-3xl">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>

              <div>
                <h3 className="text-2xl font-semibold text-gray-800">
                  {profile.name}
                </h3>
                <p className="text-gray-600 mt-2">{profile.email}</p>
              </div>

              <Button
                onClick={logOut}
                variant="destructive"
                className="w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-16">
                Securely log in with your Google account
              </p>
              <Button
                onClick={() => login()}
                className="bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Sign in with Google
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginComponent