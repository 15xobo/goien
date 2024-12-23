'use client'

import { Goi as GoiData, GoiEntry as GoiEntryData } from "../lib/model";
import { addEntry, deleteEntry, updateEntry } from './actions'

import AddIcon from '@mui/icons-material/AddCircle';
import Button from '@mui/material/Button'
import ButtonGroup from "@mui/material/ButtonGroup";
import CheckIcon from '@mui/icons-material/Check';
import Chip from '@mui/material/Chip';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import EditIcon from '@mui/icons-material/EditOutlined';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Reorder } from "framer-motion"
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function EntryItem({ goiEntry, onDelete, onEdit, order }: {
    goiEntry: GoiEntryData,
    onDelete: () => void,
    onEdit: () => void,
    order: number,
}) {
    const sentence = goiEntry.sentence
    const parts: Array<[number, number]> = []
    let lastWordEnd = 0
    for (let i = 0; i < goiEntry.words.length; ++i) {
        parts.push([lastWordEnd, goiEntry.words[i][0]])
        parts.push(goiEntry.words[i])
        lastWordEnd = goiEntry.words[i][1]
    }
    parts.push([lastWordEnd, sentence.length])

    return (
        <ListItem
            disableGutters
            component={Reorder.Item}
            value={order}
            dragListener={false}
            secondaryAction={
                <ButtonGroup>
                    <IconButton color="primary" onClick={onDelete}>
                        <DeleteIcon />
                    </IconButton>
                </ButtonGroup>
            }
        >
            <ListItemIcon>
                <IconButton color="primary" onClick={onEdit}>
                    <EditIcon />
                </IconButton>
            </ListItemIcon>
            <ListItemText primary={
                parts.map(([wordStart, wordEnd], index) => index % 2 ?
                    <Typography key={index} display="inline" color={'error'} sx={{ border: 'thin solid' }}>
                        {sentence.substring(wordStart, wordEnd)}
                    </Typography> :
                    <Typography key={index} display="inline">
                        {sentence.substring(wordStart, wordEnd)}
                    </Typography>)
            } />
        </ListItem>
    )
}

function NewEntryItem({ onAdd, order }: {
    onAdd: () => void,
    order: number,
}) {
    return (
        <ListItem
            disableGutters
            component={Reorder.Item}
            value={order}
        >
            <ListItemIcon>
                <IconButton color="primary" onClick={onAdd}>
                    <AddIcon />
                </IconButton>
            </ListItemIcon>
        </ ListItem>
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
        <Dialog open={open} PaperProps={{
            component: 'form',
            sx: { width: 360 },
        }}>
            <DialogTitle>
                {oldEntry ? 'Edit' : 'new'}
            </DialogTitle>
            <DialogContent>
                <TextField
                    variant='standard'
                    required
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
                <IconButton color='error' size="large" onClick={onCancel}>
                    <ClearIcon />
                </IconButton>
                <IconButton color='success' size="large" onClick={onConfirm}>
                    <CheckIcon />
                </IconButton>
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
        <Dialog open={open} PaperProps={{
            sx: { width: 360 },
        }}>
            <DialogTitle>Delete</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ wordBreak: 'break-all' }}>
                    {entry?.sentence}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <IconButton color='error' size="large" onClick={onCancel}>
                    <ClearIcon />
                </IconButton>
                <IconButton color='success' size="large" onClick={onConfirm}>
                    <CheckIcon />
                </IconButton>
            </DialogActions>
        </Dialog>
    )
}

export default function EntryList({ goi, goiEntries }: { goi: GoiData, goiEntries: Array<GoiEntryData> }) {
    const [editing, setEditing] = useState(false)
    const [modifyPosition, setModifyPosition] = useState<number>(-1)
    const [insertPosition, setInsertPosition] = useState(goiEntries.length)
    const [entry, setEntry] = useState<GoiEntryData | null>(null)
    const router = useRouter()

    const reorderedIndexes = Array.from(Array(goiEntries.length).keys())
    reorderedIndexes.splice(insertPosition, 0, goiEntries.length)

    return (
        <List
            component={Reorder.Group}
            axis="y"
            values={reorderedIndexes}
            onReorder={(indexes) => {
                setInsertPosition(indexes.indexOf(goiEntries.length))
            }}
            sx={{ wordBreak: 'break-all' }}
        >
            {reorderedIndexes.map((index) => (
                index == goiEntries.length ? (
                    <NewEntryItem
                        key={index}
                        onAdd={() => setEditing(true)}
                        order={index}
                    />
                ) : (
                    <EntryItem
                        key={index}
                        goiEntry={goiEntries[index]}
                        onDelete={() => setModifyPosition(index)}
                        onEdit={() => {
                            setEditing(true)
                            setModifyPosition(index)
                            setEntry(structuredClone(goiEntries[index]))
                        }}
                        order={index}
                    />
                )
            ))}
            <DeleteEntryDialog
                open={!editing && modifyPosition >= 0}
                entry={modifyPosition >= 0 ? goiEntries[modifyPosition] : null}
                onCancel={() => setModifyPosition(-1)}
                onConfirm={async () => {
                    await deleteEntry(goi.id!, modifyPosition)
                    setModifyPosition(-1)
                    router.refresh()
                }}
            />
            <EditEntryDialog
                open={editing}
                entry={entry}
                oldEntry={modifyPosition >= 0 ? goiEntries[modifyPosition] : null}
                onChangeEntry={setEntry}
                onCancel={() => {
                    setEntry(null)
                    setEditing(false)
                    setModifyPosition(-1)
                }}
                onConfirm={async () => {
                    if (modifyPosition >= 0) {
                        await updateEntry(goi.id!, modifyPosition, entry!)
                    } else {
                        await addEntry(goi.id!, insertPosition, entry!)
                    }
                    setEntry(null)
                    setEditing(false)
                    setModifyPosition(-1)
                    setInsertPosition(insertPosition + 1)
                    router.refresh()
                }}
            />
        </List>
    )
}