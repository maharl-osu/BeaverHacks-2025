const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const serviceAccount = require('./path/to/serviceAccountKey.json');


export class Database{
    db = undefined

    constructor() {}

    static async getDatabase(){
        if(Database.db == undefined){
            initializeApp({
                credential: cert(serviceAccount)
              });
              Database.db = getFirestore()
        }
        return new Database()
    } 

    async addUser(user){
        if(Database.db == undefined){
            throw "Database has not been loaded yet"
        }
        const docRef = Database.db.collection("users").doc(user.name + toString(user.userID))
        await docRef.set(user)
    }
}