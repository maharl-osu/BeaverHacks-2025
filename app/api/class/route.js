import {Class} from "../../backend/class"
import {Database} from "../../backend/database"
import {cookies} from 'next/headers'
import {getIronSession} from 'iron-session'
import {defaultSession, sessionOptions} from "../lib"
//getClass
//params: id - the id of the class to get
//example: http://localhost:3000/api/class?id=1
export async function GET(request){
    var params = request.nextUrl.searchParams
    var db = await Database.getDatabase()
    const session = await getIronSession(await cookies(),sessionOptions)
    //var dummyClass = new Class(1,1,"This is a test class for testing","4/5",60*12,60*13,"https://ZOOMLINKHERE",100)
    var _class = await db.getClass(params.get("id"))
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
    return new Response(JSON.stringify(_class),{
        status:200,
        headers: {'Content-Type':'application/json'}
    })
}


/*createClass
request body{

data:
    "name":
    "creatorID" : 
    "description" : 
    "startTime" : 
    "endTime": 
    "zoomLink": 
    "cost":
}

example usage: await fetch("http://localhost:3000/api/class",{method: "POST",body: JSON.stringify({"name":"test","creatorID":2,"description":"test desc", ,"startTime":new Date(...),"endTime":new Date(...),"zoomLink":"TEST LINK", "cost":100})}) */

export async function POST(request){
    const body = await request.json()

    //var dummyUser = new User(2,body.name)
    //dummyUser.addCredits(200)
    var db = await Database.getDatabase()
    await db.addClass(body)
    return new Response("Created class",{
        status:200,
        headers:{'Content-Type':'application/text'}
    })
}