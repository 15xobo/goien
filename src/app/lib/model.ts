
export interface Goi {
    id?: string;
    name: string;
    type: GoiType;
}

export enum GoiType {
    Default = 'DEFAULT',
    Article = 'ARTICLE'
}

export interface GoiEntry {
    id?: string;
    sentence: string;
    words: Array<[number, number]>;
}

export interface EnEntry {
    id?: string;
    goiEntry: GoiEntry;
}

