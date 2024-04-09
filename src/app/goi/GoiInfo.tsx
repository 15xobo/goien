'use client'

import Button from '@mui/material/Button'
import { Goi as GoiData } from "../lib/model"
import Paper from "@mui/material/Paper"
import { Typography } from "@mui/material"
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