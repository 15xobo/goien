'use client'

import { Goi as GoiData, goiClient } from '@/app/lib/goi'

import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import { addGoi } from './actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react'

function NewGoiDialog({ open, onClose }: {
    open: boolean,
    onClose: () => void,
}) {
    const router = useRouter()
    const [goi, setGoi] = useState<GoiData>({ name: '' })

    function reset() {
        setGoi({name: ''})
        onClose()
    }

    return (
        <Dialog open={open}>
            <DialogContent>
                <TextField
                    autoFocus
                    required
                    label="Goi Name"
                    fullWidth
                    variant="standard"
                    value={goi.name}
                    onChange={(event) => setGoi({ name: event.target.value })}
                />
                <IconButton
                    color='success'
                    disabled={goi.name.length === 0}
                    onClick={() => {
                        addGoi(goi!)
                        reset()
                        router.refresh()
                    }}
                >
                    <CheckIcon />
                </IconButton>
                <IconButton color='error' onClick={reset}>
                    <ClearIcon />
                </IconButton>
            </DialogContent>
        </Dialog >
    )
}

export default function GoiTable({ gois }: { gois: Array<GoiData>, }) {
    const [newGoiDialogOpen, setNewGoiDialogOpen] = useState(false)

    return (
        <Paper>
            <TableContainer>
                <Table>
                    <TableBody
                        sx={{ cursor: 'pointer' }}
                    >
                        {gois.map(goi => {
                            return (
                                <TableRow key={goi.id}>
                                    <TableCell>
                                        <Link href={`/goi/${goi.id}`}>{goi.name}</Link>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <IconButton onClick={() => setNewGoiDialogOpen(true)}>
                <AddIcon />
            </IconButton>
            <NewGoiDialog open={newGoiDialogOpen} onClose={() => setNewGoiDialogOpen(false)} />
        </Paper>
    )
}