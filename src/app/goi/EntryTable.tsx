'use client'

import { addEntry, deleteEntry } from './actions'

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import ClearIcon from '@mui/icons-material/Clear';
import { GoiEntry as GoiEntryData } from '@/app/lib/goi'
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function EntryRows({ goiEntries, selectedRow, onRowSelected }: { goiEntries: Array<GoiEntryData>, selectedRow: number, onRowSelected: (index: number) => void }) {
    return goiEntries.map((entry, index) => {
        return (
            <TableRow key={index} hover>
                <TableCell padding="checkbox">
                    <Checkbox
                        checked={index === selectedRow}
                        onChange={(event) => {
                            if (event.target.checked) {
                                onRowSelected(index)
                            } else {
                                onRowSelected(-1)
                            }
                        }} />
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
    const [selectedEntryIndex, setSelectedEntryIndex] = useState<number>(-1)
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
            <Button disabled={selectedEntryIndex === -1} onClick={() => {
                deleteEntry(goiName, goiEntries[selectedEntryIndex])
                setSelectedEntryIndex(-1)
                router.refresh()
            }}>
                Delete
            </Button>
            <TableContainer>
                <Table>
                    <TableBody
                        sx={{ cursor: 'pointer' }}
                    >
                        <EntryRows
                            goiEntries={goiEntries}
                            selectedRow={selectedEntryIndex}
                            onRowSelected={setSelectedEntryIndex}
                        />
                        <NewEntryRow goiEntry={newGoiEntry} setEntry={setNewGoiEntry}></NewEntryRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>

    )
}