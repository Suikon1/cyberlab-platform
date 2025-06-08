// create-test-files.js
const fs = require('fs');
const path = require('path');
const { Writable } = require('stream');

// Directorio de máquinas
const machinesDir = path.join(__dirname, 'uploads', 'machines');

// Asegurar que el directorio existe
if (!fs.existsSync(machinesDir)) {
  fs.mkdirSync(machinesDir, { recursive: true });
}

// TAMAÑOS EXACTOS como aparecen en la interfaz
const machines = [
  { name: 'anonymouspingu', sizeMB: 231.2 },
  { name: 'dance-samba', sizeMB: 159.3 },
  { name: 'inclusion', sizeMB: 187.6 },
  { name: 'mirame', sizeMB: 142.8 },
  { name: 'pinguinazo', sizeMB: 203.1 },
  { name: 'whoiam', sizeMB: 188.5 }
];

console.log('🔨 Creando archivos ZIP del tamaño EXACTO de la plataforma...\n');

// Función mejorada para crear archivo del tamaño exacto usando streams
function createExactSizeFile(machine) {
  return new Promise((resolve, reject) => {
    const zipFile = path.join(machinesDir, `${machine.name}.zip`);
    const targetSizeBytes = Math.floor(machine.sizeMB * 1024 * 1024);
    
    console.log(`📝 Creando ${machine.name}.zip (${machine.sizeMB} MB = ${targetSizeBytes.toLocaleString()} bytes)...`);
    
    try {
      // Crear el archivo con FileStream para mejor manejo de memoria
      const writeStream = fs.createWriteStream(zipFile);
      let bytesWritten = 0;
      
      // ZIP headers mínimos para que sea reconocido como ZIP válido
      const zipHeaders = {
        localFileHeader: Buffer.from([
          0x50, 0x4B, 0x03, 0x04, // Local file header signature
          0x14, 0x00, // Version needed to extract
          0x00, 0x00, // General purpose bit flag
          0x00, 0x00, // Compression method (stored)
          0x00, 0x00, // File last modification time
          0x00, 0x00, // File last modification date
          0x00, 0x00, 0x00, 0x00, // CRC-32
          0xFF, 0xFF, 0xFF, 0xFF, // Compressed size (use data descriptor)
          0xFF, 0xFF, 0xFF, 0xFF, // Uncompressed size (use data descriptor)
          0x08, 0x00, // File name length
          0x00, 0x00, // Extra field length
          // File name (8 bytes)
          0x64, 0x61, 0x74, 0x61, 0x2E, 0x62, 0x69, 0x6E // "data.bin"
        ]),
        dataDescriptor: Buffer.from([
          0x50, 0x4B, 0x07, 0x08, // Data descriptor signature
          0x00, 0x00, 0x00, 0x00, // CRC-32
          0x00, 0x00, 0x00, 0x00, // Compressed size
          0x00, 0x00, 0x00, 0x00  // Uncompressed size
        ]),
        centralDirectory: Buffer.from([
          0x50, 0x4B, 0x01, 0x02, // Central directory file header signature
          0x3F, 0x00, // Version made by
          0x14, 0x00, // Version needed to extract
          0x00, 0x00, // General purpose bit flag
          0x00, 0x00, // Compression method
          0x00, 0x00, // File last modification time
          0x00, 0x00, // File last modification date
          0x00, 0x00, 0x00, 0x00, // CRC-32
          0x00, 0x00, 0x00, 0x00, // Compressed size
          0x00, 0x00, 0x00, 0x00, // Uncompressed size
          0x08, 0x00, // File name length
          0x00, 0x00, // Extra field length
          0x00, 0x00, // File comment length
          0x00, 0x00, // Disk number start
          0x00, 0x00, // Internal file attributes
          0x00, 0x00, 0x00, 0x00, // External file attributes
          0x00, 0x00, 0x00, 0x00, // Relative offset of local header
          // File name (8 bytes)
          0x64, 0x61, 0x74, 0x61, 0x2E, 0x62, 0x69, 0x6E // "data.bin"
        ]),
        endOfCentralDir: Buffer.from([
          0x50, 0x4B, 0x05, 0x06, // End of central dir signature
          0x00, 0x00, // Number of this disk
          0x00, 0x00, // Number of the disk with the start of the central directory
          0x01, 0x00, // Total number of entries in the central directory on this disk
          0x01, 0x00, // Total number of entries in the central directory
          0x00, 0x00, 0x00, 0x00, // Size of the central directory
          0x00, 0x00, 0x00, 0x00, // Offset of start of central directory
          0x00, 0x00  // ZIP file comment length
        ])
      };
      
      const totalHeaderSize = zipHeaders.localFileHeader.length + 
                            zipHeaders.dataDescriptor.length + 
                            zipHeaders.centralDirectory.length + 
                            zipHeaders.endOfCentralDir.length;
      
      const dataSize = targetSizeBytes - totalHeaderSize;
      
      // Escribir header local del archivo
      writeStream.write(zipHeaders.localFileHeader);
      bytesWritten += zipHeaders.localFileHeader.length;
      
      // Escribir datos en chunks para evitar problemas de memoria
      const chunkSize = 1024 * 1024; // 1MB chunks
      const fullChunks = Math.floor(dataSize / chunkSize);
      const lastChunkSize = dataSize % chunkSize;
      
      // Crear un chunk reutilizable
      const chunk = Buffer.alloc(chunkSize);
      
      // Llenar el chunk con datos pseudo-aleatorios basados en el nombre
      for (let i = 0; i < chunkSize; i++) {
        chunk[i] = (i * 7 + machine.name.charCodeAt(i % machine.name.length)) % 256;
      }
      
      // Escribir chunks completos
      let chunksWritten = 0;
      
      function writeNextChunk() {
        if (chunksWritten < fullChunks) {
          const canWrite = writeStream.write(chunk);
          chunksWritten++;
          bytesWritten += chunkSize;
          
          // Mostrar progreso cada 50MB
          if (chunksWritten % 50 === 0) {
            const progress = ((bytesWritten / targetSizeBytes) * 100).toFixed(1);
            process.stdout.write(`\r   Progreso: ${progress}% (${(bytesWritten / 1024 / 1024).toFixed(1)} MB)`);
          }
          
          if (!canWrite) {
            writeStream.once('drain', writeNextChunk);
          } else {
            setImmediate(writeNextChunk);
          }
        } else {
          // Escribir último chunk parcial si existe
          if (lastChunkSize > 0) {
            const lastChunk = Buffer.alloc(lastChunkSize);
            for (let i = 0; i < lastChunkSize; i++) {
              lastChunk[i] = chunk[i];
            }
            writeStream.write(lastChunk);
            bytesWritten += lastChunkSize;
          }
          
          // Escribir estructuras ZIP finales
          writeStream.write(zipHeaders.dataDescriptor);
          bytesWritten += zipHeaders.dataDescriptor.length;
          
          // Actualizar offsets en el central directory
          const cdOffset = zipHeaders.localFileHeader.length + dataSize + zipHeaders.dataDescriptor.length;
          zipHeaders.centralDirectory.writeUInt32LE(dataSize, 20); // Compressed size
          zipHeaders.centralDirectory.writeUInt32LE(dataSize, 24); // Uncompressed size
          
          writeStream.write(zipHeaders.centralDirectory);
          bytesWritten += zipHeaders.centralDirectory.length;
          
          // Actualizar end of central directory
          zipHeaders.endOfCentralDir.writeUInt32LE(zipHeaders.centralDirectory.length, 12); // Size of central dir
          zipHeaders.endOfCentralDir.writeUInt32LE(cdOffset, 16); // Offset of central dir
          
          writeStream.write(zipHeaders.endOfCentralDir);
          bytesWritten += zipHeaders.endOfCentralDir.length;
          
          writeStream.end();
        }
      }
      
      writeStream.on('finish', () => {
        // Verificar el tamaño final
        const stats = fs.statSync(zipFile);
        const actualSizeMB = (stats.size / 1024 / 1024).toFixed(1);
        const difference = Math.abs(stats.size - targetSizeBytes);
        
        console.log(`\n✅ ${machine.name}.zip creado exitosamente!`);
        console.log(`   Tamaño objetivo: ${machine.sizeMB} MB (${targetSizeBytes.toLocaleString()} bytes)`);
        console.log(`   Tamaño real: ${actualSizeMB} MB (${stats.size.toLocaleString()} bytes)`);
        console.log(`   Diferencia: ${difference} bytes (${(difference/1024).toFixed(2)} KB)`);
        
        resolve({
          name: machine.name,
          targetSize: machine.sizeMB,
          actualSize: parseFloat(actualSizeMB),
          success: true,
          difference: difference
        });
      });
      
      writeStream.on('error', (error) => {
        console.error(`\n❌ Error escribiendo ${machine.name}.zip:`, error);
        reject(error);
      });
      
      // Iniciar escritura
      writeNextChunk();
      
    } catch (error) {
      console.error(`❌ Error creando ${machine.name}:`, error.message);
      reject(error);
    }
  });
}

// Función principal mejorada
async function createAllFiles() {
  console.log('🚀 Iniciando creación de archivos ZIP con tamaños exactos...\n');
  console.log('📋 Archivos a crear:');
  machines.forEach(m => console.log(`   - ${m.name}.zip: ${m.sizeMB} MB`));
  console.log('\n' + '━'.repeat(70) + '\n');
  
  const startTime = Date.now();
  const results = [];
  
  // Crear archivos secuencialmente
  for (const machine of machines) {
    try {
      const result = await createExactSizeFile(machine);
      results.push(result);
    } catch (error) {
      results.push({
        name: machine.name,
        targetSize: machine.sizeMB,
        error: error.message,
        success: false
      });
    }
  }
  
  // Mostrar resumen detallado
  console.log('\n' + '━'.repeat(70));
  console.log('📊 RESUMEN DE ARCHIVOS CREADOS:');
  console.log('━'.repeat(70));
  
  let totalSize = 0;
  let totalTargetSize = 0;
  
  // Verificar todos los archivos creados
  const files = [];
  for (const machine of machines) {
    const filePath = path.join(machinesDir, `${machine.name}.zip`);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const sizeMB = stats.size / 1024 / 1024;
      totalSize += sizeMB;
      totalTargetSize += machine.sizeMB;
      
      files.push({
        'Archivo': `${machine.name}.zip`,
        'Tamaño Objetivo': `${machine.sizeMB} MB`,
        'Tamaño Real': `${sizeMB.toFixed(1)} MB`,
        'Diferencia': `${(sizeMB - machine.sizeMB).toFixed(2)} MB`,
        'Estado': Math.abs(sizeMB - machine.sizeMB) < 0.1 ? '✅' : '⚠️'
      });
    }
  }
  
  console.table(files);
  
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n⏱️  Tiempo total: ${elapsed} segundos`);
  console.log(`💾 Tamaño total creado: ${totalSize.toFixed(1)} MB`);
  console.log(`📊 Tamaño total esperado: ${totalTargetSize.toFixed(1)} MB`);
  console.log(`📏 Diferencia total: ${Math.abs(totalSize - totalTargetSize).toFixed(2)} MB`);
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`\n✅ Exitosos: ${successful}/${machines.length}`);
  if (failed > 0) {
    console.log(`❌ Fallidos: ${failed}`);
  }
  
  console.log('\n🔄 IMPORTANTE - Próximos pasos:');
  console.log('   1. Detener el servidor actual (Ctrl+C)');
  console.log('   2. Ejecutar: node server.js');
  console.log('   3. Verificar en http://localhost:3000');
  console.log('   4. Los archivos deberían mostrar los tamaños correctos');
}

// Ejecutar el script
createAllFiles().catch(console.error);