import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zljuvpcbomqlkmsyqqnw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsanV2cGNib21xbGttc3lxcW53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMTc1MjMsImV4cCI6MjA2MDg5MzUyM30.6TZzdrfrZoB7x1EKlu05RUPOfXVSiisIVFlVxlZsC_w'
const supabase = createClient(supabaseUrl, supabaseKey)

const riotIdMap: Record<string, number> = {
  "Ahri": 103, "Akali": 84, "Alistar": 12, "Amumu": 32, "Annie": 1, "Ashe": 22,
  "Aurelion Sol": 136, "Blitzcrank": 53, "Brand": 63, "Braum": 201, "Caitlyn": 51,
  "Camille": 164, "Corki": 42, "Darius": 122, "Diana": 131, "Dr. Mundo": 36,
  "Draven": 119, "Evelynn": 28, "Ezreal": 81, "Fiora": 114, "Fizz": 105, "Galio": 3,
  "Garen": 86, "Gragas": 79, "Graves": 104, "Irelia": 39, "Janna": 40, "Jarvan IV": 59,
  "Jax": 24, "Jhin": 202, "Jinx": 222, "Kai'Sa": 145, "Karma": 43, "Katarina": 55,
  "Kayle": 10, "Kennen": 85, "Kha'Zix": 121, "Lee Sin": 64, "Leona": 89, "Lucian": 236,
  "Lulu": 117, "Lux": 99, "Malphite": 54, "Master Yi": 11, "Miss Fortune": 21,
  "Morgana": 25, "Nami": 267, "Nasus": 75, "Nautilus": 111, "Olaf": 2, "Orianna": 61,
  "Pantheon": 80, "Rakan": 497, "Rammus": 33, "Renekton": 58, "Rengar": 107,
  "Riven": 92, "Senna": 235, "Seraphine": 147, "Sett": 875, "Shyvana": 102,
  "Singed": 27, "Sona": 37, "Soraka": 16, "Teemo": 17, "Thresh": 412, "Tristana": 18,
  "Tryndamere": 23, "Twisted Fate": 4, "Varus": 110, "Vayne": 67, "Veigar": 45,
  "Vi": 254, "Wukong": 62, "Xayah": 498, "Xin Zhao": 5, "Yasuo": 157, "Yone": 777,
  "Zed": 238, "Ziggs": 115, "Zoe": 142
}

export default function HomePage() {
  const [champions, setChampions] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [lane, setLane] = useState('all')

  useEffect(() => {
    const fetchChampions = async () => {
      const { data } = await supabase.from('champions').select('*')
      setChampions(data || [])
    }
    fetchChampions()
  }, [])

  const filtered = champions.filter(champ => {
    if (lane !== 'all' && champ.lane !== lane) return false
    if (search.trim() && !champ.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const released = filtered.filter(champ => champ.name in riotIdMap)
  const unreleased = filtered.filter(champ => !(champ.name in riotIdMap))

  return (
    <div className="p-4 min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 text-white max-w-5xl mx-auto">
      <div className="flex gap-2 flex-wrap mb-4">
        {['all', 'top', 'jungle', 'mid', 'adc', 'support'].map(pos => (
          <button
            key={pos}
            onClick={() => setLane(pos)}
            className={`px-3 py-1 rounded-full transition shadow ${
              lane === pos
                ? 'bg-blue-500 text-white font-semibold shadow-lg'
                : 'bg-gray-300 text-black hover:bg-gray-400'
            }`}
          >
            {pos.toUpperCase()}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Search champions..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-6 w-full p-2 border rounded text-black"
      />

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Available Champions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {released.map(champ => (
            <div key={champ.id} className="text-center rounded-xl p-4 bg-white shadow-lg hover:scale-105 transition duration-300 text-black">
              <img
                src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${riotIdMap[champ.name]}.png`}
                alt={champ.name}
                className="mx-auto mb-2 rounded-full w-16 h-16 object-cover"
              />
              <div className="text-sm font-medium">{champ.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2 opacity-70">Unreleased Champions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 opacity-60">
          {unreleased.map(champ => (
            <div key={champ.id} className="text-center rounded-xl p-4 bg-white shadow text-black grayscale">
              <div className="mx-auto mb-2 rounded-full w-16 h-16 bg-gray-300 flex items-center justify-center text-gray-700">
                ?
              </div>
              <div className="text-sm font-medium">{champ.name}</div>
              <div className="text-xs italic text-gray-500">Coming Soon</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
