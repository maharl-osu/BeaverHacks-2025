import {User} from "../../backend/user.js"
import {Database} from "../../backend/database.js"
import {cookies} from 'next/headers'
import {getIronSession} from 'iron-session'
import {defaultSession, sessionOptions} from "../lib"

//get user
//params - id of user to get
//example: http://localhost:3000/api/user?id=2
export async function GET(request){
    //var dummyUser = new User(1,"TEST USER")
    //dummyUser.addCredits(200)
    var db = await Database.getDatabase()
    var params = request.nextUrl.searchParams

    if(params.get("id") != undefined){
        var review = await db.getReview(params.get('id'))
        return new Response(JSON.stringify(review.data()),{
            status:200,
            headers: {'Content-Type':'application/json'}
        })
     
    }
}


/*
    starRating
    text
    target
*/
export async function POST(request){
    const session = await getIronSession(await cookies(),sessionOptions)
    var body = await request.json()
    if(session.isLoggedIn){
        body["creatorID"] = session.id
        var db = await Database.getDatabase()
        await db.addReview(body,body["target"])
        return new Response("review added",{
            status:200,
            headers: {'Content-Type':'application/text'}
        })
    }
   
}