'use client'

import { Goi as GoiData, GoiEntry as GoiEntryData, GoiType } from "../lib/model";
import { addEntry, deleteArticleEntry, deleteEntry } from './actions'

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function EntryRows({ goiEntries, onDeleteEntry }: {
    goiEntries: Array<GoiEntryData>,
    onDeleteEntry: (entryIndex: number) => void
}
) {
    const [entryIndex, setEntryIndex] = useState<number>(-1)
    const router = useRouter()

    function handleDeleteEntry() {
        onDeleteEntry(entryIndex)
        setEntryIndex(-1)
        router.refresh()
    }

    return <>
        <Dialog
            open={entryIndex >= 0}
        >
            <DialogTitle>Delete sentence</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {entryIndex >= 0 ? goiEntries[entryIndex].sentence : null}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setEntryIndex(-1)}>Cancel</Button>
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
                            setEntryIndex(index)
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
        <ListItem>
            <ListItemIcon onClick={onDelete}>
                <IconButton >
                    <DeleteIcon />
                </IconButton>
            </ListItemIcon>
            <ListItemText >
                {
                    parts.map(([wordStart, wordEnd], index) => index % 2 ?
                        <Typography key={index} display="inline" color={'error'} sx={{ border: 'thin solid' }}>
                            {sentence.substring(wordStart, wordEnd)}
                        </Typography> :
                        <Typography key={index} display="inline">
                            {sentence.substring(wordStart, wordEnd)}
                        </Typography>)
                }
            </ListItemText>
        </ListItem>
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

export default function EntryTable({ goi, goiEntries }: { goi: GoiData, goiEntries: Array<GoiEntryData> }) {
    const [newEntryDialogOpen, setNewEntryDialogOpen] = useState(false)
    const router = useRouter()

    return (
        <Paper >
            <List>
                <EntryRows
                    goiEntries={goiEntries}
                    onDeleteEntry={entryIndex => {
                        if (goi.type == GoiType.Article) {
                            deleteArticleEntry(goi.id!, entryIndex)
                        } else {
                            deleteEntry(goiEntries[entryIndex].id!)
                        }
                    }}
                />
                <ListItem>
                    <ListItemIcon>
                        <IconButton onClick={() => setNewEntryDialogOpen(true)}>
                            <AddIcon />
                        </IconButton>
                    </ListItemIcon>
                </ListItem>
            </List>
            <NewEntryDialog
                open={newEntryDialogOpen}
                onCancel={() => setNewEntryDialogOpen(false)}
                onConfirm={(entry) => {
                    addEntry(goi.id!, entry)
                    setNewEntryDialogOpen(false)
                    router.refresh()
                }}
            />
        </Paper>

    )
}