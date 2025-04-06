import { SessionOptions } from "iron-session";
import {Database} from "../backend/database"


export const defaultSession = {
  username: "",
  name:"",
  userID: -1,
  isLoggedIn: false
};

export const sessionOptions = {
  password: "complex_password_at_least_32_characters_long",
  cookieName: "skill-leaf",
  cookieOptions: {
    secure: true,
  },
};

export function sleep() {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//params: [User]
export async function registrationTotals(users){
    var totals = {}
    for(var user of users){
        var classes = user.registeredClasses
        
        for(var _class of classes){
            if(totals[_class] == undefined){
                totals[_class] = 1
            }else{
                totals[_class] += 1
            }
        }
    }
    return totals
}

//remove all the classes that have ended 
export async function removeAndPayout(classes,totals){
  var db = await Database.getDatabase()
  var users = await db.getAllUsers()
  var output = []
  for(var _class of classes){
    if(_class.endTime.getTime() <= new Date().getTime()){
      var numReg = totals[_class.classID]
      if(numReg == undefined){
        continue
      }
      var author = users[_class.creatorID]
      for(var user of users){
        user.removeClass(_class.classID)
        if(user.userID == _class.creatorID){
          user.addCredits(_class.cost * numReg)
        }
      }
      
      await db.deleteClass(_class.classID)
      console.log("deleting class " + _class.classID.toString() + " with name " + _class.name)
    }else{
      output.push(_class)
    }
  }
  if(output.length != classes.length){
    for(var user of users){
      await db.saveUser(user)
    }
  }
  //await db.updateUser(user)
  return output
}