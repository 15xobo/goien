'use client'

import { addEntry, deleteEntry } from './actions'

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button'
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
    const [wordStart, wordEnd] = goiEntry.words.length > 0 ? goiEntry.words[0] : [0, 0]
    const firstPart = sentence.substring(0, wordStart)
    const wordPart = sentence.substring(wordStart, wordEnd)
    const lastPart = sentence.substring(wordEnd)

    return (
        <TableRow hover>
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

function NewEntryDialog(
    { open, onCancel, onConfirm }: {
        open: boolean,
        onCancel: () => void,
        onConfirm: (entry: GoiEntryData) => void,
    }
) {
    const [entry, setEntry] = useState<GoiEntryData | null>(null)

    function handleWordSelection(e: React.SyntheticEvent) {
        const target = e.target as HTMLTextAreaElement
        setEntry({ ...entry!, words: [[target.selectionStart, target.selectionEnd]] })
    }

    return (
        <Dialog open={open} >
            <DialogTitle>
                Add sentence
            </DialogTitle>
            <DialogContent>
                <TextField
                    variant='standard'
                    fullWidth
                    multiline
                    value={entry?.sentence}
                    onMouseUp={handleWordSelection}
                    onChange={(event) => setEntry({ sentence: event.target.value, words: [] })}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>
                    Cancel
                </Button>
                <Button
                    disabled={entry == null}
                    onClick={() => {
                        onConfirm(entry!)
                        setEntry(null)
                    }}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default function EntryTable({ goiId, goiEntries }: { goiId: string, goiEntries: Array<GoiEntryData> }) {
    const [newEntryDialogOpen, setNewEntryDialogOpen] = useState(false)
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
                        />
                    </TableBody>
                </Table>
            </TableContainer>
            <NewEntryDialog
                open={newEntryDialogOpen}
                onCancel={() => setNewEntryDialogOpen(false)}
                onConfirm={(entry) => {
                    addEntry(goiId, entry)
                    setNewEntryDialogOpen(false)
                    router.refresh()
                }}
            />
            <IconButton onClick={() => setNewEntryDialogOpen(true)}>
                <AddIcon />
            </IconButton>
        </Paper>

    )
}