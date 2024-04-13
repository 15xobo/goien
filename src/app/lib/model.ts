
export interface Goi {
    id: string;
    name: string;
    type: GoiType;
}

export enum GoiType {
    Default = 'DEFAULT',
    Article = 'ARTICLE'
}

export interface GoiEntry {
    sentence: string;
    words: Array<[number, number]>;
}

export interface EnEntry {
    id?: string;
    goiEntry: GoiEntry;
}

export interface En {
    id: string;
    name: string;
    goiIds: Array<string> 
}

export interface EnRunEntry {
    sentence: string,
    wordStart: number,
    wordEnd: number,
}
