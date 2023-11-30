'use client'

import { addEntry, deleteEntry } from './actions'

import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { GoiEntry as GoiEntryData } from '@/app/lib/goi'
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper'
import RemoveIcon from '@mui/icons-material/Remove';
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function EntryRows(
    { goiEntries, selectedRow, onRowSelected, onConfirm }: {
        goiEntries: Array<GoiEntryData>,
        selectedRow: number,
        onRowSelected: (index: number) => void,
        onConfirm: (entry: GoiEntryData) => void,
    }
) {
    return goiEntries.map((entry, index) => {
        return (
            <TableRow key={index} hover>
                <TableCell padding="checkbox" sx={selectedRow === index ? {} : { visibility: 'hidden' }}>
                    <IconButton
                        color='success'
                        onClick={() => onConfirm(entry)}
                    >
                        <CheckIcon />
                    </IconButton>
                </TableCell>
                <TableCell padding="checkbox" sx={true ? {} : { visibility: 'hidden' }}>
                    {selectedRow === index ? (
                        <IconButton
                            color='error'
                            onClick={() => onRowSelected(-1)}
                        >
                            <ClearIcon />
                        </IconButton>
                    ) : (
                        <IconButton
                            disabled={selectedRow !== -1}
                            color='info'
                            onClick={() => onRowSelected(index)}
                        >
                            <RemoveIcon />
                        </IconButton>
                    )}
                </TableCell>
                <TableCell>{entry.word}</TableCell>
                <TableCell>{entry.sentence}</TableCell>
            </TableRow>
        );
    })
}

function NewEntryRow(
    { goiEntry, setEntry, onConfirm }: {
        goiEntry: GoiEntryData | undefined,
        setEntry: (entry: GoiEntryData | undefined) => void,
        onConfirm: (entry: GoiEntryData) => void,
    }
) {
    const editingActive = goiEntry !== undefined

    return (
        <TableRow hover>
            <TableCell padding="checkbox" sx={editingActive ? {} : { visibility: 'hidden' }}>
                <IconButton
                    color='success'
                    onClick={() => onConfirm(goiEntry!)}
                >
                    <CheckIcon />
                </IconButton>
            </TableCell>
            <TableCell padding="checkbox">
                {editingActive ? (
                    <IconButton
                        color='error'
                        onClick={() => setEntry(undefined)}
                    >
                        <ClearIcon />
                    </IconButton>
                ) : (
                    <IconButton
                        color='info'
                        onClick={() => setEntry({ word: '', sentence: '' })}
                    >
                        <AddIcon />
                    </IconButton>
                )}
            </TableCell>
            <TableCell sx={editingActive ? {} : { visibility: 'hidden' }}>
                <TextField
                    variant='standard'
                    size='small'
                    fullWidth
                    multiline
                    value={goiEntry?.word}
                    onChange={(event) => setEntry({ word: event.target.value, sentence: goiEntry!.sentence })}
                />
            </TableCell>
            <TableCell sx={editingActive ? {} : { visibility: 'hidden' }}>
                <TextField
                    variant='standard'
                    size="small"
                    fullWidth
                    multiline
                    value={goiEntry?.sentence}
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
            <TableContainer>
                <Table>
                    <TableBody
                        sx={{ cursor: 'pointer' }}
                    >
                        <EntryRows
                            goiEntries={goiEntries}
                            selectedRow={selectedEntryIndex}
                            onRowSelected={setSelectedEntryIndex}
                            onConfirm={(goiEntry) => {
                                deleteEntry(goiName, goiEntry)
                                setSelectedEntryIndex(-1)
                                router.refresh()
                            }}
                        />
                        <NewEntryRow
                            goiEntry={newGoiEntry}
                            setEntry={setNewGoiEntry}
                            onConfirm={(goiEntry) => {
                                addEntry(goiName, goiEntry)
                                setNewGoiEntry(undefined)
                                router.refresh()
                            }}
                        />
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>

    )
}