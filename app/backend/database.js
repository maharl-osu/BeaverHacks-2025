const {getApps, initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const serviceAccount = require('../../hackathon-455921-8d8b3ed87f1a.json');

import {User} from "./user"
import {Class} from "./class"

export class Database{
    database = null
    db = null

    constructor(_db) {
        this.db = _db
    }

    static async getDatabase(){
        if(getApps().length == 0){
            console.log("setting up database")
            initializeApp({
                credential: cert(serviceAccount)
            });
        }
        if(Database.database == null){
            Database.database = new Database(getFirestore()) //getFirestore();
        }
        //console.log(Database.database.db)
        return Database.database
    } 

    async addUser(data){
        var database = await Database.getDatabase()
        if(Database.datebase == undefined){
            throw "Database has not been loaded yet"
        }
        var userID = await database.db.collection("users").doc("nextID").get()
        var nextID = userID.data()
        userID = nextID.next
        await database.db.collection("users").doc("nextID").set({"next":userID + 1})

        var user = new User(userID,data.username,data.name)
        const docRef = database.db.collection("users").doc(user.userID.toString())
        var toSave = {  
            "userID" : user.userID,
            "name" : user.name,
            "credits" : user.credits,
            "Rating" : user.Rating,
            "reviews" : user.reviews,
            "username":user.username
        }
        console.log(toSave)
        await docRef.set(toSave)
        
    }

    async getUser(userID){
        var database = await Database.getDatabase()
        if(Database.database == undefined){
            throw "Database has not been loaded yet"
        }
        const docRef = database.db.collection("users").doc(userID.toString())
        const match = await docRef.get()
        if(!match.exists){
            throw "user does not exist"
        }
        var data = match.data()
        return User.fromDB(data)
    }

    async getAllUsers(){
        var database = await Database.getDatabase()
        if(Database.database == undefined){
            throw "Database has not been loaded yet"
        }
        const doc = await database.db.collection("users").get()
        var toReturn = []
        doc.forEach(user => {
            if(user.data().next == undefined){
                toReturn.push(User.fromDB(user.data()))
            }
            
        })
        return toReturn
    }


/*
data:
"creatorID" : 
"description" : 
"date" : 
"startTime" : 
"endTime": 
"zoomLink": 
"cost":
*/

    async addClass(data){
        var database = await Database.getDatabase()
        if(Database.database == undefined){
            throw "Database has not been loaded yet"
        }

        const idRef = await database.db.collection("classes").doc("nextID").get()
        var nextID = idRef.data()
        var classID = nextID.next
        await database.db.collection("classes").doc("nextID").set({"next":classID + 1})

        const docRef = database.db.collection("classes").doc(classID.toString())
        data["classID"] = classID

        await docRef.set(data)
    }


    async getClass(classID){
        var database = await Database.getDatabase()
        if(Database.database == undefined){
            throw "Database has not been loaded yet"
        }

        const docRef = database.db.collection("classes").doc(classID.toString())
        const match = await docRef.get()
        if(!match.exists){
            throw "class does not exist"
        }
        var data = match.data()
        return Class.fromDB(data)
    }

    async getClasses(){
        var database = await Database.getDatabase()
        if(Database.database == undefined){
            throw "Database has not been loaded yet"
        }
        const doc = await database.db.collection("classes").get()
        var toReturn = []
        doc.forEach(_class => {
            if(_class.data().next == undefined){
                toReturn.push(Class.fromDB(_class.data()))
            }
        })
        return toReturn
    }

    async addEvent(){
        var database = await Database.getDatabase()
        if(Database.database == undefined){
            throw "Database has not been loaded yet"
        }
    }
}