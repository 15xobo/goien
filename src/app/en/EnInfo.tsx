'use client'

import { En as EnData, Goi as GoiData } from "../lib/model"
import { attachGoi, deleteEn, detachGoi, udpateEn } from './actions'
import { getGoi, listGois } from '../goi/actions';
import { useEffect, useState } from 'react'

import AddIcon from '@mui/icons-material/AddCircle';
import Box from "@mui/material/Box";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from "@mui/material/Divider";
import EditIcon from '@mui/icons-material/EditOutlined';
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Link from "next/link"
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem';
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from '@mui/material/MenuItem'
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
        <Dialog open={open} PaperProps={{
            component: 'form',
            sx: { width: 360 },
        }}>
            <DialogTitle>
                Edit
            </DialogTitle>
            <DialogContent dividers>
                <TextField
                    required
                    label="Title"
                    fullWidth
                    variant="standard"
                    focused
                    value={enName}
                    onChange={(event) => onChange(event.target.value)}
                />
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
        <Dialog open={open} PaperProps={{
            component: 'form',
            sx: { width: 360 },
        }}>
            <DialogTitle>
                Add
            </DialogTitle>
            <DialogContent dividers>
                <FormControl required fullWidth variant='standard' focused>
                    <InputLabel>Material</InputLabel>
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
                    <FormHelperText></FormHelperText>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <IconButton
                    color='error'
                    size="large"
                    onClick={onCancel}>
                    <ClearIcon />
                </IconButton>
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
        <Box>
            <Typography variant='h6' display="inline">{en.name}</Typography>
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
                    await deleteEn(en.id!)
                    router.push('/en/')
                }}
            >
                <DeleteIcon />
            </IconButton>
            <EditEnDialog
                open={editing}
                enName={newName}
                onChange={(name) => setNewName(name)}
                onConfirm={async () => {
                    await udpateEn({ ...en, name: newName })
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
                onSelect={async (goiId) => {
                    await attachGoi(en.id, goiId)
                    setAddGoiDialogOpen(false)
                    setGoiIdToAdd('')
                    router.refresh()
                }}
                onCancel={() => {
                    setAddGoiDialogOpen(false)
                    setGoiIdToAdd('')
                }}
            />
            <Divider />
            <List>
                {en.goiIds.map((goiId, index) => (
                    gois[index] &&
                    <ListItem key={goiId}>
                        <ListItemIcon>
                            <IconButton color="primary" onClick={async () => {
                                await detachGoi(en.id, goiId)
                                router.refresh()
                            }}>
                                <DeleteIcon color='primary' />
                            </IconButton>
                        </ListItemIcon>
                        <ListItemText>
                            <Link href={`/goi/${goiId}`}>
                                {gois[index]?.name}
                            </Link>
                        </ListItemText>
                    </ListItem>
                ))}
                <ListItem>
                    <ListItemIcon >
                        <IconButton color="primary" onClick={() => setAddGoiDialogOpen(true)}>
                            <AddIcon />
                        </IconButton>
                    </ListItemIcon>
                </ListItem>
            </List>
        </Box >
    )
}