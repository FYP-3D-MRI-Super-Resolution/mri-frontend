import { Link } from 'react-router-dom'

const LoginHeader = () => (
  <div>
    <div className="flex justify-center">
      <span className="text-6xl">🧠</span>
    </div>
    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
      Sign in to your account
    </h2>
    <p className="mt-2 text-center text-sm text-dim">
      Or{' '}
      <Link to="/register" className="font-medium text-cyan-300 hover:text-cyan-200">
        create a new account
      </Link>
    </p>
  </div>
)

export default LoginHeader
