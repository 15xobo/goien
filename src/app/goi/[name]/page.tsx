import Link from 'next/link'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { listEntries } from '@/app/lib/goi'

export default function GoiEntries({ params }: { params: { name: string } }) {
    const goiName = decodeURIComponent(params.name)

    return (
        <List>
            {listEntries(goiName).map((goiEntry, index) =>
                <ListItem key={index}>
                    <ListItemButton>
                        <ListItemText primary={goiEntry.word} />
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