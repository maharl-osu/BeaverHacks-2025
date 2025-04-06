import { Database } from "../../backend/database";
import {Class} from "../../backend/class"
import {User} from "../../backend/user"
import {cookies} from 'next/headers'
import {getIronSession} from 'iron-session'
import {defaultSession, sessionOptions} from "../lib"

/*
body{
    classID
}
*/
export async function POST(request){
    var body = await request.json()
    const session = await getIronSession(await cookies(),sessionOptions)
    //check if logged in
    if(!session.isLoggedIn){
        return new Response("not logged in",{"status":400})
    }
    //check if you have enough credits
    var db = await Database.getDatabase()
    var user = await db.getUser(session.userID)
    var _class = await db.getClass(body.classID)
    if(user.credits >= _class.cost){
        user.addCredits(-_class.cost)
        user.registeredClasses.push(_class.id)
        await db.saveUser(user)
        return new Response("registered",{"status":200})
    }else{
        return new Response("not enough credits",{"status":400})
    }
}