import './globals.css'

export const metadata = {
  title: 'CyberLab Platform',
  description: 'Plataforma de máquinas Docker para ciberseguridad',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}