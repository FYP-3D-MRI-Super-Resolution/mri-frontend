import type { FormEvent } from 'react'

import AuthInput from '../../components/AuthInput'
import AuthError from '../../components/AuthError'

interface RegisterFormProps {
  name: string
  email: string
  password: string
  confirmPassword: string
  error: string
  isPending: boolean
  onNameChange: (v: string) => void
  onEmailChange: (v: string) => void
  onPasswordChange: (v: string) => void
  onConfirmPasswordChange: (v: string) => void
  onSubmit: (e: FormEvent) => void
}

const RegisterForm = ({
  name,
  email,
  password,
  confirmPassword,
  error,
  isPending,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: RegisterFormProps) => (
  <form className="mt-8 space-y-6" onSubmit={onSubmit}>
    <div className="space-y-4">
      <AuthInput
        id="name"
        name="name"
        type="text"
        label="Full Name"
        placeholder="Enter your full name"
        autoComplete="name"
        value={name}
        onChange={onNameChange}
      />
      <AuthInput
        id="email"
        name="email"
        type="email"
        label="Email address"
        placeholder="Enter your email"
        autoComplete="email"
        value={email}
        onChange={onEmailChange}
      />
      <AuthInput
        id="password"
        name="password"
        type="password"
        label="Password"
        placeholder="Create a password (min 6 characters)"
        autoComplete="new-password"
        value={password}
        onChange={onPasswordChange}
      />
      <AuthInput
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label="Confirm Password"
        placeholder="Confirm your password"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={onConfirmPasswordChange}
      />
    </div>

    {error && <AuthError message={error} />}

    <button
      type="submit"
      disabled={isPending}
      className="btn btn-primary w-full py-2.5 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
          Creating account...
        </>
      ) : (
        <>
          <span>✨</span>
          Create account
        </>
      )}
    </button>
  </form>
)

export default RegisterForm
