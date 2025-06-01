import { Shield, Settings } from 'lucide-react'

export default function Header({ totalMachines = 0, onOpenAdmin }) {
  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                CIBERTRACK VIÑA
              </h1>
              <p className="text-sm text-cyan-300/60">Laboratorio de Ciberseguridad</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenAdmin}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center space-x-2"
            >
              <Settings className="w-5 h-5" />
              <span>Admin</span>
            </button>
            <div className="text-cyan-400 text-center">
              <div className="text-2xl font-bold">{totalMachines}</div>
              <div className="text-xs text-cyan-300/60">MÁQUINAS</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}