export interface GoiEntry {
    sentence: string;
    word: string;
}

interface Goi {
    name: string;
    entries: Array<GoiEntry>
}

const gois: Array<Goi> = [
    {
        name: 'テスト',
        entries: [
            {
                sentence: 'これはデータです。',
                word: 'データ',
            },
            {
                sentence: 'これはユーザーインターフェイスです。',
                word: 'ユーザーインターフェイス',
            },
        ],
    },
    {
        name: 'テスト2',
        entries: [
            {
                word: 'サーバ',
                sentence: 'これはサーバです。',
            },
        ]
    }
]

export function listEntries(goiName: string): Array<GoiEntry> {
    const goi = gois.find(goi => goi.name === goiName);
    if (goi === undefined) {
        throw `goi ${goiName} is not found`
    }
    return goi!.entries;
}

export function addEntry(goiName: string, goiEntry: GoiEntry) {
    const goi = gois.find(goi => goi.name === goiName);
    if (goi === undefined) {
        throw `goi ${goiName} is not found`
    }
    goi!.entries.push(goiEntry);
}