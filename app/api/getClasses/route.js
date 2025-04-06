import {Class} from "../../backend/class"

import {Database} from "../../backend/database"
import {cookies} from 'next/headers'
import {getIronSession} from 'iron-session'
import {defaultSession, sessionOptions} from "../lib"

export async function GET(request){
    var db = await Database.getDatabase()
    const session = await getIronSession(await cookies(),sessionOptions)
    //var dummyClass = new Class(1,1,"This is a test class for testing","4/5",60*12,60*13,"https://ZOOMLINKHERE",100)
    var classes = await db.getClasses() 
    for(var _class of classes){
        //check if you have access to the zoomLink
        var access = false
        //only let someone registered see the zoom link if we are close to a class starting
        if(_class.creatorID != session.id && _class.startTime.getTime() - new Date().getTime() < 30 * 60000){
            //check if registered
            var user = await db.getUser(session.id)
            if(user.registeredClasses.indexOf(_class.classID) > -1){
                //user is registered
                access = true
            }
        }
        //remove the zoom link if you arent registered or hosting an event
        if(!(_class.creatorID == session.id || access)){
            _class.zoomLink = undefined
        }
    }
    return new Response(JSON.stringify(classes),{
        status:200,
        headers: {'Content-Type':'application/json'}
    })
}