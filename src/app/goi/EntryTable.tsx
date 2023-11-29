'use client'

import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import { GoiEntry as GoiEntryData } from '@/app/lib/goi'
import Link from 'next/link'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import { useState } from 'react'

function EntryRows({ goiEntries, onRowSelected }: { goiEntries: Array<GoiEntryData>, onRowSelected: (index: number, selected: boolean) => void }) {
    return goiEntries.map((entry, index) => {
        return (
            <TableRow key={index} hover>
                <TableCell padding="checkbox">
                    <Checkbox onChange={(event) => onRowSelected(index, event.target.checked)} />
                </TableCell>
                <TableCell>{entry.word}</TableCell>
                <TableCell>{entry.sentence}</TableCell>
            </TableRow>
        );
    })
}

export default function EntryTable({ goiName, goiEntries }: { goiName: string, goiEntries: Array<GoiEntryData> }) {
    const [selected, setSelected] = useState<Array<boolean>>(Array(goiEntries.length).fill(false))

    return (
        <Paper >
            <Button>
                <Link href={`/goi/${goiName}/new`} style={{ textDecoration: 'none' }}>
                    Add
                </Link>
            </Button>
            <TableContainer>
                <Table>
                    <TableBody
                        sx={{ cursor: 'pointer' }}
                    >
                        <EntryRows goiEntries={goiEntries} onRowSelected={(rowIndex, rowSelected) => {
                            selected[rowIndex] = rowSelected
                            setSelected(Array.from(selected))
                            console.log(goiEntries.filter((entry, index) => selected[index]))
                        }} />
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>

    )
}