'use client'

import { addEntry, deleteEntry } from './actions'

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button'
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { GoiEntry as GoiEntryData } from "../lib/model";
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function EntryRows({ goiEntries }: {
    goiEntries: Array<GoiEntryData>,
}
) {
    const [entryToDelete, setEntryToDelete] = useState<GoiEntryData | null>(null)
    const router = useRouter()

    function handleDeleteEntry() {
        deleteEntry(entryToDelete!.id!)
        setEntryToDelete(null)
        router.refresh()
    }

    return <>
        <Dialog
            open={entryToDelete != null}
        >
            <DialogTitle>Delete sentence</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {entryToDelete?.sentence}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setEntryToDelete(null)}>Cancel</Button>
                <Button onClick={handleDeleteEntry}>Confirm</Button>
            </DialogActions>
        </Dialog>
        {
            goiEntries.map((entry, index) => {
                return (
                    <EntryRow
                        key={index}
                        goiEntry={entry}
                        onDelete={() => {
                            setEntryToDelete(entry)
                        }}
                    />
                )
            })
        }</>
}

function EntryRow({ goiEntry, onDelete }: {
    goiEntry: GoiEntryData,
    onDelete: () => void,
}) {
    const sentence = goiEntry.sentence
    const [wordStart, wordEnd] = goiEntry.words[0]
    const firstPart = sentence.substring(0, wordStart)
    const wordPart = sentence.substring(wordStart, wordEnd)
    const lastPart = sentence.substring(wordEnd)

    return (
        <TableRow hover>
            <TableCell padding="checkbox">
            </TableCell>
            <TableCell padding="checkbox">
                <IconButton
                    onClick={onDelete}
                >
                    <DeleteIcon />
                </IconButton>
            </TableCell>
            <TableCell >
                <Typography display="inline">
                    {firstPart}
                </Typography>
                <Typography display="inline" color='error' sx={{ textDecoration: 'underline' }}>
                    {wordPart}
                </Typography>
                <Typography display="inline">
                    {lastPart}
                </Typography>
            </TableCell>
        </TableRow>
    )
}

function NewEntryRow(
    { goiId, editDisabled, onEditActivated, onEditDeactivated }: {
        goiId: string,
        editDisabled: boolean,
        onEditActivated: () => void,
        onEditDeactivated: () => void,
    }
) {
    const emptyEntry = { sentence: '', words: [] }
    const [entry, setEntry] = useState<GoiEntryData>(emptyEntry)
    const [editing, setEditing] = useState(false)
    const router = useRouter()

    function reset() {
        setEntry(emptyEntry)
        setEditing(false)
        onEditDeactivated()
    }

    function handleWordSelection(e: React.SyntheticEvent) {
        const target = e.target as HTMLTextAreaElement
        setEntry({ ...entry, words: [[target.selectionStart, target.selectionEnd]] })
    }

    return (
        <TableRow hover>
            <TableCell padding="checkbox" sx={editing ? {} : { visibility: 'hidden' }}>
                <IconButton
                    color='success'
                    onClick={() => {
                        addEntry(goiId, entry)
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
            <TableCell sx={editing ? {} : { visibility: 'hidden' }} onMouseUp={handleWordSelection}>
                <TextField
                    variant='standard'
                    size="small"
                    fullWidth
                    multiline
                    value={entry.sentence}
                    onChange={(event) => setEntry({ ...entry, sentence: event.target.value })}
                />
            </TableCell>
        </TableRow>
    )
}

export default function EntryTable({ goiId, goiEntries }: { goiId: string, goiEntries: Array<GoiEntryData> }) {
    const noneEdit = 'none'
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
                            goiEntries={goiEntries}
                        />
                        <NewEntryRow
                            goiId={goiId}
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