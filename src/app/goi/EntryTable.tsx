'use client'

import { addEntry, deleteEntries } from './actions'
import { useRef, useState } from 'react'

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import ClearIcon from '@mui/icons-material/Clear';
import { GoiEntry as GoiEntryData } from '@/app/lib/goi'
import IconButton from '@mui/material/IconButton';
import Link from 'next/link'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation'

function EntryRows({ goiEntries, onRowSelected }: { goiEntries: Array<GoiEntryData>, onRowSelected: (index: number, selected: boolean) => void }) {
    return goiEntries.map((entry, index) => {
        return (
            <TableRow key={index} hover>
                <TableCell padding="checkbox">
                    <Checkbox onChange={(event) => onRowSelected(index, event.target.checked)} />
                </TableCell>
                <TableCell>{entry.word}</TableCell>
                <TableCell>{entry.sentence}</TableCell>
            </TableRow>
        );
    })
}

function NewEntryRow(
    { goiEntry, setEntry }: {
        goiEntry: GoiEntryData | undefined,
        setEntry: (entry: GoiEntryData | undefined) => void
    }
) {
    return (
        <TableRow hover>
            <TableCell padding="checkbox">
                {goiEntry ? (
                    <IconButton
                        onClick={() => setEntry(undefined)}
                    >
                        <ClearIcon />
                    </IconButton>
                ) : (

                    <IconButton
                        onClick={() => setEntry({ word: '', sentence: '' })}
                    >
                        <AddIcon />
                    </IconButton>
                )}
            </TableCell>
            <TableCell sx={goiEntry ? {} : { visibility: 'hidden' }}>
                <TextField
                    variant='standard'
                    size='small'
                    fullWidth
                    multiline
                    value={goiEntry && goiEntry.word}
                    onChange={(event) => setEntry({ word: event.target.value, sentence: goiEntry!.sentence })}
                />
            </TableCell>
            <TableCell sx={goiEntry ? {} : { visibility: 'hidden' }}>
                <TextField
                    variant='standard'
                    size="small"
                    fullWidth
                    multiline
                    value={goiEntry && goiEntry.sentence}
                    onChange={(event) => setEntry({ word: goiEntry!.word, sentence: event.target.value })}
                />
            </TableCell>
        </TableRow>
    )
}

export default function EntryTable({ goiName, goiEntries }: { goiName: string, goiEntries: Array<GoiEntryData> }) {
    const [selected, setSelected] = useState<Array<boolean>>(Array(goiEntries.length).fill(false))
    const [newGoiEntry, setNewGoiEntry] = useState<GoiEntryData>()
    const router = useRouter()

    return (
        <Paper >
            <Button disabled={newGoiEntry === undefined} onClick={() => {
                addEntry(goiName, newGoiEntry!)
                setNewGoiEntry(undefined)
                router.refresh()
            }}>
                Add
            </Button>
            <Button onClick={() => {
                deleteEntries(goiName, goiEntries.filter((entry, index) => selected[index]))
                router.refresh()
            }}>
                Delete
            </Button>
            <TableContainer>
                <Table>
                    <TableBody
                        sx={{ cursor: 'pointer' }}
                    >
                        <EntryRows goiEntries={goiEntries} onRowSelected={(rowIndex, rowSelected) => {
                            selected[rowIndex] = rowSelected
                            setSelected(Array.from(selected))
                        }} />
                        <NewEntryRow goiEntry={newGoiEntry} setEntry={setNewGoiEntry}></NewEntryRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>

    )
}