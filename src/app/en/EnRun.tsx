import { GoiEntry as GoiEntryData } from "../lib/model";

export default function EnRun({ goiEntries }: { goiEntries: Array<GoiEntryData>, }) {
    return (
        <ol>
            {goiEntries.map((entry, index) =>
                <li key={index}>{entry.sentence}</li>
            )}
        </ol>
    )
}