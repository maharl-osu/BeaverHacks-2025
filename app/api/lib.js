import { SessionOptions } from "iron-session";


export const defaultSession = {
  username: "",
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