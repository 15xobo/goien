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
            return goi_docs.map(doc => ({ id: doc.id, name: doc.name }))
        },

        addEn: async function (en: En): Promise<void> {
            const id = randomUUID()
            await ens_collection.insertOne({ ...en, id: id })
        },
    }
}()

export { enClient }
