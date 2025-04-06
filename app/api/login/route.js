import {cookies} from 'next/headers'
import {getIronSession} from 'iron-session'
import {defaultSession, sessionOptions} from "../lib"
import {Database} from "../../backend/database"
import {compare} from "bcrypt"

//get current session
export async function GET(request){
    const session = await getIronSession(await cookies(),sessionOptions)

    if(session.isLoggedIn !== true){
        return Response.json(defaultSession)
    }

    return Response.json(session)
}

//login
/*
body{
    username
    password
}
*/
export async function POST(request){
    const session = await getIronSession(await cookies(),sessionOptions)
    var body = await request.json()
    var database = await  Database.getDatabase()
    var dbData = await database.getLoginDetails(body.username)
    var result = await compare(body.password, dbData.hash)
    if(result){
        //setup session
        var user = await database.getUser(dbData.id)
        session.isLoggedIn = true
        session.username = body.username
        session.id = dbData.id
        session.name = user.name
        await session.save()
        return new Response("logged in",{
            status:200,
            headers: {'Content-Type':'application/text'}
        })
    }else{
        return new Response("not logged in",{
            status:400,
            headers: {'Content-Type':'application/text'}
        })
    }

    
}

//logout
export async function DELETE(request){
    const session = await getIronSession(await cookies(),sessionOptions)
    session.destroy()
    return new Response("logged out",{
        status:200,
        headers: {'Content-Type':'application/text'}
    })
}