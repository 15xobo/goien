import AppBar from '@mui/material/AppBar'
import { TbBook2 as BookIcon } from "react-icons/tb";
import Button from '@mui/material/Button'
import { TbCards as CardsIcon } from "react-icons/tb";
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton';
import { Inter } from 'next/font/google'
import Link from 'next/link'
import type { Metadata } from 'next'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

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
        <Container maxWidth='md' disableGutters>
          <AppBar position="static">
            <Toolbar>
              <Typography variant='h6' sx={{ flexGrow: 1 }}>goien</Typography>
              <IconButton color="inherit" LinkComponent={Link} href="/goi/">
                <BookIcon size={36} />
              </IconButton>
              <IconButton color="inherit" LinkComponent={Link} href="/en/">
                <CardsIcon size={36} />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Container sx={{ display: 'flex', justifyContent: 'center' }}>
            {children}
          </Container>
        </Container>
      </body>
    </html>
  )
}
