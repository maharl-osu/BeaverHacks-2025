import {User} from "../../backend/user.js"

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