'use server'

import { Goi, GoiEntry } from "../lib/model";

import { goiClient } from "../lib/goi";

export async function addGoi(goi: Goi) {
    return goiClient.addGoi(goi)
}

export async function deleteGoi(id: string) {
    return goiClient.deleteGoi(id)
}

export async function addEntry(goiId: string, goiEntry: GoiEntry) {
    return goiClient.addEntry(goiId, goiEntry)
}

export async function deleteEntry(goiEntryId: string) {
    return goiClient.deleteEntry(goiEntryId)
}

export async function deleteArticleEntry(goiId: string, entryIndex: number) {
    return goiClient.deleteArticleEntry(goiId, entryIndex)
}