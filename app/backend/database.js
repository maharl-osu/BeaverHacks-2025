const {getApps, initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const {onTaskDispatched} = require("firebase-functions/v2/tasks");
const {onRequest, HttpsError} = require("firebase-functions/v2/https");
const {getFunctions} = require("firebase-admin/functions");
const {logger} = require("firebase-functions/v2");
const {GoogleAuth} = require("google-auth-library");


const serviceAccount = require('../../hackathon-455921-8d8b3ed87f1a.json');

import {User} from "./user"
import {Class} from "./class"

export class Database{
    database = null
    db = null
    auth = null

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

    async saveUser(user){
        var database = await Database.getDatabase()
        if(Database.database == undefined){
            throw "Database has not been loaded yet"
        }
        const docRef = database.db.collection("users").doc(user.userID.toString())
        var toSave = {  
            "userID" : user.userID,
            "name" : user.name,
            "credits" : user.credits,
            "Rating" : user.Rating,
            "reviews" : user.reviews,
            "username":user.username,
            "registeredClasses":user.registeredClasses
        }
        await docRef.set(toSave)
    }

    async addUser(data){
        var database = await Database.getDatabase()
        if(Database.database == undefined){
            throw "Database has not been loaded yet"
        }
        var userID = await database.db.collection("users").doc("nextID").get()
        var nextID = userID.data()
        userID = nextID.next
        await database.db.collection("users").doc("nextID").set({"next":userID + 1})
        
        var user = new User(userID,data.username,data.name)
        await this.saveUser(user)
        return user
    }

    async addCredits(userID,ammount){
        var user = await this.getUser(userID)
        user.addCredits(ammount)
        this.saveUser(user)
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
        if(data.registeredClasses == undefined){
            data.registeredClasses = []
        }
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

    async getFunctionUrl(name, location="us-central1") {
        if (!Database.auth) {
          Database.auth = new GoogleAuth({
            scopes: "https://www.googleapis.com/auth/cloud-platform",
          });
        }
        const projectId = await Database.auth.getProjectId();
        const url = "https://cloudfunctions.googleapis.com/v2beta/" +
          `projects/${projectId}/locations/${location}/functions/${name}`;
      
        const client = await Database.auth.getClient();
        const res = await client.request({url});
        const uri = res.data?.serviceConfig?.uri;
        if (!uri) {
          throw new Error(`Unable to retreive uri for function at ${url}`);
        }
        return uri;
      }

    async scheduleDelete(_class){
        
        const queue = getFunctions().taskQueue("deleteClass");
        const targetUri = await this.getFunctionUrl("deleteClass");
        const scheduleDelaySeconds = 0
        await queue.enqueue({"id":_class.classID},{
            scheduleDelaySeconds,
            dispatchDeadlineSeconds:60*5,
            uri:targetUri
        })
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
        console.log(data)
        const idRef = await database.db.collection("classes").doc("nextID").get()
        var nextID = idRef.data()
        var classID = nextID.next
        await database.db.collection("classes").doc("nextID").set({"next":classID + 1})

        const docRef = database.db.collection("classes").doc(classID.toString())
        data["classID"] = classID
        await docRef.set(data)
        await this.scheduleDelete(data)
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

    async deleteClass(classID){
        var database = await Database.getDatabase()
        if(Database.database == undefined){
            throw "Database has not been loaded yet"
        }
        const res = await database.db.collection('classes').doc(classID.toString()).delete();
    }

    async addEvent(){
        var database = await Database.getDatabase()
        if(Database.database == undefined){
            throw "Database has not been loaded yet"
        }
    }

    async getLoginDetails(userName){
        var database = await Database.getDatabase()
        if(Database.database == undefined){
            throw "Database has not been loaded yet"
        }
        const ref = await database.db.collection("hashes").doc(userName).get()
        if(ref.exists){
            return ref.data()
        }
        return null
    }

    async setLoginDetails(username,id,hash){
        var database = await Database.getDatabase()
        if(Database.database == undefined){
            throw "Database has not been loaded yet"
        }
        const ref = database.db.collection("hashes").doc(username)
        console.log({"hash":hash,"id":id})
        await ref.set({"hash":hash,"id":id})
    }
}