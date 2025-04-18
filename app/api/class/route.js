import {Class} from "../../backend/class"
import {Database} from "../../backend/database"
import {cookies} from 'next/headers'
import {getIronSession} from 'iron-session'
import {defaultSession, sessionOptions,registrationTotals} from "../lib"
//getClass
//params: id - the id of the class to get
//example: http://localhost:3000/api/class?id=1
export async function GET(request){
    var params = request.nextUrl.searchParams
    var db = await Database.getDatabase()
    const session = await getIronSession(await cookies(),sessionOptions)
    //var dummyClass = new Class(1,1,"This is a test class for testing","4/5",60*12,60*13,"https://ZOOMLINKHERE",100)
    var _class = await db.getClass(params.get("id"))
    var user = await db.getUser(session.id)
    var registeredClasses = user.registeredClasses
    //check if you have access to the zoomLink
    var access = false
    if(session.isLoggedIn){
        _class.registered = registeredClasses.indexOf(_class.classID) > -1 
    }
    var creator = await db.getUser(_class.creatorID)
    _class.creatorName = creator.name 
    _class.creatorRating = creator.Rating
    //only let someone registered see the zoom link if we are close to a class starting
    if(_class.creatorID != session.id && _class.startTime.getTime() - new Date().getTime() < 30 * 60000){
        //check if registered
        if(registeredClasses.indexOf(_class.classID) > -1){
            //user is registered
            access = true
        }
    }
    //remove the zoom link if you arent registered or hosting an event
    if(!(_class.creatorID == session.id || access)){
        _class.zoomLink = undefined
    }
    _class.cost = parseInt(_class.cost)
    return new Response(JSON.stringify(_class),{
        status:200,
        headers: {'Content-Type':'application/json'}
    })
}


/*createClass
request body{
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
    const session = await getIronSession(await cookies(),sessionOptions)
    if(!session.isLoggedIn){
        return new Response("not logged in",{
            status:400,
            headers:{'Content-Type':'application/text'}
        })
    }
    body.creatorID = session.id
    //TODO: verify this parsed properly
    body.cost = Number(body.cost)
    if(isNaN(body.cost)){
        return new Response("input error",{status:400})
    }
    //var dummyUser = new User(2,body.name)
    //dummyUser.addCredits(200)
    var db = await Database.getDatabase()
    await db.addClass(body)
    return new Response("Created class",{
        status:200,
        headers:{'Content-Type':'application/text'}
    })
}


/*
body{
    classID
}
*/
export async function DELETE(request){
    const body = await request.json()
    const session = await getIronSession(await cookies(),sessionOptions)
    if(!session.isLoggedIn){
        return new Response("not logged in",{
            status:400,
            headers:{'Content-Type':'application/text'}
        })
    }
    //check if this user created this class
    var db = await Database.getDatabase()
    var _class = await db.getClass(body.classID)

    if(session.id ==_class.creatorID && !(_class.startTime.getTime() - new Date().getTime() < 30 * 60000)){
        //check which users are registered for this class
        var users = await db.getAllUsers()
        users = users.filter((user) => user.registeredClasses.indexOf(_class.classID) > -1)
        //refund them and remove the class from their registered list
        for(var user of users){
            var index = user.registeredClasses.indexOf(_class.classID)
            user.registeredClasses.splice(index,1)
            user.addCredits(_class.cost)
            await db.saveUser(user)
        }
        await db.deleteClass(body.classID)
        return new Response("class deleted",{
            status:200,
            headers:{'Content-Type':'application/text'}
        })
    }else{
        return new Response("not authorized",{
            status:403,
            headers:{'Content-Type':'application/text'}
        })
    }
}