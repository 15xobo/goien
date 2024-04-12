'use client'

import { En as EnData, Goi as GoiData } from "../lib/model"
import { deleteEn, udpateEn } from './actions'
import { useEffect, useState } from 'react'

import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton'
import Link from "next/link"
import LinkIcon from '@mui/icons-material/Link';
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem';
import Paper from "@mui/material/Paper"
import TextField from '@mui/material/TextField'
import Typography from "@mui/material/Typography"
import { getGoi } from '../goi/actions';
import { useRouter } from 'next/navigation'

function EditEnDialog({ open, enName, onChange, onConfirm, onCancel }: {
    open: boolean,
    enName: string,
    onChange: (name: string) => void,
    onConfirm: () => void,
    onCancel: () => void,
}) {
    return (
        <Dialog open={open} >
            <DialogTitle>
                Change name
            </DialogTitle>
            <DialogContent>
                <TextField
                    value={enName}
                    onChange={(event) => onChange(event.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onConfirm} color="primary">
                    Confirm
                </Button>
                <Button onClick={onCancel} color="primary" >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default function EnInfo(
    { en, deletable, }: { en: EnData, deletable: boolean, }
) {
    const [editing, setEditing] = useState(false)
    const [newName, setNewName] = useState(en.name)
    const [gois, setGois] = useState<Array<GoiData>>(new Array(en.goiIds.length))
    const router = useRouter()

    useEffect(() => {
        en.goiIds.forEach((id, index) => {
            getGoi(id).then(goi => {
                setGois(gois => en.goiIds.map((id, i) => i == index ? goi : gois[i]))
            })
        })
    }, [en])

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
            <EditEnDialog
                open={editing}
                enName={newName}
                onChange={(name) => setNewName(name)}
                onConfirm={() => {
                    udpateEn({ ...en, name: newName })
                    setEditing(false)
                    router.refresh()
                }}
                onCancel={() => {
                    setEditing(false)
                    setNewName(en.name)
                }}
            />
            <List>
                {en.goiIds.map((goiId, index) => (
                    gois[index] &&
                    <ListItem key={goiId}>
                        {gois[index]?.name}
                        <Link href={`/goi/${goiId}`}>
                            <LinkIcon />
                        </Link>
                    </ListItem>
                ))}
            </List>
        </Paper >
    )
}