'use client'

import { Goi as GoiData, GoiType } from "../lib/model"

import Button from '@mui/material/Button'
import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { deleteGoi } from './actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function GoiInfo(
    { goi, deletable, }: { goi: GoiData, deletable: boolean, }
) {
    const [newGoiDialogOpen, setNewGoiDialogOpen] = useState(false)
    const router = useRouter()

    return (
        <Paper>
            <Typography variant='h2'>{goi.name}</Typography>
            {
                goi.type != GoiType.Default && (
                    <Chip label={goi.type} />
                )
            }
            <Button
                variant='contained' color='error' disabled={!deletable}
                onClick={() => {
                    deleteGoi(goi.id!)
                    router.push('/goi/')
                }}
            >
                Delete
            </Button>
        </Paper >
    )
}