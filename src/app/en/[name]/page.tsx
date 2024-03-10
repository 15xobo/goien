import FlashCard from "../FlashCard"

export default async function EnEntries({ params }: { params: { name: string } }) {
    const enName = decodeURIComponent(params.name)
    const enEntries = [
        { goiEntry: { sentence: '私はテストフラッシュカードです。', wordStart: 5, wordEnd: 13 } }
    ]

    return (
        <FlashCard enEntry={enEntries[0]} />
    )
}