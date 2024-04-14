'use client'

import AddIcon from '@mui/icons-material/AddCircle';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle';
import { En as EnData } from "../lib/model";
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import PlayIcon from '@mui/icons-material/PlayCircle';
import TextField from '@mui/material/TextField'
import { addEn } from "./actions";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function NewEnDialog({ open, onClose }: {
    open: boolean,
    onClose: () => void,
}) {
    const router = useRouter()
    const [en, setEn] = useState<EnData>({ id: 'placeholder', name: '', goiIds: [] })

    function reset() {
        setEn({ ...en, name: '' })
        onClose()
    }

    return (
        <Dialog open={open} PaperProps={{
            component: 'form',
            sx: { width: 360 }
        }}>
            <DialogTitle>
                New
            </DialogTitle>
            <DialogContent dividers>
                <TextField
                    autoFocus
                    required
                    label="Title"
                    fullWidth
                    variant="standard"
                    focused
                    value={en.name}
                    onChange={(event) => setEn({ ...en, name: event.target.value })}
                />

            </DialogContent>
            <DialogActions>
                <IconButton color='error' onClick={reset}>
                    <ClearIcon />
                </IconButton>
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
            </DialogActions>
        </Dialog >
    )
}

export default function EnList({ ens }: { ens: Array<EnData>, }) {
    const [newEnDialogOpen, setNewEnDialogOpen] = useState(false)

    return (
        <List dense sx={{ width: '100%', maxWidth: 400 }}>
            {ens.map(en => (
                <ListItem key={en.id} divider secondaryAction={
                    <IconButton color='primary' LinkComponent={Link} href={`/en/${en.id}/run`}>
                        <PlayIcon />
                    </IconButton>
                }>
                    <ListItemButton LinkComponent={Link} href={`/en/${en.id}`}>
                        {en.name}
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