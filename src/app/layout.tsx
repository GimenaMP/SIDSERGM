import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SIDSER — Sistema Inteligente de Diagnóstico y Seguimiento Educativo Rural',
  description: 'Plataforma educativa offline-first para escuelas multigrado de primaria en Guatemala, alineada al CNB y libros de texto oficiales del MINEDUC.',
  icons: {
    icon: '/assets/1.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Quicksand:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-amber-200 selection:text-amber-900">
        {/* Margen rojo de cuaderno escolar */}
        <div className="notebook-margin" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
