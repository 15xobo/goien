'use client'

import AddIcon from '@mui/icons-material/AddCircle';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { En as EnData } from "../lib/model";
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import TextField from '@mui/material/TextField'
import { addEn } from "./actions";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function NewEnDialog({ open, onClose }: {
    open: boolean,
    onClose: () => void,
}) {
    const router = useRouter()
    const [en, setEn] = useState<EnData>({id: 'placeholder', name: '', goiIds: []})

    function reset() {
        setEn({...en, name: ''})
        onClose()
    }

    return (
        <Dialog open={open} PaperProps={{
            component: 'form',
        }}>
            <DialogContent>
                <TextField
                    autoFocus
                    required
                    fullWidth
                    variant="standard"
                    value={en.name}
                    onChange={(event) => setEn({ ...en, name: event.target.value })}
                />
                <IconButton
                    color='success'
                    disabled={en.name.length === 0}
                    onClick={() => {
                        addEn(en!)
                        reset()
                        router.refresh()
                    }}
                >
                    <CheckIcon />
                </IconButton>
                <IconButton color='error' onClick={reset}>
                    <ClearIcon />
                </IconButton>
            </DialogContent>
        </Dialog >
    )
}

export default function EnList({ ens }: { ens: Array<EnData>, }) {
    const [newEnDialogOpen, setNewEnDialogOpen] = useState(false)

    return (
        <List>
            {ens.map(en => (
                <ListItem key={en.id}>
                    <ListItemButton>
                        <Link href={`/en/${en.id}`}>{en.name}</Link>
                    </ListItemButton>
                </ListItem>
            ))}
            <ListItem>
                <ListItemButton onClick={() => setNewEnDialogOpen(true)}>
                    <AddIcon />
                </ListItemButton>
            </ListItem>
            <NewEnDialog open={newEnDialogOpen} onClose={() => setNewEnDialogOpen(false)} />
        </List>
    )
}