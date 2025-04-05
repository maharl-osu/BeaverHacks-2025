import {Class} from "../../backend/class"

//get events
export async function GET(){
    var events = []
    events.push(new Class("test event 1",1,1,"This is a test class for testing","4/5",60*12,60*13,"https://ZOOMLINKHERE",100))
    events.push(new Class("testr event 2",1,2,"This is also a test class for testing","4/5",60*13,60*14,"https://ZOOMLINKHERE",150))
    events.push(new Class("test event by a different id",2,3,"This is a 3rd test class for testing","4/6",60*8,60*9.5,"https://ADIFFERENTZOOMLINKHERE",300))
    events.push(new Class("test event by a 3rd different id",3,4,"This is a 4rd test class for testing","4/6",60*11,60*12,"https://ADIFFERENTZOOMLINKHERE",450))
    return new Response(JSON.stringify(events),{
        status:200,
        headers: {'Content-Type':'application/json'}
    })
}