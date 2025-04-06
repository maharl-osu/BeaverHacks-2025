const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const serviceAccount = require('../../hackathon-455921-8d8b3ed87f1a.json');

import {User} from "./user"
import {Class} from "./class"

export class Database{
    db = null

    constructor() {}

    static async getDatabase(){
        if(Database.db == null){
            console.log("setting up database")
            initializeApp({
                credential: cert(serviceAccount)
            });
            Database.db = getFirestore();
        }
        return new Database()
    } 

    async addUser(data){
        if(Database.db == undefined){
            throw "Database has not been loaded yet"
        }
        var userID = await Database.db.collection("users").doc("nextID").get()
        var nextID = userID.data()
        userID = nextID.next
        await Database.db.collection("users").doc("nextID").set({"next":userID + 1})

        var user = new User(userID,data.username,data.name)
        const docRef = Database.db.collection("users").doc(user.userID.toString())
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
        if(Database.db == undefined){
            throw "Database has not been loaded yet"
        }
        const docRef = Database.db.collection("users").doc(userID.toString())
        const match = await docRef.get()
        if(!match.exists){
            throw "user does not exist"
        }
        var data = match.data()
        return User.fromDB(data)
    }

    async getAllUsers(){
        if(Database.db == undefined){
            throw "Database has not been loaded yet"
        }
        const doc = await Database.db.collection("users").get()
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
        if(Database.db == undefined){
            throw "Database has not been loaded yet"
        }

        const idRef = await Database.db.collection("classes").doc("nextID").get()
        var nextID = idRef.data()
        var classID = nextID.next
        await Database.db.collection("classes").doc("nextID").set({"next":classID + 1})

        const docRef = Database.db.collection("classes").doc(classID.toString())
        data["classID"] = classID

        await docRef.set(data)
    }


    async getClass(classID){
        if(Database.db == undefined){
            throw "Database has not been loaded yet"
        }

        const docRef = Database.db.collection("classes").doc(classID.toString())
        const match = await docRef.get()
        if(!match.exists){
            throw "class does not exist"
        }
        var data = match.data()
        return Class.fromDB(data)
    }

    async getClasses(){
        if(Database.db == undefined){
            throw "Database has not been loaded yet"
        }
        const doc = await Database.db.collection("classes").get()
        var toReturn = []
        doc.forEach(_class => {
            if(_class.data().next == undefined){
                toReturn.push(Class.fromDB(_class.data()))
            }
        })
        return toReturn
    }
}