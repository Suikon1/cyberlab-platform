import { Download, Star, Tag, HardDrive } from 'lucide-react'

export default function MachineCard({ machine }) {
  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Fácil': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Intermedio': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'Avanzado': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const handleDownload = () => {
    alert(`Descargando ${machine.name}.zip...`)
  }

  return (
    <div className="bg-slate-800/30 backdrop-blur-md border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-400/40 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <button className={`p-1 rounded ${machine.starred ? 'text-yellow-400' : 'text-gray-500'}`}>
            <Star className={`w-5 h-5 ${machine.starred ? 'fill-current' : ''}`} />
          </button>
          <div>
            <h3 className="text-xl font-bold text-white">{machine.name}</h3>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(machine.difficulty)}`}>
              {machine.difficulty}
            </span>
          </div>
        </div>
        {machine.completed && (
          <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-500/30">
            COMPLETO
          </div>
        )}
      </div>

      <p className="text-cyan-100/80 mb-4 text-sm">{machine.description}</p>

      <div className="flex items-center space-x-4 mb-4 text-sm text-cyan-300/80">
        <div className="flex items-center space-x-1">
          <HardDrive className="w-4 h-4" />
          <span>Tamaño: {machine.size}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {machine.tags?.map((tag, index) => (
          <span key={index} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs border border-blue-500/30">
            {tag}
          </span>
        ))}
      </div>

      <button
        onClick={handleDownload}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
      >
        <Download className="w-5 h-5" />
        <span>Descargar Máquina</span>
      </button>
    </div>
  )
}