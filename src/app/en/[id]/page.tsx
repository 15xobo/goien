import EnInfo from "../EnInfo"
import { getEn } from "../actions"

export default async function EnEntries({ params }: { params: { id: string } }) {
    const enId = decodeURIComponent(params.id)
    const en = await getEn(enId)

    return (
        <EnInfo en={en} deletable/>
    )
}