'use client'

import { addEntry, deleteEntry } from './actions'

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip';
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
    const parts = []
    let lastWordEnd = 0
    for (let i = 0; i < goiEntry.words.length; ++i) {
        parts.push([lastWordEnd, goiEntry.words[i][0]])
        parts.push(goiEntry.words[i])
        lastWordEnd = goiEntry.words[i][1]
    }
    parts.push([lastWordEnd, sentence.length])

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
                {
                    parts.map(([wordStart, wordEnd], index) => index % 2 ?
                        <Typography key={index} display="inline" color={'error'} sx={{ border: 'thin solid' }}>
                            {sentence.substring(wordStart, wordEnd)}
                        </Typography> :
                        <Typography key={index} display="inline">
                            {sentence.substring(wordStart, wordEnd)}
                        </Typography>)
                }
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
    const words = entry?.words || []
    const sentence = entry?.sentence || ''

    function handleWordSelection(e: React.SyntheticEvent) {
        if (!entry) {
            return
        }
        const target = e.target as HTMLTextAreaElement
        const [wordStart, wordEnd] = [target.selectionStart, target.selectionEnd].toSorted()
        if (wordStart == wordEnd) {
            return
        }
        for (let [s, e] of words) {
            if (s < wordEnd && e > wordStart) {
                return
            }
        }
        words.push([wordStart, wordEnd])
        console.log(words.toSorted())
        setEntry({ ...entry!, words: words.toSorted((a, b) => a[0] - b[0]) })
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
                {
                    words.map(([wordStart, wordEnd], index) =>
                        <Chip
                            key={index}
                            label={sentence.substring(wordStart, wordEnd)}
                            onDelete={() => { setEntry({ ...entry!, words: words.filter((w, i) => i != index) }) }}
                        />
                    )
                }
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