
export class Class{
    name = ""
    creatorID = "" //UserID
    classID = ""
    description = ""
    startTime = 0
    endTime = 0
    zoomLink = ""
    cost = 0

    constructor(_name,_creatorID, _classID,_description, _date, _startTime, _endTime, _zoomLink, _cost){
        this.name = _name
        this.creatorID = _creatorID
        this.classID = _classID
        this.description = _description
        this.startTime = new Date(_startTime)
        this.endTime = new Date(_endTime)
        this.duration = (this.endTime.getTime() - this.startTime.getTime())/60000
        this.zoomLink = _zoomLink
        this.cost = _cost
    }

    static fromDB(dbO){
        return new Class(dbO.name,dbO.creatorID,dbO.classID,dbO.description,dbO.date,dbO.startTime,dbO.endTime,dbO.zoomLink,dbO.cost)
    }
}