import EnRun from "../../EnRun"
import { GoiEntry as GoiEntryData } from "@/app/lib/model"
import { getEn } from "../../actions"
import { listEntries } from "@/app/goi/actions"

const RUN_SIZE = 20

function selectEntries(inputEntries: Array<GoiEntryData>): Array<GoiEntryData> {
    const entries = inputEntries.filter(entry => entry.words.length > 0)
    const count = Math.min(RUN_SIZE, entries.length)
    for (let i = 0; i < count; ++i) {
        const selectedIndex = Math.floor(Math.random() * (entries.length - i)) + i
        const selectedEntry = entries[selectedIndex]
        entries[selectedIndex] = entries[i]
        entries[i] = selectedEntry
    }
    return entries.slice(0, count)
}

export default async function EnRunPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const enId = decodeURIComponent(id)
    const en = await getEn(enId)
    const goiEntries = await Promise.all(en.goiIds.map(id => listEntries(id)))
        .then(entries => selectEntries(entries.flat()))

    return (
        <EnRun goiEntries={goiEntries} />
    )
}