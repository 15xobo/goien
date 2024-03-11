import GoiTable from './GoiTable';
import { goiClient } from '@/app/lib/goi'

export default async function Gois() {
    const gois = await goiClient.listGois()

    return (
        <GoiTable gois={gois} />
    )
}