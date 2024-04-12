'use client'

import { deleteEn, udpateEn } from './actions'

import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import EditIcon from '@mui/icons-material/Edit';
import { En as EnData } from "../lib/model"
import IconButton from '@mui/material/IconButton'
import Paper from "@mui/material/Paper"
import { TextField } from '@mui/material';
import Typography from "@mui/material/Typography"
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function EnInfo(
    { en, deletable, }: { en: EnData, deletable: boolean, }
) {
    const [editing, setEditing] = useState(false)
    const [newName, setNewName] = useState(en.name)
    const router = useRouter()

    return (
        <Paper>
            <Typography variant='h2' display="inline">{en.name}</Typography>
            <IconButton
                color='primary'
                onClick={() => setEditing(true)}
            >
                <EditIcon />
            </IconButton>
            <IconButton
                disabled={!deletable}
                color='primary'
                onClick={() => {
                    deleteEn(en.id!)
                    router.push('/en/')
                }}
            >
                <DeleteIcon />
            </IconButton>
            <Dialog open={editing} >
                <DialogTitle>
                    Change name
                </DialogTitle>
                <DialogContent>
                    <TextField
                        value={newName}
                        onChange={(event) => setNewName(event.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            udpateEn({ ...en, name: newName })
                            setEditing(false)
                            router.refresh()
                        }}
                        color="primary"
                    >
                        Confirm
                    </Button>
                    <Button
                        onClick={() => {
                            setEditing(false)
                            setNewName(en.name)
                        }}
                        color="primary"
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper >
    )
}