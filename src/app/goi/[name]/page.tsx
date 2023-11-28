import Link from 'next/link'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { goiClient } from '@/app/lib/goi'

export default async function GoiEntries({ params }: { params: { name: string } }) {
    const goiName = decodeURIComponent(params.name)
    const goiEntries = await goiClient.listEntries(goiName)

    return (
        <List>
            {goiEntries.map((goiEntry, index) =>
                <ListItem key={index}>
                    <ListItemButton>
                        <ListItemText primary={goiEntry.word} />
                    </ListItemButton>
                </ListItem>)}
            <ListItem>
                <ListItemButton>
                    <Link href={`/goi/${goiName}/new`} style={{ textDecoration: 'none' }}>
                        Add
                    </Link>
                </ListItemButton>
            </ListItem>
        </List>
    )
}