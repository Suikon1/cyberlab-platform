import { useState } from 'react';
import { Upload, X, FileText, Tag, AlertCircle } from 'lucide-react';

export default function UploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    difficulty: 'Intermedio',
    tags: ''
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError(''); // Limpiar errores previos
    
    if (selectedFile) {
      // Verificar que sea un archivo ZIP
      if (!selectedFile.name.toLowerCase().endsWith('.zip')) {
        setError('Por favor selecciona un archivo ZIP válido');
        setFile(null);
        return;
      }
      
      // Verificar tamaño (500MB máximo)
      const maxSize = 500 * 1024 * 1024; // 500MB
      if (selectedFile.size > maxSize) {
        setError('El archivo es demasiado grande. Máximo permitido: 500MB');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      
      // Auto-rellenar nombre basado en el archivo si no hay nombre
      if (!formData.name) {
        const fileName = selectedFile.name.replace('.zip', '');
        setFormData(prev => ({
          ...prev,
          name: fileName
        }));
      }
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validaciones
    if (!file) {
      setError('Por favor selecciona un archivo ZIP');
      return;
    }
    
    if (!formData.name.trim()) {
      setError('El nombre de la máquina es obligatorio');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('La descripción es obligatoria');
      return;
    }

    setUploading(true);
    
    const uploadFormData = new FormData();
    uploadFormData.append('machineFile', file);
    uploadFormData.append('name', formData.name.trim());
    uploadFormData.append('description', formData.description.trim());
    uploadFormData.append('difficulty', formData.difficulty);
    uploadFormData.append('tags', formData.tags.trim());

    try {
      const response = await fetch('http://localhost:5000/api/machines/upload', {
        method: 'POST',
        body: uploadFormData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Error HTTP ${response.status}`);
      }

      // Éxito
      alert('✅ Máquina subida exitosamente!');
      onUploadSuccess(result.machine);
      handleClose();
      
    } catch (error) {
      console.error('Error al subir:', error);
      setError(error.message || 'Error desconocido al subir la máquina');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    // Limpiar formulario al cerrar
    setFile(null);
    setFormData({
      name: '',
      description: '',
      difficulty: 'Intermedio',
      tags: ''
    });
    setError('');
    setUploading(false);
    onClose();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-cyan-500/30 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Upload className="w-6 h-6 text-cyan-400" />
            <span>Subir Máquina Docker</span>
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mb-4 flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-red-300 text-sm">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-2">
              Archivo ZIP *
            </label>
            <input
              type="file"
              accept=".zip"
              onChange={handleFileChange}
              className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-3 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-500 file:text-white file:cursor-pointer hover:file:bg-cyan-400"
              required
              disabled={uploading}
            />
            {file && (
              <div className="mt-2 p-2 bg-green-900/20 border border-green-500/30 rounded text-green-300 text-sm">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>{file.name}</span>
                </div>
                <div className="text-xs text-green-400 mt-1">
                  Tamaño: {formatFileSize(file.size)}
                </div>
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-2">
              Nombre de la máquina *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
              className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
              placeholder="ejemplo: anonymouspingu"
              required
              disabled={uploading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-2">
              Descripción *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
              className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
              placeholder="Descripción detallada de la máquina..."
              rows={3}
              required
              disabled={uploading}
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
              disabled={uploading}
            >
              <option value="Fácil">Fácil</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-2">
              <div className="flex items-center space-x-1">
                <Tag className="w-4 h-4" />
                <span>Tags (separados por comas)</span>
              </div>
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({...prev, tags: e.target.value}))}
              className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
              placeholder="Web, SQLi, Docker, Linux"
              disabled={uploading}
            />
            <div className="text-xs text-cyan-400 mt-1">
              Ejemplo: Web, SQLi, File Upload, Linux
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
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

        <div className="mt-4 text-xs text-cyan-400/60">
          <p>• Solo archivos ZIP (máximo 500MB)</p>
          <p>• Asegúrate de que el ZIP contenga todos los archivos necesarios</p>
        </div>
      </div>
    </div>
  );
}