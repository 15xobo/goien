import Link from 'next/link'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { listEntries } from '@/app/lib/goi'

export default function GoiList() {

    return (
        <List>
            {listEntries('テスト').map((goi) =>
                <ListItem>
                    <ListItemButton>
                        <ListItemText primary={goi.word} />
                    </ListItemButton>
                </ListItem>)}
            <ListItem>
                <ListItemButton>
                    <Link href="/goi/new" style={{ textDecoration: 'none' }}>
                        Add
                    </Link>
                </ListItemButton>
            </ListItem>
        </List>
    )
}