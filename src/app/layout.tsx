import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import type { Metadata } from 'next'
import Toolbar from '@mui/material/Toolbar'

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
        <AppBar position="fixed">
          <Container maxWidth="md">
            <Toolbar>
              <Button><Link href="/goi/">Wordbook</Link></Button>
              <Button><Link href="/en/テスト">Card</Link></Button>
            </Toolbar>
          </Container>
        </AppBar>
        <Container maxWidth='md' sx={{ marginTop: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {children}
        </Container>
      </body>
    </html>
  )
}
