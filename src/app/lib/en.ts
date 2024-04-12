import { En } from "./model";
import { MongoClient } from "mongodb";
import { randomUUID } from "crypto";

const enClient = function () {
    const client = new MongoClient(process.env.DB_CONNECTION_STRING!);
    const database = client.db('goien')
    const ens_collection = database.collection("ens")

    return {
        listEns: async function (): Promise<Array<En>> {
            const goi_docs = await ens_collection.find({}).toArray()
            return goi_docs.map(doc => ({ id: doc.id, name: doc.name, goiIds: doc.goi_ids }))
        },

        getEn: async function (id: string): Promise<En> {
            const en_doc = await ens_collection.findOne({ id: id })
            if (!en_doc) {
                throw `goi ${id} is not found`
            }
            return { id: en_doc.id, name: en_doc.name, goiIds: en_doc.goi_ids }
        },

        addEn: async function (en: En): Promise<void> {
            const id = randomUUID()
            await ens_collection.insertOne({ id: id, name: en.name, goi_ids: en.goiIds })
        },

        updateEn: async function (en: En): Promise<void> {
            await ens_collection.updateOne({ id: en.id }, { $set: { name: en.name } })
        },

        deleteEn: async function (id: string): Promise<void> {
            await ens_collection.deleteOne({ id: id })
        },

        attachGoi: async function (id: string, goiId: string) {
            await ens_collection.updateOne({ id: id }, { $addToSet: { 'goi_ids': goiId } })
        },

        detachGoi: async function (id: string, goiId: string) {
            await ens_collection.updateOne({ id: id }, { $pull: { 'goi_ids': goiId } })
        },
    }
}()

export { enClient }
