
export class Event{
    creator = "" //UserID
    eventID = ""
    date = ""
    startTime = 0
    endTime = 0
    duration = 0
    zoomLink = ""

    constructor(_creator, _eventID, _date, _startTime, _endTime, _zoomLink){
        this.creator = _creator
        this.eventID = _eventID
        this.date = _date
        this.startTime = _startTime
        this.endTime = _endTime
        this.duration = _endTime - _startTime
        this.zoomLink = _zoomLink
    }
}