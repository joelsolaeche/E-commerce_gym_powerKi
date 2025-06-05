function App() {
  return (
    <div style={{ 
      padding: '40px', 
      backgroundColor: 'white', 
      color: 'black', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: 'blue', fontSize: '2rem', marginBottom: '20px' }}>
        🛒 E-Commerce Test
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
        React is working! ✅
      </p>
      <button style={{
        padding: '12px 24px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer'
      }}>
        Test Button
      </button>
    </div>
  )
}

export default App
