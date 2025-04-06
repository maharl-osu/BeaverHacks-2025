import {cookies} from 'next/headers'
import {getIronSession} from 'iron-session'
import {sessionOptions} from "../lib"
import {Database} from "../../backend/database"
import {genSalt,hash,compare} from "bcrypt"


export async function POST(request){
    var body = await request.json()
    const session = await getIronSession(await cookies(),sessionOptions)
    var database =await Database.getDatabase()
    var user = await database.addUser({"name":body.name,"username":body.username})
    
    var salt = await genSalt(10)
    database.setLoginDetails(user.username,user.userID,await hash(body.password,salt))

    session.isLoggedIn = true
    session.username = user.username
    session.id = user.userID
    await session.save()
    return new Response("logged in",{
        status:201,
        headers: {'Content-Type':'application/text'}
    })
}