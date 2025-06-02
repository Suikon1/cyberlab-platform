import { useState, useEffect } from 'react';
import { Edit2, Save, X, Plus, ExternalLink, FileText, Upload, Trash2 } from 'lucide-react';
import UploadModal from '../UploadModal/UploadModal';

export default function AdminPanel({ isOpen, onClose, isAdmin }) {
  const [machines, setMachines] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showWriteupForm, setShowWriteupForm] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [writeupData, setWriteupData] = useState({
    title: '',
    url: '',
    description: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchMachines();
    }
  }, [isOpen]);

  const fetchMachines = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/machines');
      const data = await response.json();
      setMachines(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const startEdit = (machine) => {
    setEditingId(machine.id);
    setEditData({
      description: machine.description,
      difficulty: machine.difficulty,
      tags: machine.tags.join(', ')
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async (machineId) => {
    if (!isAdmin) {
      alert('Solo los administradores pueden editar máquinas');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/machines/${machineId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar máquina');
      }

      alert('✅ Máquina actualizada exitosamente!');
      setEditingId(null);
      fetchMachines();
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  const deleteMachine = async (machineId, machineName) => {
    if (!isAdmin) {
      alert('Solo los administradores pueden eliminar máquinas');
      return;
    }

    if (!confirm(`¿Estás seguro de que quieres eliminar la máquina "${machineName}"?\n\nEsta acción eliminará tanto la máquina de la lista como el archivo ZIP del servidor.`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/machines/${machineId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar máquina');
      }

      alert('✅ Máquina eliminada exitosamente!');
      fetchMachines();
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  const addWriteup = async (machineId) => {
    if (!isAdmin) {
      alert('Solo los administradores pueden agregar writeups');
      return;
    }

    if (!writeupData.title || !writeupData.url) {
      alert('Por favor completa título y URL');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/machines/${machineId}/writeup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(writeupData)
      });

      if (!response.ok) {
        throw new Error('Error al agregar writeup');
      }

      alert('✅ Writeup agregado exitosamente!');
      setShowWriteupForm(null);
      setWriteupData({ title: '', url: '', description: '' });
      fetchMachines();
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  const handleUploadSuccess = (newMachine) => {
    fetchMachines(); // Recargar la lista de máquinas
    setShowUploadModal(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-cyan-500/30 rounded-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Panel de Administración</h2>
            <div className="flex items-center space-x-3">
              {isAdmin && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center space-x-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>Subir Máquina</span>
                </button>
              )}
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {!isAdmin && (
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6 text-yellow-300">
              ⚠️ Necesitas iniciar sesión como administrador para editar contenido
            </div>
          )}

          <div className="space-y-6">
            {machines.map((machine) => (
              <div key={machine.id} className="bg-slate-700/30 border border-cyan-500/20 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-white text-lg">{machine.name}</h3>
                      {isAdmin && (
                        <div className="flex items-center space-x-2">
                          {editingId !== machine.id && (
                            <>
                              <button
                                onClick={() => startEdit(machine)}
                                className="text-cyan-400 hover:text-cyan-300 p-1"
                                title="Editar máquina"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => deleteMachine(machine.id, machine.name)}
                                className="text-red-400 hover:text-red-300 p-1"
                                title="Eliminar máquina"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {editingId === machine.id ? (
                      <div className="mt-3 space-y-3">
                        <div>
                          <label className="block text-sm text-cyan-300 mb-1">Descripción:</label>
                          <textarea
                            value={editData.description}
                            onChange={(e) => setEditData(prev => ({...prev, description: e.target.value}))}
                            className="w-full bg-slate-600 border border-cyan-500/30 rounded px-3 py-2 text-white"
                            rows={3}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm text-cyan-300 mb-1">Dificultad:</label>
                          <select
                            value={editData.difficulty}
                            onChange={(e) => setEditData(prev => ({...prev, difficulty: e.target.value}))}
                            className="bg-slate-600 border border-cyan-500/30 rounded px-3 py-2 text-white"
                          >
                            <option value="Fácil">Fácil</option>
                            <option value="Intermedio">Intermedio</option>
                            <option value="Avanzado">Avanzado</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm text-cyan-300 mb-1">Tags (separados por comas):</label>
                          <input
                            type="text"
                            value={editData.tags}
                            onChange={(e) => setEditData(prev => ({...prev, tags: e.target.value}))}
                            className="w-full bg-slate-600 border border-cyan-500/30 rounded px-3 py-2 text-white"
                          />
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => saveEdit(machine.id)}
                            className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded flex items-center space-x-1"
                          >
                            <Save className="w-4 h-4" />
                            <span>Guardar</span>
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <p className="text-cyan-100/80 text-sm">{machine.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-cyan-300/60">
                          <span>Dificultad: {machine.difficulty}</span>
                          <span>Tamaño: {machine.size}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {machine.tags?.map((tag, index) => (
                            <span key={index} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Writeups Section */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-cyan-300 flex items-center space-x-1">
                              <FileText className="w-4 h-4" />
                              <span>Writeups</span>
                            </h4>
                            {isAdmin && (
                              <button
                                onClick={() => setShowWriteupForm(machine.id)}
                                className="text-xs bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded flex items-center space-x-1"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Agregar</span>
                              </button>
                            )}
                          </div>
                          
                          {machine.writeups && machine.writeups.length > 0 ? (
                            <div className="space-y-2">
                              {machine.writeups.map((writeup) => (
                                <div key={writeup.id} className="bg-slate-600/20 border border-cyan-500/10 rounded p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <h5 className="text-white text-sm font-medium">{writeup.title}</h5>
                                      {writeup.description && (
                                        <p className="text-cyan-300/60 text-xs mt-1">{writeup.description}</p>
                                      )}
                                      <p className="text-cyan-400/60 text-xs mt-1">
                                        Por: {writeup.addedBy}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => window.open(writeup.url, '_blank')}
                                      className="text-cyan-400 hover:text-cyan-300 ml-2 flex items-center space-x-1 bg-cyan-500/10 px-2 py-1 rounded"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                      <span className="text-xs">Ver</span>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-400 text-xs">No hay writeups disponibles</p>
                          )}

                          {/* Formulario para agregar writeup */}
                          {showWriteupForm === machine.id && (
                            <div className="mt-3 p-3 bg-slate-600/20 border border-cyan-500/20 rounded">
                              <h5 className="text-white text-sm font-medium mb-3">Agregar Writeup</h5>
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  placeholder="Título del writeup *"
                                  value={writeupData.title}
                                  onChange={(e) => setWriteupData(prev => ({...prev, title: e.target.value}))}
                                  className="w-full bg-slate-700 border border-cyan-500/30 rounded px-3 py-2 text-white text-sm"
                                />
                                <input
                                  type="url"
                                  placeholder="URL del writeup (web o PDF) *"
                                  value={writeupData.url}
                                  onChange={(e) => setWriteupData(prev => ({...prev, url: e.target.value}))}
                                  className="w-full bg-slate-700 border border-cyan-500/30 rounded px-3 py-2 text-white text-sm"
                                />
                                <textarea
                                  placeholder="Descripción (opcional)"
                                  value={writeupData.description}
                                  onChange={(e) => setWriteupData(prev => ({...prev, description: e.target.value}))}
                                  className="w-full bg-slate-700 border border-cyan-500/30 rounded px-3 py-2 text-white text-sm"
                                  rows={2}
                                />
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => addWriteup(machine.id)}
                                    className="bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded text-sm flex items-center space-x-1"
                                  >
                                    <Plus className="w-4 h-4" />
                                    <span>Agregar</span>
                                  </button>
                                  <button
                                    onClick={() => setShowWriteupForm(null)}
                                    className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded text-sm"
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {machines.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 text-lg mb-2">No hay máquinas disponibles</div>
              {isAdmin && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center space-x-2 mx-auto"
                >
                  <Upload className="w-5 h-5" />
                  <span>Subir Primera Máquina</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Upload */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </>
  );
}