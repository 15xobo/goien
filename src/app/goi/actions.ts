'use server'

import { Goi, GoiEntry } from "../lib/model";

import { goiClient } from "../lib/goi";

export async function addGoi(goi: Goi) {
    return goiClient.addGoi(goi)
}

export async function deleteGoi(id: string) {
    return goiClient.deleteGoi(id)
}

export async function addEntry(goiId: string, index: number, goiEntry: GoiEntry) {
    return goiClient.addEntry(goiId, index, goiEntry)
}

export async function deleteEntry(goiId: string, entryIndex: number) {
    return goiClient.deleteEntry(goiId, entryIndex)
}