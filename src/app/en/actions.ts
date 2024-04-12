'use server'

import { En } from "../lib/model"
import { enClient } from "../lib/en"

export async function listEns() {
    return enClient.listEns()
}

export async function addEn(en: En) {
    return enClient.addEn(en)
}
