import { useState } from 'react'
import { Search } from 'lucide-react'

export default function FilterBar({ machines, onFilter }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  const handleFilter = (search, difficulty) => {
    let filtered = machines.filter(machine => {
      const matchesSearch = machine.name.toLowerCase().includes(search.toLowerCase()) ||
                           machine.description.toLowerCase().includes(search.toLowerCase())
      const matchesDifficulty = difficulty === 'all' || machine.difficulty === difficulty
      return matchesSearch && matchesDifficulty
    })
    onFilter(filtered)
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    handleFilter(value, selectedDifficulty)
  }

  const handleDifficultyChange = (e) => {
    const value = e.target.value
    setSelectedDifficulty(value)
    handleFilter(searchTerm, value)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-4">
      {/* Info Banner */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm mb-6">
        <div className="flex items-center space-x-2 text-blue-300">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">!</div>
          <span className="text-sm">
            Máquinas Docker solucionadas para práctica de ciberseguridad. Cada desafío incluye documentación completa y writeups detallados.
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400/60" />
          <input
            type="text"
            placeholder="Buscar máquinas..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-slate-800/50 border border-cyan-500/30 rounded-lg pl-10 pr-4 py-3 text-white placeholder-cyan-400/60 focus:border-cyan-400 focus:outline-none backdrop-blur-sm"
          />
        </div>
        <select
          value={selectedDifficulty}
          onChange={handleDifficultyChange}
          className="bg-slate-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none backdrop-blur-sm"
        >
          <option value="all">Todas las dificultades</option>
          <option value="Fácil">Fácil</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>
      </div>
    </div>
  )
}