interface ViewerMetricsProps {
  metrics: Record<string, number | string>
}

const ViewerMetrics = ({ metrics }: ViewerMetricsProps) => (
  <div className="card">
    <h2 className="text-xl font-semibold mb-4 text-white">Quality Metrics</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(metrics).map(([key, value]) => (
        <div key={key} className="text-center p-4 bg-slate-800/50 rounded-xl">
          <p className="text-xs text-dim uppercase tracking-widest">{key}</p>
          <p className="text-2xl font-bold text-white mt-1">
            {typeof value === 'number' ? value.toFixed(4) : value}
          </p>
        </div>
      ))}
    </div>
  </div>
)

export default ViewerMetrics
