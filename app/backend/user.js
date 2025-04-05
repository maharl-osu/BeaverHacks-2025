import {Review} from "./reviews.js"

export class User{
    userID = -1
    name = ""
    credits = 0
    Rating = 5
    reviews = []

    constructor(_userID, _name){
        this.userID = _userID
        this.name = _name
    }

    addCredits(creditAmmount){

    }

    //update rating and review list
    addReview(){

    }
}

