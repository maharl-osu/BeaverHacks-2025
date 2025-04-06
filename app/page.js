"use client"
import { useRouter } from "next/navigation";
import MyProfile from "./components/MyProfile";
import { useState } from "react";
import Classes from "./components/Classes";
import PublicEvents from "./components/PublicEvents";


export default function Home() {

    let [page, setPage] = useState("dashboard")

    return (
        <div className="grid grid-cols-[min(300px,30%)_1fr] items-center justify-items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)] bg-orange-900">
        <div className="bg-gray-95 shadow-lg shadow-black w-full h-full relative bg-gray-800">

            <h1 className="text-4xl text-center mt-4 font-serif">
                SkillLeaf
            </h1>
            <h4 className="text-center mb-5 text-gray-400">
                Connecting Students & Professors
            </h4>

            <div className="p-2">
                <button className="w-full bg-white text-black rounded-sm mb-2 active:bg-gray-600" onClick={() => setPage("events")} >Public Events</button>
                <button className="w-full bg-white text-black rounded-sm mb-2 active:bg-gray-600" onClick={() => setPage("classes")} >Classes</button>
            </div>
            <div className="p-4 mt-10">
                <p>
                    Name
                </p>
                <input className="bg-white px-2 text-black w-full rounded-sm mb-1" placeholder="Event/Class Name" />
                <p>
                    Creator
                </p>
                <input className="bg-white px-2 text-black w-full rounded-sm mb-1" placeholder="John Doe" />
                <p>
                    Price
                </p>
                <div className="flex gap-5 mb-2">
                    <input type="number" className="bg-white px-2 text-black w-[50%] rounded-sm" placeholder="Min" />
                    <input type="number" className="bg-white px-2 text-black w-[50%] rounded-sm" placeholder="Max" />
                </div>
                <button className="w-full bg-white text-black rounded-sm mb-2 active:bg-gray-600">Apply Filter</button>
            </div>
            
            <div className="absolute bottom-20 w-full p-2">
                <p className="inline">
                    John Doe
                </p>
                <p className="ml-4 inline text-gray-400">
                    ($19.99)
                </p>
                <button className="bg-gray-200 text-black w-full rounded-sm mt-2 active:bg-gray-600" onClick={() => setPage("myprofile")} >
                    Profile
                </button>
                <button className="bg-gray-200 text-black w-full rounded-sm mt-2 active:bg-gray-600" >
                    Sign Out
                </button>
            </div>
        </div>
        <div className="w-full h-full">
            {page == "myprofile" && <MyProfile />}
            {page == "classes" && <Classes />}
            {page == "events" && <PublicEvents />}
        </div>
        </div>
    );
}
