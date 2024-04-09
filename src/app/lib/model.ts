
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
    wordStart: number;
    wordEnd: number;
}

export interface EnEntry {
    id?: string;
    goiEntry: GoiEntry;
}

