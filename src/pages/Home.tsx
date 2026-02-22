import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="px-4 py-12">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            MRI Super-Resolution Pipeline
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Transform low-resolution MRI scans into high-resolution images using
            deep learning
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="card text-center">
            <div className="text-4xl mb-4">📤</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Upload & Preprocess
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload raw MRI scans and receive preprocessed HR/LR pairs
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Super-Resolution
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Apply trained models to generate high-resolution predictions
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              3D Visualization
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Interactive comparison with multi-planar views and volume rendering
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 space-x-4">
          <Link to="/upload" className="btn btn-primary text-lg px-8 py-3 inline-block">
            Get Started
          </Link>
          <Link
            to="/jobs"
            className="btn btn-secondary text-lg px-8 py-3 inline-block"
          >
            View Jobs
          </Link>
        </div>

        {/* Info */}
        <div className="mt-16 card text-left">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            How It Works
          </h2>
          <ol className="space-y-4 text-gray-700 dark:text-gray-300">
            <li className="flex">
              <span className="font-bold text-primary-600 mr-3">1.</span>
              <div>
                <strong>Upload Your MRI Scans:</strong> Support for NIfTI format
                (.nii, .nii.gz)
              </div>
            </li>
            <li className="flex">
              <span className="font-bold text-primary-600 mr-3">2.</span>
              <div>
                <strong>Preprocessing:</strong> Automatic brain extraction, bias
                correction, and normalization
              </div>
            </li>
            <li className="flex">
              <span className="font-bold text-primary-600 mr-3">3.</span>
              <div>
                <strong>Model Inference:</strong> GPU-accelerated super-resolution
                processing
              </div>
            </li>
            <li className="flex">
              <span className="font-bold text-primary-600 mr-3">4.</span>
              <div>
                <strong>Visualize & Compare:</strong> Interactive 3D viewer to
                compare LR vs HR images
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default Home
