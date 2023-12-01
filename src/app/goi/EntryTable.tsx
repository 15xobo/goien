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
    { goiName, goiEntries, editDisabled, onEditActivated, onEditDeactivated }: {
        goiName: string,
        goiEntries: Array<GoiEntryData>,
        editDisabled: boolean,
        onEditActivated: () => void,
        onEditDeactivated: () => void,
    }
) {
    const unselectedIndex = -1
    const [selectedIndex, setSelectedIndex] = useState<number>(unselectedIndex)
    const router = useRouter()

    function reset() {
        setSelectedIndex(unselectedIndex)
        onEditDeactivated()
    }

    return goiEntries.map((entry, index) => {
        return (
            <TableRow key={index} hover>
                <TableCell padding="checkbox" sx={selectedIndex === index ? {} : { visibility: 'hidden' }}>
                    <IconButton
                        color='success'
                        onClick={() => {
                                deleteEntry(goiName, entry)
                                reset()
                                router.refresh()
                        }}
                    >
                        <CheckIcon />
                    </IconButton>
                </TableCell>
                <TableCell padding="checkbox" sx={true ? {} : { visibility: 'hidden' }}>
                    {selectedIndex === index ? (
                        <IconButton
                            color='error'
                            onClick={reset}
                        >
                            <ClearIcon />
                        </IconButton>
                    ) : (
                        <IconButton
                            disabled={editDisabled || (selectedIndex != unselectedIndex)}
                            color='info'
                            onClick={() => {
                                onEditActivated()
                                setSelectedIndex(index)
                            }}
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
    { goiName, editDisabled, onEditActivated, onEditDeactivated }: {
        goiName: string,
        editDisabled: boolean,
        onEditActivated: () => void,
        onEditDeactivated: () => void,
    }
) {
    const emptyEntry = {word: '', sentence: ''}
    const [entry, setEntry] = useState<GoiEntryData>(emptyEntry)
    const [editing, setEditing] = useState(false)
    const router = useRouter()

    function reset() {
        setEntry(emptyEntry)
        setEditing(false)
        onEditDeactivated()
    }

    return (
        <TableRow hover>
            <TableCell padding="checkbox" sx={editing ? {} : { visibility: 'hidden' }}>
                <IconButton
                    color='success'
                    onClick={() => {
                        addEntry(goiName, entry)
                        reset()
                        setEditing(false)
                        router.refresh()
                    }}
                >
                    <CheckIcon />
                </IconButton>
            </TableCell>
            <TableCell padding="checkbox">
                {editing ? (
                    <IconButton
                        color='error'
                        onClick={reset}
                    >
                        <ClearIcon />
                    </IconButton>
                ) : (
                    <IconButton
                        disabled={editDisabled}
                        color='info'
                        onClick={() => {
                            onEditActivated()
                            setEditing(true)
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                )}
            </TableCell>
            <TableCell sx={editing ? {} : { visibility: 'hidden' }}>
                <TextField
                    variant='standard'
                    size='small'
                    fullWidth
                    multiline
                    value={entry.word}
                    onChange={(event) => setEntry({ word: event.target.value, sentence: entry!.sentence })}
                />
            </TableCell>
            <TableCell sx={editing ? {} : { visibility: 'hidden' }}>
                <TextField
                    variant='standard'
                    size="small"
                    fullWidth
                    multiline
                    value={entry.sentence}
                    onChange={(event) => setEntry({ word: entry!.word, sentence: event.target.value })}
                />
            </TableCell>
        </TableRow>
    )
}

export default function EntryTable({ goiName, goiEntries }: { goiName: string, goiEntries: Array<GoiEntryData> }) {
    const noneEdit = 'none'
    const entriesEdit = 'entries'
    const newEntryEdit = 'new'
    const [activeEdit, setActiveEdit] = useState(noneEdit)

    return (
        <Paper >
            <TableContainer>
                <Table>
                    <TableBody
                        sx={{ cursor: 'pointer' }}
                    >
                        <EntryRows
                            goiName={goiName}
                            goiEntries={goiEntries}
                            editDisabled={!(activeEdit === noneEdit || activeEdit === entriesEdit)}
                            onEditActivated={() => setActiveEdit(entriesEdit)}
                            onEditDeactivated={() => setActiveEdit(noneEdit)}
                        />
                        <NewEntryRow
                            goiName={goiName}
                            editDisabled={!(activeEdit === noneEdit || activeEdit === newEntryEdit)}
                            onEditActivated={() => setActiveEdit(newEntryEdit)}
                            onEditDeactivated={() => setActiveEdit(noneEdit)}
                        />
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>

    )
}