'use client'

import { useState, useEffect } from 'react'
import Header from '../components/Header/Header'
import MachineCard from '../components/MachineCard/MachineCard'
import FilterBar from '../components/FilterBar/FilterBar'

export default function Home() {
  const [machines, setMachines] = useState([])
  const [filteredMachines, setFilteredMachines] = useState([])
  const [loading, setLoading] = useState(true)

  // Datos de ejemplo (después conectaremos con el backend)
  const sampleMachines = [
    {
      id: 1,
      name: 'anonymouspingu',
      difficulty: 'Intermedio',
      description: 'Máquina de pentesting enfocada en técnicas de anonimato',
      size: '231.2 MB',
      tags: ['Steganography', 'OSINT', 'Network'],
      completed: true,
      starred: true,
    },
    {
      id: 2,
      name: 'dance_samba',
      difficulty: 'Fácil',
      description: 'Desafío de explotación web con temática brasileña',
      size: '159.3 MB',
      tags: ['Web', 'SQLi', 'File Upload'],
      completed: true,
      starred: true,
    }
  ]

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setMachines(sampleMachines)
      setFilteredMachines(sampleMachines)
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Header totalMachines={machines.length} />
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
    </div>
  )
}