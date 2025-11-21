export default function Spinner({ size = 'medium', className = '' }) {
  const sizeClass = size === 'small' ? 'spinner--small' : size === 'large' ? 'spinner--large' : ''
  
  return (
    <div className={`spinner ${sizeClass} ${className}`} role="status" aria-label="Loading">
      <div className="spinner__circle"></div>
    </div>
  )
}

