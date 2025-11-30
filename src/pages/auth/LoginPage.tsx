// src/pages/auth/LoginPage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useLocalStorage } from '@/useLocalStorage'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const [userEmail, setUserEmail] = useLocalStorage('userEmail', '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      const response = await fetch('/api/members')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const members = await response.json()
      
      // Find member with matching email and password
      const authenticatedMember = members.find(
        (member: { email: string; password: string }) => 
          member.email === email && member.password === password
      )
      console.log(authenticatedMember)
      
      if (authenticatedMember) {
        // Store authentication state and user email
        setUserEmail(authenticatedMember.email)
        
        if (rememberMe) {
          localStorage.setItem('isAuthenticated', 'true')
        } else {
          sessionStorage.setItem('isAuthenticated', 'true')
          // Also set in sessionStorage for immediate access
          sessionStorage.setItem('userEmail', authenticatedMember.email)
        }
        navigate('/dashboard')
      } else {
        setError('Invalid email or password')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred while logging in. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        {error && (
          <div className="mx-6 px-4 py-2 bg-destructive/10 text-destructive text-sm rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                Use <span className="font-mono">admin@example.com</span> and <span className="font-mono">password</span> to login
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              Sign In
            </Button>
            <div className="text-center text-sm">
              Don't have an account?{' '}
              <a href="register" className="font-medium text-primary hover:underline">
                Sign up
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}