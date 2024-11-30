import GoiList from './GoiList';
import { listGois } from './actions'

export default async function Gois() {
    const gois = await listGois();

    return (
        <GoiList gois={gois} />
    )
}