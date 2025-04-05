
export class Class{
    creator = "" //UserID
    classID = ""
    date = ""
    startTime = 0
    endTime = 0
    duration = 0
    zoomLink = ""
    cost = 0

    constructor(_creator, _classID, _date, _startTime, _endTime, _zoomLink, _cost){
        this.creator = _creator
        this.classID = _classID
        this.date = _date
        this.startTime = _startTime
        this.endTime = _endTime
        this.duration = _endTime - _startTime
        this.zoomLink = _zoomLink
        this.cost = _cost
    }
}