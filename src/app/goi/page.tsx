import GoiList from './GoiList';
import { goiClient } from '@/app/lib/goi'

export default async function Gois() {
    const gois = await goiClient.listGois()

    return (
        <GoiList gois={gois} />
    )
}