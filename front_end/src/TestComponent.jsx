import { useState, useEffect } from 'react'

function TestComponent() {
  const [message, setMessage] = useState('Testing...')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Test React hooks
    setTimeout(() => {
      setMessage('✅ React Hooks Working!')
      setIsVisible(true)
    }, 1000)
  }, [])

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg text-white mb-4">
      <h3 className="text-xl font-bold mb-2">🧪 Compatibility Test</h3>
      <div className="space-y-2">
        <p className="flex items-center">
          <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
          ⚡ Vite: Fast & Running
        </p>
        <p className="flex items-center">
          <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
          ⚛️ React: {message}
        </p>
        <p className="flex items-center">
          <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
          🎨 Tailwind: Styling Applied
        </p>
        {isVisible && (
          <div className="mt-4 p-3 bg-gray-800/20 rounded animate-pulse">
            <p className="text-sm">
              🎉 All systems are compatible and running smoothly!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TestComponent
