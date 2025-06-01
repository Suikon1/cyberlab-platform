import { useState } from 'react';
import { Upload, X, FileText, Tag } from 'lucide-react';

export default function UploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    difficulty: 'Intermedio',
    tags: ''
  });
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.zip')) {
      setFile(selectedFile);
      // Auto-rellenar nombre basado en el archivo
      if (!formData.name) {
        setFormData(prev => ({
          ...prev,
          name: selectedFile.name.replace('.zip', '')
        }));
      }
    } else {
      alert('Por favor selecciona un archivo ZIP');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Por favor selecciona un archivo');
      return;
    }

    setUploading(true);
    
    const uploadFormData = new FormData();
    uploadFormData.append('machineFile', file);
    uploadFormData.append('name', formData.name);
    uploadFormData.append('description', formData.description);
    uploadFormData.append('difficulty', formData.difficulty);
    uploadFormData.append('tags', formData.tags);

    try {
      const response = await fetch('http://localhost:5000/api/machines/upload', {
        method: 'POST',
        body: uploadFormData
      });

      if (!response.ok) {
        throw new Error('Error al subir la máquina');
      }

      const result = await response.json();
      alert('✅ Máquina subida exitosamente!');
      onUploadSuccess(result.machine);
      onClose();
      
      // Limpiar formulario
      setFile(null);
      setFormData({
        name: '',
        description: '',
        difficulty: 'Intermedio',
        tags: ''
      });
      
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al subir la máquina: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-cyan-500/30 rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Upload className="w-6 h-6 text-cyan-400" />
            <span>Subir Máquina Docker</span>
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-2">
              Archivo ZIP
            </label>
            <input
              type="file"
              accept=".zip"
              onChange={handleFileChange}
              className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-3 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-500 file:text-white file:cursor-pointer"
              required
            />
            {file && (
              <p className="text-sm text-green-400 mt-1">
                ✅ {file.name} ({(file.size / (1024 * 1024)).toFixed(1)} MB)
              </p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-2">
              Nombre de la máquina
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
              className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
              placeholder="anonymouspingu"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
              className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
              placeholder="Descripción de la máquina..."
              rows={3}
              required
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-2">
              Dificultad
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData(prev => ({...prev, difficulty: e.target.value}))}
              className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="Fácil">Fácil</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-2">
              Tags (separados por comas)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({...prev, tags: e.target.value}))}
              className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
              placeholder="Web, SQLi, Docker"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Subiendo...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Subir Máquina</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}