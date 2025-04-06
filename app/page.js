import { getIronSession } from "iron-session";
import HomePage from "./components/HomePage";
import { cookies } from "next/headers";
import { sessionOptions } from "./api/lib";
import { redirect } from "next/navigation";


export default async function Home() {
    const session = await getIronSession(await cookies(), sessionOptions)
    if (!session.isLoggedIn) {
        redirect("/signin")
    }

    return (
        <HomePage />
    );
}
