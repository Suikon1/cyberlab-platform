import { useState, useEffect } from 'react'
import Header from '../components/Header/Header'
import MachineCard from '../components/MachineCard/MachineCard'
import FilterBar from '../components/FilterBar/FilterBar'
import AdminPanel from '../components/AdminPanel/AdminPanel'
import LoginModal from '../components/LoginModal/LoginModal'

export default function Home() {
  const [machines, setMachines] = useState([])
  const [filteredMachines, setFilteredMachines] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdmin, setShowAdmin] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminUser, setAdminUser] = useState(null)

  const loadMachines = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/machines')
      const data = await response.json()
      setMachines(data)
      setFilteredMachines(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMachines()
    
    // Verificar si hay un admin logueado
    const token = localStorage.getItem('adminToken')
    const user = localStorage.getItem('adminUser')
    if (token && user) {
      setIsAdmin(true)
      setAdminUser(JSON.parse(user))
    }
  }, [])

  const handleLoginSuccess = (user) => {
    setIsAdmin(true)
    setAdminUser(user)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    setIsAdmin(false)
    setAdminUser(null)
    setShowAdmin(false)
  }

  const handleOpenAdmin = () => {
    if (isAdmin) {
      setShowAdmin(true)
    } else {
      setShowLogin(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Header 
        totalMachines={machines.length} 
        onOpenAdmin={handleOpenAdmin}
        onOpenLogin={() => setShowLogin(true)}
        isAdmin={isAdmin}
        adminUser={adminUser}
        onLogout={handleLogout}
      />
      <FilterBar 
        machines={machines} 
        onFilter={setFilteredMachines} 
      />
      <main className="max-w-7xl mx-auto px-6 py-6">
        {loading ? (
          <div className="text-center text-cyan-400">Cargando máquinas...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMachines.map((machine) => (
              <MachineCard key={machine.id} machine={machine} />
            ))}
          </div>
        )}
      </main>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <AdminPanel
        isOpen={showAdmin}
        onClose={() => setShowAdmin(false)}
        isAdmin={isAdmin}
      />
    </div>
  )
}