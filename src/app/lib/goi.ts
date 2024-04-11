import { Goi, GoiEntry, GoiType } from "./model";
import { MongoClient, ObjectId } from "mongodb";

import { randomUUID } from "crypto";

const goiClient = function () {
    const client = new MongoClient(process.env.DB_CONNECTION_STRING!);
    const database = client.db('goien')
    const gois_collection = database.collection("gois")
    const goi_entires_collection = database.collection("goi_entries")

    return {
        listGois: async function (): Promise<Array<Goi>> {
            const goi_docs = await gois_collection.find({}).toArray()
            return goi_docs.map(doc => ({ id: doc.id, name: doc.name, type: doc.type || GoiType.Default }))
        },

        getGoi: async function (id: string): Promise<Goi> {
            const goi_doc = await gois_collection.findOne({ id: id })
            if (!goi_doc) {
                throw `goi ${id} is not found`
            }
            return { id: goi_doc.id, name: goi_doc.name, type: goi_doc.type || GoiType.Default }
        },

        addGoi: async function (goi: Goi): Promise<void> {
            await gois_collection.insertOne({ id: randomUUID(), name: goi.name, type: goi.type })
        },

        deleteGoi: async function (id: string): Promise<void> {
            await gois_collection.deleteOne({ id: id })
        },

        listEntries: async function (goiId: string): Promise<Array<GoiEntry>> {
            const goi_entry_docs = await goi_entires_collection.find({ goi_id: goiId }).toArray()
            return goi_entry_docs.map(doc => { return { id: doc._id.toString(), sentence: doc.sentence, words: doc.words || [[doc.wordStart, doc.wordEnd]] } })
        },

        addEntry: async function (goiId: string, goiEntry: GoiEntry): Promise<void> {
            const goi_doc = await gois_collection.findOne({ id: goiId })
            if (!goi_doc) {
                throw `goi ${goiId} is not found`
            }
            await goi_entires_collection.insertOne({ goi_id: goiId, ...goiEntry })
        },

        deleteEntry: async function (goiEntryId: string) {
            goi_entires_collection.deleteOne({ _id: new ObjectId(goiEntryId) })
        },
    }
}()

export { goiClient }
