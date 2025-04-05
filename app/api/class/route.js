import {Class} from "../../backend/class"
//getClass
export async function GET(){
    var dummyClass = new Class(1,1,"This is a test class for testing","4/5",60*12,60*13,"https://ZOOMLINKHERE",100)
    return new Response(JSON.stringify(dummyClass),{
        status:200,
        headers: {'Content-Type':'application/json'}
    })
}
//createClass