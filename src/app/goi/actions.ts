'use server'

import { Goi, GoiEntry } from "../lib/model";

import { goiClient } from "../lib/goi";

export async function getGoi(id: string) {
    return goiClient.getGoi(id)
}

export async function listGois() {
    return goiClient.listGois()
}


export async function addGoi(goi: Goi) {
    return goiClient.addGoi(goi)
}

export async function updateGoi(goi: Goi) {
    return goiClient.updateGoi(goi)
}

export async function deleteGoi(id: string) {
    return goiClient.deleteGoi(id)
}

export async function addEntry(goiId: string, entryIndex: number, goiEntry: GoiEntry) {
    return goiClient.addEntry(goiId, entryIndex, goiEntry)
}

export async function updateEntry(goiId: string, entryIndex: number, entry: GoiEntry) {
    return goiClient.updateEntry(goiId, entryIndex, entry)
}

export async function deleteEntry(goiId: string, entryIndex: number) {
    return goiClient.deleteEntry(goiId, entryIndex)
}