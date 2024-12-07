import './globals.css'
import { Inter } from "next/font/google"
import { cn } from "@/app/lib/utils"
import { theme } from './styles/theme'
import { initDb } from './lib/db'
import { ThemeProvider } from "@/app/components/theme-provider"
import { ThemeToggle } from "@/app/components/theme-toggle"

export const metadata = {
  title: 'Sistema de Gestión de Pedidos',
  description: 'Aplicación para gestionar pedidos de Agentes, Staff y Contractors',
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

initDb()  // Inicializa la base de datos

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
        style={{
          '--primary': theme.colors.primary,
          '--secondary': theme.colors.secondary,
          '--accent': theme.colors.accent,
          '--background': theme.colors.background,
          '--text': theme.colors.text,
          '--font-body': theme.fonts.body,
          '--font-heading': theme.fonts.heading,
        } as React.CSSProperties}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative min-h-screen">
            <header className="absolute top-0 right-0 m-4">
              <ThemeToggle />
            </header>
            <main className="pt-16">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}