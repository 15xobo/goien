import Link from 'next/link'

export default function GoiList() {
    const data =
        [
            {
                "text": "データ",
            },
            {
                "text": "ユーザーインターフェイス",
            },
            {
                "text": " サーバ",
            }
        ]


    return (
        <div>
            <ol>
                {data.map((goi) => <li>{goi["text"]}</li>)}
            </ol>
            <Link href="/goi/new">
            <button>
                Add
            </button>
            </Link>
        </div>
    )
}