
export class Class{
    creatorID = "" //UserID
    classID = ""
    description = ""
    date = ""
    startTime = 0
    endTime = 0
    duration = 0
    zoomLink = ""
    cost = 0

    constructor(_creatorID, _classID,_description, _date, _startTime, _endTime, _zoomLink, _cost){
        this.creatorID = _creatorID
        this.classID = _classID
        this.description = _description
        this.date = _date
        this.startTime = _startTime
        this.endTime = _endTime
        this.duration = _endTime - _startTime
        this.zoomLink = _zoomLink
        this.cost = _cost
    }
}