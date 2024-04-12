'use client'

import { deleteGoi, updateGoi } from './actions'

import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import EditIcon from '@mui/icons-material/Edit';
import { Goi as GoiData } from "../lib/model"
import IconButton from '@mui/material/IconButton'
import Paper from "@mui/material/Paper"
import { TextField } from '@mui/material';
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
        <Paper>
            <Typography variant='h2' display="inline">{goi.name}</Typography>
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
                    deleteGoi(goi.id!)
                    router.push('/goi/')
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
                            updateGoi({ ...goi, name: newName })
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
                            setNewName(goi.name)
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