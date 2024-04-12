'use server'

import { En } from "../lib/model"
import { enClient } from "../lib/en"

export async function listEns() {
    return enClient.listEns()
}

export async function getEn(id: string) {
    return enClient.getEn(id)
}

export async function addEn(en: En) {
    return enClient.addEn(en)
}

export async function udpateEn(en: En) {
    return enClient.updateEn(en)
}

export async function deleteEn(id: string) {
    return enClient.deleteEn(id)
}

export async function attachGoi(id: string, goiId: string) {
    await enClient.attachGoi(id, goiId)
}