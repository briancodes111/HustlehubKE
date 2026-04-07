export default function LoadingSpinner({ fullscreen = false }) {
  const wrapStyle = fullscreen
    ? { position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A', zIndex: 9999 }
    : { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }

  return (
    <div style={wrapStyle}>
      <div style={{
        width: 36, height: 36,
        border: '3px solid #1F1F1F',
        borderTopColor: '#F59E0B',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
    </div>
  )
}
