import { Database } from "../../backend/database";
import {Class} from "../../backend/class"
import {User} from "../../backend/user"
import {cookies} from 'next/headers'
import {getIronSession} from 'iron-session'
import {defaultSession, sessionOptions} from "../lib"
import { undefined } from "../getClasses/route";

export async function GET(request){
    var db = await Database.getDatabase()
    const session = await getIronSession(await cookies(),sessionOptions)
    if(!session.isLoggedIn){
        return new Response("not logged in",{"status":400})
    }
    //var dummyClass = new Class(1,1,"This is a test class for testing","4/5",60*12,60*13,"https://ZOOMLINKHERE",100)
    var classes = await db.getClasses() 
    var toReturn = []
    for(var _class of classes){
        //check if you have access to the zoomLink
        var access = false
        //only let someone registered see the zoom link if we are close to a class starting
        if(_class.creatorID != session.id){
            //check if registered
            var user = await db.getUser(session.id)
            if(user.registeredClasses.indexOf(_class.classID) > -1){
                //user is registered
                access = true
            }
        }
        //remove the zoom link if you arent registered or hosting an event
        if(_class.creatorID == session.id || access){
            toReturn.push(_class)
        }
    }
    return new Response(JSON.stringify(toReturn),{
        status:200,
        headers: {'Content-Type':'application/json'}
    })
}

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
    var user = await db.getUser(session.id)
    var _class = await db.getClass(body.classID)
    if(user.credits >= _class.cost){
        user.addCredits(-_class.cost)
        user.registeredClasses.push(_class.classID)
        console.log(user)
        await db.saveUser(user)
        return new Response("registered",{"status":200})
    }else{
        return new Response("not enough credits",{"status":402})
    }
}

/*
body{
    classID
}
*/
//TODO: check how close we are to the class time
export async function DELETE(request){
    var body = await request.json()
    const session = await getIronSession(await cookies(),sessionOptions)
    //check if logged in
    if(!session.isLoggedIn){
        return new Response("not logged in",{"status":400})
    }
    //check if you have enough credits
    var db = await Database.getDatabase()
    var user = await db.getUser(session.id)
    var _class = await db.getClass(body.classID)

    user.addCredits(_class.cost)
    var index = user.registeredClasses.indexOf(_class.classID)
    if(index > -1){
        user.registeredClasses.splice(index,1)
    }
    await db.saveUser(user)
    return new Response("removed",{"status":200})

}