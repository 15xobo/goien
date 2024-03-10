import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Container from '@mui/material/Container'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'goien',
  description: 'A vocabulary builder.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppBar position="sticky">
          <Container maxWidth="md">
            <Toolbar>
              <Button><Link href="/goi/テスト">Wordbook</Link></Button>
              <Button><Link href="/en/テスト">Card</Link></Button>
            </Toolbar>
          </Container>
        </AppBar>
        <Container maxWidth='md' sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {children}
        </Container>
      </body>
    </html>
  )
}
