import { useState } from 'react';
import { LogIn, X, Shield } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error de autenticación');
      }

      const data = await response.json();
      
      // Guardar en localStorage
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      
      onLoginSuccess(data.user);
      onClose();
      
      // Limpiar formulario
      setCredentials({ username: '', password: '' });
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-cyan-500/30 rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Shield className="w-6 h-6 text-cyan-400" />
            <span>Login de Administrador</span>
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-2">Usuario</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({...prev, username: e.target.value}))}
              className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
              placeholder="admin"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-2">Contraseña</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({...prev, password: e.target.value}))}
              className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
              placeholder="password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Iniciar Sesión</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-4 text-sm text-cyan-300/60 text-center">
          <p>Credenciales: <span className="text-cyan-300">admin / password</span></p>
        </div>
      </div>
    </div>
  );
}