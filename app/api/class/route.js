import {Class} from "../../backend/class"
import {Database} from "../../backend/database"
//getClass
//params: id - the id of the class to get
//example: http://localhost:3000/api/class?id=1
export async function GET(request){
    var params = request.nextUrl.searchParams
    var db = await Database.getDatabase()
    //var dummyClass = new Class(1,1,"This is a test class for testing","4/5",60*12,60*13,"https://ZOOMLINKHERE",100)
    return new Response(JSON.stringify(await db.getClass(params.get("id"))),{
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
    "date" : 
    "startTime" : 
    "endTime": 
    "zoomLink": 
    "cost":
}

example usage: await fetch("http://localhost:3000/api/class",{method: "POST",body: JSON.stringify({"creatorID":2,"description":"test desc", "date":"4/5","startTime":60,"endTime":120,"zoomLink":"TEST LINK", "cost":100})}) */

export async function POST(request){
    const body = await request.json()

    //var dummyUser = new User(2,body.name)
    //dummyUser.addCredits(200)
    var db = await Database.getDatabase()
    await db.addClass(body)
    return new Response("Created class",{
        status:201,
        headers:{'Content-Type':'application/text'}
    })
}