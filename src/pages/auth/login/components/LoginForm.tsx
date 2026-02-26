import type { FormEvent } from 'react'
import AuthInput from '../../components/AuthInput'
import AuthError from '../../components/AuthError'

interface LoginFormProps {
  email: string
  password: string
  error: string
  isPending: boolean
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: (e: FormEvent) => void
}

const LoginForm = ({
  email,
  password,
  error,
  isPending,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) => (
  <form className="mt-8 space-y-6" onSubmit={onSubmit}>
    <div className="space-y-4">
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
        placeholder="Enter your password"
        autoComplete="current-password"
        value={password}
        onChange={onPasswordChange}
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
          Signing in...
        </>
      ) : (
        <>
          <span>🔐</span>
          Sign in
        </>
      )}
    </button>
  </form>
)

export default LoginForm
