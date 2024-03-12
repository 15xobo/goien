'use server'

import { Goi, GoiEntry, goiClient } from "../lib/goi";

export async function addGoi(goi: Goi) {
    return goiClient.addGoi(goi)
}

export async function deleteGoi(name: string) {
    return goiClient.deleteGoi(name)
}

export async function addEntry(goiName: string, goiEntry: GoiEntry) {
    return goiClient.addEntry(goiName, goiEntry)
}

export async function deleteEntry(goiName: string, goiId: string) {
    return goiClient.deleteEntry(goiName, goiId)
}