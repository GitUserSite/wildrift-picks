import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zljuvpcbomqlkmsyqqnw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsanV2cGNib21xbGttc3lxcW53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMTc1MjMsImV4cCI6MjA2MDg5MzUyM30.6TZzdrfrZoB7x1EKlu05RUPOfXVSiisIVFlVxlZsC_w'
const supabase = createClient(supabaseUrl, supabaseKey)

export default function HomePage() {
  const [champions, setChampions] = useState([])
  const [filtered, setFiltered] = useState([])
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
    <div className="p-4 max-w-5xl mx-auto">
      <Tabs value={lane} onValueChange={setLane} className="mb-4">
        <TabsList className="flex flex-wrap gap-2">
          {['all', 'top', 'jungle', 'mid', 'adc', 'support'].map(pos => (
            <TabsTrigger key={pos} value={pos}>
              {pos.toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Input
        type="text"
        placeholder="Search champions..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-6"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.map(champ => (
          <Card key={champ.id} className="text-center">
            <CardContent className="p-2">
              <img src={champ.image_url} alt={champ.name} className="mx-auto mb-2 rounded" />
              <div className="text-sm font-medium">{champ.name}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}