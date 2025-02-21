import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGoogleLogin } from '@react-oauth/google'
import { Navigate, useNavigate } from "@tanstack/react-router"
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/auth/')({
  component: LoginComponent,
})

export function LoginComponent() {
  const navigate = useNavigate()

  const login = useGoogleLogin({
    onSuccess: (res) => {
      console.log(res)
      localStorage.setItem('jwt_token', res.code)
      navigate({ to: '/dashboard' })
    },
    onError: (error) => console.log('Login Failed:', error),
    flow: "auth-code"
  })

  if (localStorage.getItem('jwt_token') !== null) {
    return <Navigate to="/dashboard" />
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
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginComponent