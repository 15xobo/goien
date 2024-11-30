'use client'

import { deleteGoi, updateGoi } from './actions'

import Box from '@mui/material/Box';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import EditIcon from '@mui/icons-material/EditOutlined'
import { Goi as GoiData } from "../lib/model"
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField';
import Typography from "@mui/material/Typography"
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function GoiInfo(
    { goi, deletable, }: { goi: GoiData, deletable: boolean, }
) {
    const [editing, setEditing] = useState(false)
    const [newName, setNewName] = useState(goi.name)
    const router = useRouter()

    return (
        <Box>
            <Typography variant='h6' display="inline">{goi.name}</Typography>
            <IconButton
                color='primary'
                onClick={() => setEditing(true)}
            >
                <EditIcon />
            </IconButton>
            <IconButton
                disabled={!deletable}
                color='primary'
                onClick={async () => {
                    await deleteGoi(goi.id!)
                    router.push('/goi/')
                }}
            >
                <DeleteIcon />
            </IconButton>
            <Dialog open={editing} PaperProps={{
                component: 'form',
                sx: { width: 360 },
            }}>
                <DialogTitle>Edit</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        label="Title"
                        fullWidth
                        variant="standard"
                        focused
                        value={newName}
                        onChange={(event) => setNewName(event.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <IconButton
                        color='error'
                        size="large"
                        onClick={() => {
                            setEditing(false)
                            setNewName(goi.name)
                        }}>
                        <ClearIcon />
                    </IconButton>
                    <IconButton
                        color='success'
                        size="large"
                        disabled={goi.name.length === 0}
                        onClick={async () => {
                            await updateGoi({ ...goi, name: newName })
                            setEditing(false)
                            router.refresh()
                        }}
                    >
                        <CheckIcon />
                    </IconButton>
                </DialogActions>
            </Dialog>
        </Box >
    )
}
