import { useState } from 'react'

export default function AdminPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const seedChampions = async () => {
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch('/api/seed-champions', { method: 'POST' })
      const result = await response.json()
      if (response.ok) {
        setMessage('✅ Champions seeded successfully!')
      } else {
        setMessage(`❌ Error: ${result.message}`)
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-xl font-semibold mb-4">Admin Panel</h1>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={seedChampions}
        disabled={loading}
      >
        {loading ? 'Seeding...' : 'Seed Champions'}
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  )
}