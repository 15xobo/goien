'use client'

import { En as EnData, Goi as GoiData } from "../lib/model"
import { attachGoi, deleteEn, detachGoi, udpateEn } from './actions'
import { getGoi, listGois } from '../goi/actions';
import { useEffect, useState } from 'react'

import AddIcon from '@mui/icons-material/AddCircle';
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
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from '@mui/material/MenuItem'
import Paper from "@mui/material/Paper"
import Select from "@mui/material/Select";
import TextField from '@mui/material/TextField'
import Typography from "@mui/material/Typography"
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

function AddGoiDialog({ open, selectedGoiId, onSelect, onCancel }: {
    open: boolean,
    selectedGoiId: string,
    onSelect: (name: string) => void,
    onCancel: () => void,
}) {
    const [gois, setGois] = useState<Array<GoiData>>([])

    useEffect(() => {
        if (open) {
            listGois().then(setGois)
        }
    }, [open])

    return (
        <Dialog open={open} >
            <DialogTitle>
                Add words to the collection
            </DialogTitle>
            <DialogContent>
                <Select
                    value={selectedGoiId}
                    onChange={(event) => onSelect(event.target.value)}
                >
                    {gois.map((goi) => (
                        <MenuItem key={goi.id} value={goi.id}>
                            {goi.name}
                        </MenuItem>
                    ))}
                </Select>
            </DialogContent>
            <DialogActions>
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
    const [addGoiDialogOpen, setAddGoiDialogOpen] = useState(false)
    const [goiIdToAdd, setGoiIdToAdd] = useState('')
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
            <AddGoiDialog
                open={addGoiDialogOpen}
                selectedGoiId={goiIdToAdd}
                onSelect={(goiId) => {
                    attachGoi(en.id, goiId)
                    setAddGoiDialogOpen(false)
                    setGoiIdToAdd('')
                    router.refresh()
                }}
                onCancel={() => {
                    setAddGoiDialogOpen(false)
                    setGoiIdToAdd('')
                }}
            />
            <List>
                {en.goiIds.map((goiId, index) => (
                    gois[index] &&
                    <ListItem key={goiId}>
                        <ListItemIcon
                            onClick={() => {
                                detachGoi(en.id, goiId)
                                router.refresh()
                            }}
                        >
                            <DeleteIcon color='primary' />
                        </ListItemIcon>
                        {gois[index]?.name}
                        <Link href={`/goi/${goiId}`}>
                            <LinkIcon />
                        </Link>
                    </ListItem>
                ))}
                <ListItem>
                    <ListItemIcon onClick={() => setAddGoiDialogOpen(true)}>
                        <AddIcon color='primary' />
                    </ListItemIcon>
                </ListItem>
            </List>
        </Paper >
    )
}