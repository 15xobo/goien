import { getGoi, listEntries } from '../actions'

import  Divider from '@mui/material/Divider'
import EntryList from '@/app/goi/EntryList'
import GoiInfo from '@/app/goi/GoiInfo'
import Stack from '@mui/system/Stack'

export default async function GoiEntries({ params }: { params: { id: string } }) {
    const { id } = await params;
    const goiId = decodeURIComponent(id)
    const goiEntries = await listEntries(goiId)
    const goi = await getGoi(goiId)

    return (
        <Stack sx={{ width: '100%', mt: 2}}>
            <GoiInfo goi={goi} deletable={goiEntries.length === 0} />
            <Divider/>
            <EntryList goi={goi} goiEntries={goiEntries} />
        </Stack>
    )
}