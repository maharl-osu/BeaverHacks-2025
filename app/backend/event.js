//todo: dont store duration in class and instead calculate it as needed
export class Event{
    name = ""
    creatorID = "" //UserID
    eventID = ""
    description = ""
    date = ""
    startTime = 0
    endTime = 0
    duration = 0
    zoomLink = ""

    constructor(_name,_creatorID, _eventID,_description, _date, _startTime, _endTime, _zoomLink){
        this.name = _name
        this.creatorID = _creatorID
        this.eventID = _eventID
        this.description = _description
        this.date = _date
        this.startTime = _startTime
        this.endTime = _endTime
        this.duration = _endTime - _startTime
        this.zoomLink = _zoomLink
    }
}