export class Review{
    creator = ""
    starRating = -1
    text = ""

    constructor(_creator,_starRating,_text){
        this.creator = _creator
        this.starRating = _starRating
        this.text = _text
    }
}