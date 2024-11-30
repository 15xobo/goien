'use server'

import { En } from "../lib/model"
import { MongoClient } from "mongodb";
import { randomUUID } from "crypto";

function getDatabase() {
    console.log("Connecting to Mongo: " + process.env.DB_CONNECTION_STRING);
    return new MongoClient(process.env.DB_CONNECTION_STRING!).db('goien');
}

export async function listEns() {
    const database = getDatabase();
    const goi_docs = await database.collection("ens").find({}).toArray();
    return goi_docs.map(doc => ({ id: doc.id, name: doc.name, goiIds: doc.goi_ids }));
}

export async function getEn(id: string): Promise<En> {
    const database = getDatabase();
    const en_doc = await database.collection("ens").findOne({ id: id })
    if (!en_doc) {
        throw `goi ${id} is not found`
    };
    return { id: en_doc.id, name: en_doc.name, goiIds: en_doc.goi_ids };
}

export async function addEn(en: En) {
    const database = getDatabase();
    const id = randomUUID();
    return database.collection("ens").insertOne({ id: id, name: en.name, goi_ids: en.goiIds });

}

export async function udpateEn(en: En) {
    const database = getDatabase();
    return database.collection("ens").updateOne({ id: en.id }, { $set: { name: en.name } });
}

export async function deleteEn(id: string) {
    const database = getDatabase();
    return database.collection("ens").deleteOne({ id: id });
}

export async function attachGoi(id: string, goiId: string) {
    const database = getDatabase();
    return database.collection("ens").updateOne({ id: id }, { $addToSet: { 'goi_ids': goiId } });
}

export async function detachGoi(id: string, goiId: string) {
    const database = getDatabase();
    return database.collection("ens").updateOne({ id: id }, { $pull: { 'goi_ids': goiId } });
}
