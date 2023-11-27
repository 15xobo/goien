import Link from 'next/link'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { getAllGoi } from '@/app/lib/goi'

export default function GoiList() {

    return (
        <List>
            {getAllGoi().map((goi) =>
                <ListItem>
                    <ListItemButton>
                        <ListItemText primary={goi["text"]} />
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