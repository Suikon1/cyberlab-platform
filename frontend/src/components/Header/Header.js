import { Shield, Settings, LogIn, LogOut, User } from 'lucide-react';

export default function Header({ 
  totalMachines = 0, 
  onOpenAdmin, 
  onOpenLogin, 
  isAdmin = false, 
  adminUser = null, 
  onLogout 
}) {
  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-cyan-500/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                CIBERTRACK VIÑA
              </h1>
              <p className="text-sm text-cyan-300/60">Laboratorio de Ciberseguridad</p>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Admin/Login Section */}
            {isAdmin && adminUser ? (
              <div className="flex items-center space-x-3">
                {/* Admin Profile */}
                <div className="flex items-center space-x-2 bg-slate-800/50 rounded-lg px-3 py-2 border border-cyan-500/20">
                  <User className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-cyan-300">{adminUser.username}</span>
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded border border-purple-500/30">
                    ADMIN
                  </span>
                </div>

                {/* Admin Panel Button */}
                <button
                  onClick={onOpenAdmin}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-purple-500/25"
                >
                  <Settings className="w-5 h-5" />
                  <span>Panel</span>
                </button>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white font-medium py-2 px-3 rounded-lg transition-all duration-300 flex items-center space-x-2 border border-slate-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-cyan-500/25"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </button>
            )}

            {/* Machines Counter */}
            <div className="text-cyan-400 text-center bg-slate-800/30 rounded-lg px-4 py-2 border border-cyan-500/20">
              <div className="text-2xl font-bold">{totalMachines}</div>
              <div className="text-xs text-cyan-300/60 uppercase tracking-wide">Máquinas</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}