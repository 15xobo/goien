import EnList from "./Enlist"
import { listEns } from "./actions"

export default async function EnsPage() {
    const ens = await listEns()

    return (
        <EnList ens={ens} />
    )
}