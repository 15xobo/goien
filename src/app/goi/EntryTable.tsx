'use client'

import { Goi as GoiData, GoiEntry as GoiEntryData } from "../lib/model";
import { addEntry, deleteEntry, updateEntry } from './actions'

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper'
import { Reorder } from "framer-motion"
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function EntryRow({ goiEntry, onDelete, onEdit, index }: {
    goiEntry: GoiEntryData,
    onDelete: () => void,
    onEdit: () => void,
    index: number,
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
        <ListItem component={Reorder.Item} value={index} dragListener={false}>
            <ListItemIcon onClick={onDelete}>
                <IconButton >
                    <DeleteIcon />
                </IconButton>
            </ListItemIcon>
            <ListItemIcon onClick={onEdit}>
                <IconButton >
                    <EditIcon />
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

function EditEntryDialog(
    { entry, oldEntry, open, onChangeEntry, onCancel, onConfirm }: {
        entry: GoiEntryData | null,
        oldEntry: GoiEntryData | null,
        open: boolean,
        onChangeEntry: (entry: GoiEntryData) => void,
        onCancel: () => void,
        onConfirm: () => void,
    }
) {
    const words = entry?.words || []
    const sentence = entry?.sentence || ''

    function handleWordSelection(e: React.SyntheticEvent) {
        if (!entry) {
            return
        }
        const target = e.target as HTMLTextAreaElement
        const [wordStart, wordEnd] = [target.selectionStart, target.selectionEnd].toSorted((a, b) => a - b)
        if (wordStart == wordEnd) {
            return
        }
        for (let [s, e] of words) {
            if (s < wordEnd && e > wordStart) {
                return
            }
        }
        words.push([wordStart, wordEnd])
        onChangeEntry({ ...entry!, words: words.toSorted((a, b) => a[0] - b[0]) })
    }

    return (
        <Dialog open={open} >
            <DialogTitle>
                {oldEntry ? `Edit sentence "${oldEntry.sentence}"` : 'Add sentence'}
            </DialogTitle>
            <DialogContent>
                <TextField
                    variant='standard'
                    fullWidth
                    multiline
                    value={entry?.sentence}
                    onMouseUp={handleWordSelection}
                    onChange={(event) => onChangeEntry({ sentence: event.target.value, words: [] })}
                />
                {
                    words.map(([wordStart, wordEnd], index) =>
                        <Chip
                            key={index}
                            label={sentence.substring(wordStart, wordEnd)}
                            onDelete={() => { onChangeEntry({ ...entry!, words: words.filter((w, i) => i != index) }) }}
                        />
                    )
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>
                    Cancel
                </Button>
                <Button disabled={entry == null} onClick={onConfirm}>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
}

function DeleteEntryDialog(
    { entry, open, onCancel, onConfirm }: {
        entry: GoiEntryData | null,
        open: boolean,
        onCancel: () => void,
        onConfirm: () => void,
    }
) {
    return (
        <Dialog open={open}>
            <DialogTitle>{`Delete sentence "${entry?.sentence}"`}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={onConfirm}>Confirm</Button>
            </DialogActions>
        </Dialog>
    )
}

export default function EntryTable({ goi, goiEntries }: { goi: GoiData, goiEntries: Array<GoiEntryData> }) {
    const [editing, setEditing] = useState(false)
    const [entryIndex, setEntryIndex] = useState<number>(-1)
    const [newEntryPosition, setNewEntryPosition] = useState(goiEntries.length)
    const [entry, setEntry] = useState<GoiEntryData | null>(null)
    const router = useRouter()

    const reorderedIndexes = Array.from(Array(goiEntries.length).keys())
    reorderedIndexes.splice(newEntryPosition, 0, goiEntries.length)

    return (
        <Paper >
            <List>
                <Reorder.Group axis="y" values={reorderedIndexes} onReorder={(indexes) => {
                    setNewEntryPosition(indexes.indexOf(goiEntries.length))
                }}>
                    {reorderedIndexes.map((index) => (
                        index == goiEntries.length ? (
                            <ListItem key={index} component={Reorder.Item} value={index} >
                                <ListItemIcon>
                                    <IconButton onClick={() => setEditing(true)}>
                                        <AddIcon />
                                    </IconButton>
                                </ListItemIcon>
                            </ListItem>

                        ) : (
                            <EntryRow
                                key={index}
                                goiEntry={goiEntries[index]}
                                onDelete={() => setEntryIndex(index)}
                                onEdit={() => {
                                    setEditing(true)
                                    setEntryIndex(index)
                                    setEntry(structuredClone(goiEntries[index]))
                                }}
                                index={index}
                            />
                        )
                    ))}
                </Reorder.Group>

            </List>
            <DeleteEntryDialog
                open={!editing && entryIndex >= 0}
                entry={entryIndex >= 0 ? goiEntries[entryIndex] : null}
                onCancel={() => setEntryIndex(-1)}
                onConfirm={() => {
                    deleteEntry(goi.id!, entryIndex)
                    setEntryIndex(-1)
                    router.refresh()
                }}
            />
            <EditEntryDialog
                open={editing}
                entry={entry}
                oldEntry={entryIndex >= 0 ? goiEntries[entryIndex] : null}
                onChangeEntry={setEntry}
                onCancel={() => {
                    setEntry(null)
                    setEditing(false)
                    setEntryIndex(-1)
                }}
                onConfirm={() => {
                    if (entryIndex >= 0) {
                        updateEntry(goi.id!, entryIndex, entry!)
                    } else {
                        addEntry(goi.id!, newEntryPosition, entry!)
                    }
                    setEntry(null)
                    setEditing(false)
                    setEntryIndex(-1)
                    setNewEntryPosition(newEntryPosition + 1)
                    router.refresh()
                }}
            />
        </Paper>

    )
}