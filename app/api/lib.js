import { SessionOptions } from "iron-session";


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
            if(totals[_class.toString()] == undefined){
                totals[_class.toString()] = 1
            }else{
                totals[_class.toString()] += 1
            }
        }
    }
    return totals
}