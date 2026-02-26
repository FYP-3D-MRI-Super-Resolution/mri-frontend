import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { useRegister } from '@/hooks/useAuth'
import { parseErrorMessage } from '@/utils'
import RegisterHeader from './components/RegisterHeader'
import RegisterForm from './components/RegisterForm'
import { REGISTER_REDIRECT, MIN_PASSWORD_LENGTH } from './constants'

const Register = () => {
  const navigate = useNavigate()
  const registerMutation = useRegister()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`)
      return
    }

    try {
      await registerMutation.mutateAsync({ name, email, password })
      navigate(REGISTER_REDIRECT)
    } catch (err) {
      setError(parseErrorMessage(err))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <RegisterHeader />
        <RegisterForm
          name={name}
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          error={error}
          isPending={registerMutation.isPending}
          onNameChange={setName}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

export default Register
