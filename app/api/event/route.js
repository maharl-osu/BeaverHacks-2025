import {Event} from "../../backend/event"

//get event
export async function GET(){
    var dummyClass = new Event("test event 1",1,1,"This is a test class for testing","4/5",60*12,60*13,"https://ZOOMLINKHERE")
    return new Response(JSON.stringify(dummyClass),{
        status:200,
        headers: {'Content-Type':'application/json'}
    })
}
//create event