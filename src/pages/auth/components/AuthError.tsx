interface AuthErrorProps {
  message: string
}

const AuthError = ({ message }: AuthErrorProps) => (
  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
    <div className="flex items-start gap-2">
      <span className="text-red-400 shrink-0">✗</span>
      <p className="text-sm font-medium text-red-400">{message}</p>
    </div>
  </div>
)

export default AuthError
