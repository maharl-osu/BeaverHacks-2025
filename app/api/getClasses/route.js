import {Class} from "../../backend/class"

import {Database} from "../../backend/database"


export async function GET(request){
    var db = await Database.getDatabase()
    return new Response(JSON.stringify(await db.getClasses()),{
        status:200,
        headers: {'Content-Type':'application/json'}
    })
}