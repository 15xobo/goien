import Link from 'next/link';
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import { goiClient } from '@/app/lib/goi'

export default async function GoiTable() {
    const gois = await goiClient.listGois()

    return (
        <Paper >
            <TableContainer>
                <Table>
                    <TableBody
                        sx={{ cursor: 'pointer' }}
                    >
                        {gois.map(goi => {
                            return (
                                <TableRow key={goi.name}>
                                    <TableCell>
                                        <Link href={`/goi/${goi.name}`}>{goi.name}</Link>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}