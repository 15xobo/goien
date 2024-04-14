import  Divider from '@mui/material/Divider'
import EntryList from '@/app/goi/EntryList'
import GoiInfo from '@/app/goi/GoiInfo'
import Stack from '@mui/system/Stack'
import { goiClient } from '@/app/lib/goi'

export default async function GoiEntries({ params }: { params: { id: string } }) {
    const goiId = decodeURIComponent(params.id)
    const goiEntries = await goiClient.listEntries(goiId)
    const goi = await goiClient.getGoi(goiId)

    return (
        <Stack sx={{ width: '100%', mt: 2}}>
            <GoiInfo goi={goi} deletable={goiEntries.length === 0} />
            <Divider/>
            <EntryList goi={goi} goiEntries={goiEntries} />
        </Stack>
    )
}