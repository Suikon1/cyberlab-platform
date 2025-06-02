import { useState } from 'react';
import { Download, Star, HardDrive, FileText, ExternalLink, Clock } from 'lucide-react';

export default function MachineCard({ machine }) {
  const [downloading, setDownloading] = useState(false);
  const [showWriteups, setShowWriteups] = useState(false);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Fácil': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Intermedio': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'Avanzado': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    
    try {
      const response = await fetch(`http://localhost:5000/api/machines/${machine.name}/download`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Archivo de máquina no encontrado en el servidor');
        }
        throw new Error('Error al descargar la máquina');
      }

      // Get the blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${machine.name}.zip`;
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Success feedback
      alert(`✅ Descarga de ${machine.name}.zip iniciada correctamente!`);
      
    } catch (error) {
      console.error('Download error:', error);
      alert(`❌ Error al descargar: ${error.message}`);
    } finally {
      setDownloading(false);
    }
  };

  const handleStarToggle = () => {
    // This would typically update the server and local state
    console.log('Toggle star for machine:', machine.name);
  };

  return (
    <div className="bg-slate-800/30 backdrop-blur-md border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
      {/* Machine Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleStarToggle}
            className={`p-1 rounded transition-colors ${machine.starred ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-500 hover:text-yellow-400'}`}
          >
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
          <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-500/30 flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>COMPLETO</span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-cyan-100/80 mb-4 text-sm leading-relaxed">
        {machine.description}
      </p>

      {/* File Info */}
      <div className="flex items-center space-x-4 mb-4 text-sm text-cyan-300/80">
        <div className="flex items-center space-x-1">
          <HardDrive className="w-4 h-4" />
          <span>Tamaño: {machine.size}</span>
        </div>
        {machine.writeups && machine.writeups.length > 0 && (
          <div className="flex items-center space-x-1">
            <FileText className="w-4 h-4" />
            <span>{machine.writeups.length} writeup{machine.writeups.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {machine.tags?.map((tag, index) => (
          <span
            key={index}
            className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Writeups Section */}
      {machine.writeups && machine.writeups.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setShowWriteups(!showWriteups)}
            className="text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1 mb-2"
          >
            <FileText className="w-4 h-4" />
            <span>Ver writeups ({machine.writeups.length})</span>
          </button>
          
          {showWriteups && (
            <div className="space-y-2 bg-slate-700/20 rounded-lg p-3 border border-cyan-500/10">
              {machine.writeups.map((writeup) => (
                <div key={writeup.id} className="flex items-center justify-between p-2 bg-slate-600/20 rounded border border-cyan-500/10">
                  <div className="flex-1">
                    <h5 className="text-white text-sm font-medium">{writeup.title}</h5>
                    {writeup.description && (
                      <p className="text-cyan-300/60 text-xs mt-1">{writeup.description}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-1 text-xs text-cyan-400/60">
                      <span>Por: {writeup.addedBy}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(writeup.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => window.open(writeup.url, '_blank')}
                    className="text-cyan-400 hover:text-cyan-300 ml-2 flex items-center space-x-1 bg-cyan-500/10 hover:bg-cyan-500/20 px-2 py-1 rounded transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-xs">Ver</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-cyan-500/25"
      >
        {downloading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            <span>Descargando...</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>Descargar Máquina</span>
          </>
        )}
      </button>
    </div>
  );
}