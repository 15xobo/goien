import EnInfo from "../EnInfo"
import Stack from '@mui/system/Stack'
import { getEn } from "../actions"

export default async function EnEntries({ params }: { params: { id: string } }) {
    const enId = decodeURIComponent(params.id)
    const en = await getEn(enId)

    return (
        <Stack sx={{ width: '100%', mt: 2 }}>
            <EnInfo en={en} deletable={en.goiIds.length == 0} />
        </Stack>
    )
}