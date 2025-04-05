import {User} from "../../backend/user.js"
import {Database} from "../../backend/database.js"

//get user
export async function GET(request){
    var dummyUser = new User(1,"TEST USER")
    dummyUser.addCredits(200)
    return new Response(JSON.stringify(dummyUser),{
        status:200,
        headers: {'Content-Type':'application/json'}
    })
}

//create user

export async function POST(request){
    var dummyUser = new User(1,"TEST USER")
    var db = Database.getDatabase()
    await db.addUser(dummyUser)
    return new Response("Created user",{
        status:201,
        headers:{'Content-Type':'application/text'}
    })
}