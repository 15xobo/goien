import { MongoClient } from "mongodb";

export interface GoiEntry {
    sentence: string;
    word: string;
}

interface Goi {
    name: string;
    entries: Array<GoiEntry>
}

const goiClient = function () {
    const client = new MongoClient(process.env.DB_CONNECTION_STRING!);
    const database = client.db('goien')
    const gois_collection = database.collection("gois")
    const goi_entires_collection = database.collection("goi_entries")

    return {
        listEntries: async function (goiName: string): Promise<Array<GoiEntry>> {
            const goi_doc = await gois_collection.findOne({ name: goiName })
            if (!goi_doc) {
                throw `goi ${goiName} is not found`
            }
            const goi_entry_docs = await goi_entires_collection.find({ goi_name: goiName }).toArray()
            return goi_entry_docs.map(doc => { return { sentence: doc.sentence, word: doc.word } })
        },
        addEntry: async function (goiName: string, goiEntry: GoiEntry): Promise<void> {
            const goi_doc = await gois_collection.findOne({ name: goiName })
            if (!goi_doc) {
                throw `goi ${goiName} is not found`
            }
            await goi_entires_collection.insertOne({ goi_name: goiName, ...goiEntry })
        }
    }
}()

export { goiClient }
