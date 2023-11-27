export interface Goi {
    text: string
}

const data = {
    goi:
        [
            {
                text: 'データ',
            },
            {
                text: 'ユーザーインターフェイス',
            },
            {
                text: 'サーバ',
            }
        ],
}

export function getAllGoi() {
    return data.goi
}

export function createGoi(goi: Goi) {
    data.goi.push(goi)
}