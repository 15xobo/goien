import Link from 'next/link'
import { getAllGoi } from '@/app/lib/goi'

export default function GoiList() {

    return (
        <div>
            <ol>
                {getAllGoi().map((goi) => <li>{goi["text"]}</li>)}
            </ol>
            <Link href="/goi/new">
                <button>
                    Add
                </button>
            </Link>
        </div>
    )
}