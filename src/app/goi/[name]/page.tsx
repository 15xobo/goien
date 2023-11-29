import Box from '@mui/system/Box'
import EntryTable from '@/app/goi/EntryTable'
import { goiClient } from '@/app/lib/goi'

export default async function GoiEntries({ params }: { params: { name: string } }) {
    const goiName = decodeURIComponent(params.name)
    const goiEntries = await goiClient.listEntries(goiName)

    return (
        <Box sx={{ width: '100%' }}>
            <EntryTable goiName={goiName} goiEntries={goiEntries} />
        </Box>
    )
}