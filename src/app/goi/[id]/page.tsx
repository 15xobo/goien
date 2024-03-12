import Box from '@mui/system/Box'
import EntryTable from '@/app/goi/EntryTable'
import GoiInfo from '@/app/goi/GoiInfo'
import { goiClient } from '@/app/lib/goi'

export default async function GoiEntries({ params }: { params: { id: string } }) {
    const goiId = decodeURIComponent(params.id)
    const goiEntries = await goiClient.listEntries(goiId)
    const goi = await goiClient.getGoi(goiId)

    return (
        <Box sx={{ width: '100%' }}>
            <GoiInfo goi={goi} deletable={goiEntries.length === 0} />
            <EntryTable goiId={goiId} goiEntries={goiEntries} />
        </Box>
    )
}