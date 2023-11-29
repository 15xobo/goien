'use server'

import { GoiEntry, goiClient } from "../lib/goi";

export async function addEntry(goiName: string, goiEntry: GoiEntry) {
    return goiClient.addEntry(goiName, goiEntry)
}

export async function deleteEntries(goiName: string, goiEntries: Array<GoiEntry>) {
    return Promise.allSettled(goiEntries.map(entry => goiClient.deleteEntry(goiName, entry)))
}