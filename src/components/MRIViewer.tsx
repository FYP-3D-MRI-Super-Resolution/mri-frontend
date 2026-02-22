import { useRef, useEffect, useState } from 'react'
import { Niivue } from '@niivue/niivue'

interface MRIViewerProps {
  fileUrl: string
  title?: string
}

const MRIViewer = ({ fileUrl, title }: MRIViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nvRef = useRef<Niivue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const initViewer = async () => {
      try {
        setLoading(true)
        setError(null)

        // Initialize NiiVue
        const nv = new Niivue()
        await nv.attachToCanvas(canvasRef.current!)
        nvRef.current = nv

        // Load volume - NiiVue accepts array of volume configurations
        await nv.loadVolumes([{
          url: fileUrl,
          colormap: 'gray',
          opacity: 1.0,
        }])
        nv.setSliceType(nv.sliceTypeMultiplanar)

        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load MRI')
        setLoading(false)
      }
    }

    initViewer()

    return () => {
      // Cleanup: NiiVue doesn't have destroy method, cleanup is automatic
      if (nvRef.current) {
        nvRef.current = null
      }
    }
  }, [fileUrl])

  const setViewMode = (mode: number) => {
    if (nvRef.current) {
      nvRef.current.setSliceType(mode)
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </h3>
      )}

      <div className="relative bg-black rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-[600px]"
          width={800}
          height={600}
        />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-white">Loading MRI scan...</div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-red-500">{error}</div>
          </div>
        )}
      </div>

      {/* View Controls */}
      <div className="flex space-x-2">
        <button
          onClick={() => setViewMode(0)}
          className="btn btn-secondary text-sm"
        >
          Axial
        </button>
        <button
          onClick={() => setViewMode(1)}
          className="btn btn-secondary text-sm"
        >
          Coronal
        </button>
        <button
          onClick={() => setViewMode(2)}
          className="btn btn-secondary text-sm"
        >
          Sagittal
        </button>
        <button
          onClick={() => setViewMode(4)}
          className="btn btn-secondary text-sm"
        >
          Multi-planar
        </button>
      </div>
    </div>
  )
}

export default MRIViewer
