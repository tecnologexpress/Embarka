import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Vite + React + Tailwind</h1>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 mb-4"
          >
            count is {count}
          </button>
          <p className="text-gray-600">
            Edit <code className="bg-gray-100 px-2 py-1 rounded">src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="bg-blue-700 text-gray-500 mt-8">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  )
}

export default App
