'use server'

import { Goi, GoiEntry, GoiType } from "../lib/model";

import { MongoClient } from "mongodb";
import { randomUUID } from "crypto";

function getDatabase() {
    return new MongoClient(process.env.DB_CONNECTION_STRING!).db('goien');
}

export async function getGoi(id: string) {
    const database = getDatabase();
    const goi_doc = await database.collection("gois").findOne({ id: id });
    if (!goi_doc) {
        throw `goi ${id} is not found`
    };
    return { id: goi_doc.id, name: goi_doc.name, type: goi_doc.type || GoiType.Default };

}

export async function listGois() {
    const database = getDatabase();
    const goi_docs = await database.collection("gois").find({}).toArray();
    return goi_docs.map(doc => ({ id: doc.id, name: doc.name, type: doc.type || GoiType.Default }));
}


export async function addGoi(goi: Goi) {
    const database = getDatabase();
    const id = randomUUID();
    await database.collection("gois").insertOne({ ...goi, id: id });
    return database.collection("goi_entries").insertOne({ goi_id: id, entries: [] });
}

export async function updateGoi(goi: Goi) {
    const database = getDatabase();
    return database.collection("gois").updateOne({ id: goi.id }, { $set: { name: goi.name } });
}

export async function deleteGoi(id: string) {
    const database = getDatabase();
    return database.collection("gois").deleteOne({ id: id });
}

export async function listEntries(goiId: string) {
    const database = getDatabase();
    const article_doc = await database.collection("goi_entries").findOne({ goi_id: goiId });
    return article_doc?.entries;
}

export async function addEntry(goiId: string, entryIndex: number, goiEntry: GoiEntry) {
    const database = getDatabase();
    return database.collection("goi_entries").updateOne({ goi_id: goiId }, { $push: { entries: { $each: [goiEntry], $position: entryIndex } } });

}

export async function updateEntry(goiId: string, entryIndex: number, entry: GoiEntry) {
    const database = getDatabase();
    return database.collection("goi_entries").updateOne({ goi_id: goiId }, { $set: { [`entries.${entryIndex}`]: entry } });

}

export async function deleteEntry(goiId: string, entryIndex: number) {
    const database = getDatabase();
    await database.collection("goi_entries").updateOne({ goi_id: goiId }, { $unset: { [`entries.${entryIndex}`]: null } });
    return database.collection("goi_entries").updateOne({ goi_id: goiId }, { $pull: { entries: null } })
}