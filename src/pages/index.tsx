import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zljuvpcbomqlkmsyqqnw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsanV2cGNib21xbGttc3lxcW53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMTc1MjMsImV4cCI6MjA2MDg5MzUyM30.6TZzdrfrZoB7x1EKlu05RUPOfXVSiisIVFlVxlZsC_w'
const supabase = createClient(supabaseUrl, supabaseKey)

export default function HomePage() {
  const [champions, setChampions] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [lane, setLane] = useState('all')

  useEffect(() => {
    const fetchChampions = async () => {
      const { data } = await supabase.from('champions').select('*')
      setChampions(data || [])
      setFiltered(data || [])
    }
    fetchChampions()
  }, [])

  useEffect(() => {
    let filteredList = [...champions]
    if (lane !== 'all') {
      filteredList = filteredList.filter(champ => champ.lane === lane)
    }
    if (search.trim()) {
      filteredList = filteredList.filter(champ =>
        champ.name.toLowerCase().includes(search.toLowerCase())
      )
    }
    setFiltered(filteredList)
  }, [search, lane, champions])

  return (
    <div className="p-4 min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 text-white max-w-5xl mx-auto">
      <div className="flex gap-2 flex-wrap mb-4">
        {["all", "top", "jungle", "mid", "adc", "support"].map((pos) => (
          <button
            key={pos}
            onClick={() => setLane(pos)}
            className={`px-3 py-1 rounded-full transition shadow ${lane === pos ? 'bg-blue-500 text-white font-semibold shadow-lg' : 'bg-gray-300 text-black hover:bg-gray-400'}`}
          >
            {pos.toUpperCase()}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Search champions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full p-2 border rounded"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.map((champ) => (
          <div key={champ.id} className="text-center rounded-xl p-4 bg-white shadow-lg hover:scale-105 transition duration-300">
            <img
              src={champ.image_url}
              alt={champ.name}
              className="mx-auto mb-2 rounded w-full h-auto"
            />
            <div className="text-sm font-medium">{champ.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
