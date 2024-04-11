'use client'

import { Goi as GoiData, GoiType } from "../lib/model";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import FormControl from "@mui/material/FormControl/FormControl";
import IconButton from '@mui/material/IconButton';
import InputLabel from "@mui/material/InputLabel";
import Link from 'next/link';
import MenuItem from "@mui/material/MenuItem";
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
    const initGoi = () => { return { name: '', type: GoiType.Default }; }
    const [goi, setGoi] = useState<GoiData>(initGoi())

    function reset() {
        setGoi(initGoi())
        onClose()
    }

    function handleSelect(event: SelectChangeEvent) {
        setGoi({ ...goi, type: event.target.value as GoiType })
    }

    return (
        <Dialog open={open} PaperProps={{
            component: 'form',
        }}>
            <DialogContent>
                <TextField
                    autoFocus
                    required
                    label="Goi Name"
                    fullWidth
                    variant="standard"
                    value={goi.name}
                    onChange={(event) => setGoi({ ...goi, name: event.target.value })}
                    sx={{ mb: 3 }}
                />
                <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={goi.type}
                        label='Type'
                        onChange={handleSelect}
                    >
                        <MenuItem value={GoiType.Default}>Default</MenuItem>
                        <MenuItem value={GoiType.Article}>Article</MenuItem>
                    </Select>
                </FormControl>
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