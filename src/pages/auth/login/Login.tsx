import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { useLogin } from '@/hooks/useAuth'
import { parseErrorMessage } from '@/utils'
import LoginHeader from './components/LoginHeader'
import LoginForm from './components/LoginForm'
import { LOGIN_REDIRECT } from './constants'

const Login = () => {
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await loginMutation.mutateAsync({ email, password })
      navigate(LOGIN_REDIRECT)
    } catch (err) {
      setError(parseErrorMessage(err))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <LoginHeader />
        <LoginForm
          email={email}
          password={password}
          error={error}
          isPending={loginMutation.isPending}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

export default Login
