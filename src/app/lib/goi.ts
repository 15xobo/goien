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
            const id = randomUUID()
            await gois_collection.insertOne({ id: id, name: goi.name, type: goi.type })
            await goi_entires_collection.insertOne({goi_id: id, entries: []})
        },

        deleteGoi: async function (id: string): Promise<void> {
            await gois_collection.deleteOne({ id: id })
        },

        listEntries: async function (goiId: string): Promise<Array<GoiEntry>> {
            const article_doc = await goi_entires_collection.findOne({ goi_id: goiId })
            return article_doc?.entries
        },

        addEntry: async function (goiId: string, index: number, goiEntry: GoiEntry): Promise<void> {
            await goi_entires_collection.updateOne({goi_id: goiId}, {$push: {entries: {$each: [goiEntry], $position: index}}})
        },

        updateEntry: async function (goiId: string, entryIndex: number, entry: GoiEntry) {
            await goi_entires_collection.updateOne({ goi_id: goiId }, { $set: { [`entries.${entryIndex}`]: entry } })
        },

        deleteEntry: async function (goiId: string, entryIndex: number) {
            await goi_entires_collection.updateOne({ goi_id: goiId }, { $unset: { [`entries.${entryIndex}`]: null } })
            await goi_entires_collection.updateOne({ goi_id: goiId }, { $pull: { entries: null } })
        },
    }
}()

export { goiClient }
