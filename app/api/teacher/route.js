import { Database } from "../../backend/database";
import {Class} from "../../backend/class"
import {User} from "../../backend/user"
import {cookies} from 'next/headers'
import {getIronSession} from 'iron-session'
import {defaultSession, sessionOptions,registrationTotals} from "../lib"

export async function GET(request){
    var db = await Database.getDatabase()
    const session = await getIronSession(await cookies(),sessionOptions)
    if(!session.isLoggedIn){
        return new Response("not logged in",{"status":400})
    }
    var classes = await db.getClasses()
    var toReturn = []
    var registrationCounts = await registrationTotals(await db.getAllUsers())
    for(var _class of classes){
        _class.registerCount = registrationCounts[_class.classID]
        if(_class.registerCount == undefined){_class.registerCount = 0}
        if(_class.creatorID == session.id){
            toReturn.push(_class)
        }
    }
    return new Response(JSON.stringify(toReturn),{"status":200,headers: {'Content-Type':'application/json'}})
}