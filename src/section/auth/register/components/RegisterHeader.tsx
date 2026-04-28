import { Link } from 'react-router-dom'

const RegisterHeader = () => (
  <div>
    <div className="flex justify-center">
      <span className="text-6xl">🧠</span>
    </div>
    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
      Create your account
    </h2>
    <p className="mt-2 text-center text-sm text-dim">
      Or{' '}
      <Link to="/login" className="font-medium text-cyan-300 hover:text-cyan-200">
        sign in to existing account
      </Link>
    </p>
  </div>
)

export default RegisterHeader
