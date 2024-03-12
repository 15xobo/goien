import { MongoClient, ObjectId } from "mongodb";

import { randomUUID } from "crypto";

export interface GoiEntry {
    id?: string;
    sentence: string;
    wordStart: number;
    wordEnd: number;
}

export interface Goi {
    id?: string;
    name: string;
}

const goiClient = function () {
    const client = new MongoClient(process.env.DB_CONNECTION_STRING!);
    const database = client.db('goien')
    const gois_collection = database.collection("gois")
    const goi_entires_collection = database.collection("goi_entries")

    return {
        listGois: async function (): Promise<Array<Goi>> {
            const goi_docs = await gois_collection.find({}).toArray()
            return goi_docs.map(doc => ({ id: doc.id, name: doc.name }))
        },

        getGoi: async function (name: string): Promise<Goi> {
            const goi_doc = await gois_collection.findOne({ name: name })
            if (!goi_doc) {
                throw `goi ${name} is not found`
            }
            return { id: goi_doc.id, name: goi_doc.name }
        },

        addGoi: async function (goi: Goi): Promise<void> {
            await gois_collection.insertOne({ id: randomUUID(), name: goi.name })
        },

        deleteGoi: async function (id: string): Promise<void> {
            await gois_collection.deleteOne({ id: id })
        },

        listEntries: async function (goiName: string): Promise<Array<GoiEntry>> {
            const goi_doc = await gois_collection.findOne({ name: goiName })
            if (!goi_doc) {
                throw `goi ${goiName} is not found`
            }
            const goi_entry_docs = await goi_entires_collection.find({ goi_name: goiName }).toArray()
            return goi_entry_docs.map(doc => { return { id: doc._id.toString(), sentence: doc.sentence, wordStart: doc.wordStart, wordEnd: doc.wordEnd } })
        },

        addEntry: async function (goiName: string, goiEntry: GoiEntry): Promise<void> {
            const goi_doc = await gois_collection.findOne({ name: goiName })
            if (!goi_doc) {
                throw `goi ${goiName} is not found`
            }
            await goi_entires_collection.insertOne({ goi_name: goiName, ...goiEntry })
        },

        deleteEntry: async function (goiName: string, goiId: string) {
            goi_entires_collection.deleteOne({ goi_name: goiName, _id: new ObjectId(goiId) })
        },
    }
}()

export { goiClient }
