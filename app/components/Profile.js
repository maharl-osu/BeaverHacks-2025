import { useEffect, useState } from "react"
import Rating from "./Rating"
import Review from "./Review"

export default function({viewedProfile, setViewedProfile}) {
    
    let [user, setUser] = useState(null)

    useEffect(() => {
        if (viewedProfile == null)
            setUser(null)
        else {
            (async () => {
                const res = await fetch("/api/user?id=" + viewedProfile, {
                    method: "GET"
                })

                const body = await res.json()

                console.log(body)
                setUser(body)
            })()
        }
    }, [viewedProfile])

    if (viewedProfile == null)
        return

    function loading() {
        return (
            <div className="flex items-center justify-center h-full">
                <img src="/loading.png" className="animate-spin w-80"></img>
            </div>
        )
    }

    function renderUser() {
        return (
            <>
                <h1 className="text-5xl w-full text-center mb-2 mt-8">{user.name}</h1>
                <div className="w-full flex items-center justify-center mb-20">
                    <Rating rating={user.Rating} />
                </div>
                <button className="bg-green-700 hover:bg-green-800 active:bg-green-900 p-2 my-4 mx-auto rounded-md shadow-sm shadow-black">
                    Write Review
                </button>
                <h4 className="text-2xl w-full text-center mt-2">Reviews</h4>
                <div className="grid grid-cols-1 gap-5 overflow-y-scroll">
                    {user.reviews.map((val, idx) => {
                        return <Review key={idx} data={val} />
                    })}
                </div>
            </>
        )
    }

    return (
        <div className="w-full h-full fixed bg-black/40 inset-0 flex items-center justify-center">
            <div className="bg-gray-700 relative w-[80%] h-[80%] max-w-4xl rounded-sm p-4">
                <button onClick={() => setViewedProfile(null)} className="absolute -top-4 -right-4 w-fit h-fit bg-red-800 hover:bg-red-900 active:bg-red-950 p-2 rounded-sm">Close</button>
                {user != null ? renderUser() : loading()}
            </div>
        </div>
    )
}