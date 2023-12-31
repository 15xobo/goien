'use server'

import { GoiEntry, goiClient } from "../lib/goi";

export async function addEntry(goiName: string, goiEntry: GoiEntry) {
    return goiClient.addEntry(goiName, goiEntry)
}

export async function deleteEntry(goiName: string, goiId: string) {
    return goiClient.deleteEntry(goiName, goiId)
}