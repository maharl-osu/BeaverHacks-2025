import { useEffect, useRef, useState } from "react"
import Rating from "./Rating"
import Review from "./Review"
import InputRating from "./InputRating"

export default function({viewedProfile, setViewedProfile}) {
    
    let [user, setUser] = useState(null)

    let [inputRating, setInputRating] = useState(0)

    let textRef = useRef()

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

    function postReview() {

    }

    function renderUser() {
        return (
            <>
                <h1 className="text-5xl w-full text-center mb-2 mt-8">{user.name}</h1>
                <div className="w-full flex items-center justify-center mb-20">
                    <Rating rating={user.Rating} />
                </div>
                <textarea ref={textRef} className="resize-none w-full h-24 p-2" maxLength={250} placeholder="Review"></textarea>
                <div className="flex m-2 gap-5">
                    <div>
                        <InputRating rating={inputRating} setRating={setInputRating} />
                    </div>
                    <button className="rounded-sm bg-green-700 hover:bg-green-800 active:bg-green-900 p-1 shadow-sm shadow-black">
                        Post Review
                    </button>
                </div>
                
                <h4 className="text-2xl w-full text-center mt-2">Reviews ({user.reviews.length})</h4>
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
                <button onClick={() => {setViewedProfile(null); setInputRating(0)}} className="absolute -top-4 -right-4 w-fit h-fit bg-red-800 hover:bg-red-900 active:bg-red-950 p-2 rounded-sm">Close</button>
                {user != null ? renderUser() : loading()}
            </div>
        </div>
    )
}