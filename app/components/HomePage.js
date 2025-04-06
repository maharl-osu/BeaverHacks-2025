"use client"
import MyProfile from "./MyProfile";
import { useEffect, useRef, useState } from "react";
import Classes from "./Classes";
import PublicEvents from "./PublicEvents";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export default function() {
    let router = useRouter()
    let [page, setPage] = useState("myprofile")
    let [name, setName] = useState("Loading...")
    let [credits, setCredits] = useState("Loading...")

    let [filterOptions, setFilterOptions] = useState({})
    let nameFilterRef = useRef()
    let creatorFilterRef = useRef()
    let minPriceRef = useRef()
    let maxPriceRef = useRef()

    let debounce = false

    async function loadAccountDetails() {
        try {
            const res = await fetch("/api/user", {method: "GET"})

            const body = await res.json()

            console.log(body)
            setName(body.name)
            setCredits((Math.floor(body.credits * 100) / 100).toFixed(2))

        } catch (e) {
            console.log(e)
            setName("John Doe")
            setCredits("0.00")
        }
    }

    useEffect(() => {
        loadAccountDetails()
    },[])

    async function signOut() {
        if (debounce) {return}
        debounce = true

        try {
            const res = await fetch("/api/login", {method:"DELETE"})

            if (res.status == 200) {
                router.push("/signin")
            } else {
                toast("Something Went Wrong", "Please Try Again.")
            }
        } catch (e) {
            toast("Something Went Wrong", "Please Try Again.")
        }
        
        debounce = false
    }

    function updateFilter() {
        let name = nameFilterRef.current?.value
        let creator = creatorFilterRef.current?.value
        let min_price = minPriceRef.current?.value
        let max_price = maxPriceRef.current?.value
        if (name == null || creator == null || min_price == null || max_price == null) {
            toast("Something Went Wrong", {description: "Failed To Apply Filter."})
            return
        }

        if (name == "")
            name = null
        if (creator == "")
            creator = null
        if (min_price == "")
            min_price = null
        if (max_price == "")
            max_price = null

        setFilterOptions({
            name: name,
            creator: creator, 
            minPrice: min_price,
            maxPrice: max_price
        })
    }

    return (
        <div className="grid grid-cols-[min(300px,30%)_1fr] items-center justify-items-center gap-4 min-h-screen font-[family-name:var(--font-geist-sans)] bg-orange-900">
        <div className="bg-gray-95 shadow-lg shadow-black w-full h-[100vh] self-start sticky top-0 bg-gray-800">
            <h1 className="text-4xl text-center mt-4 font-serif">
                SkillLeaf
            </h1>
            <h4 className="text-center mb-5 text-gray-400">
                Connecting Students & Professors
            </h4>

            <div className="p-2">
                <button className="bg-gray-200 text-black w-full rounded-sm mb-2 active:bg-gray-600" onClick={() => setPage("myprofile")} >Profile</button>
                <button className="w-full bg-white text-black rounded-sm mb-2 active:bg-gray-600" onClick={() => setPage("classes")} >Classes</button>
            </div>

            {page == "classes" &&
                <div className="p-4 mt-10">
                    <p>
                        Name
                    </p>
                    <input ref={nameFilterRef} className="bg-white px-2 text-black w-full rounded-sm mb-1" placeholder="Event/Class Name" />
                    <p>
                        Creator
                    </p>
                    <input ref={creatorFilterRef} className="bg-white px-2 text-black w-full rounded-sm mb-1" placeholder="John Doe" />
                    <p>
                        Price
                    </p>
                    <div className="flex gap-5 mb-2">
                        <input ref={minPriceRef} type="number" className="bg-white px-2 text-black w-[50%] rounded-sm" placeholder="Min" />
                        <input ref={maxPriceRef} type="number" className="bg-white px-2 text-black w-[50%] rounded-sm" placeholder="Max" />
                    </div>
                    <button onClick={updateFilter} className="w-full bg-white text-black rounded-sm mb-2 active:bg-gray-600">Apply Filter</button>
                </div>
            }
            
            <div className="absolute bottom-0 w-full p-2">
                <p className="inline">
                    {name}
                </p>
                <p className="ml-4 inline text-gray-400">
                    (${credits})
                </p>
                <button className="bg-gray-200 text-black w-full rounded-sm mt-2 active:bg-gray-600" onClick={() => signOut()}>
                    Sign Out
                </button>
                <p className="text-center mt-5 text-gray-500">
                    Powered By
                </p>
                <img className="w-[50%] m-auto" src="/Firebase-Logo.png"></img>
            </div>
        </div>
        <div className="w-full h-full">
            {page == "myprofile" && <MyProfile onRemove={loadAccountDetails} />}
            {page == "classes" && <Classes onRegister={loadAccountDetails} filter={filterOptions} />}
            {page == "events" && <PublicEvents />}
        </div>
        </div>
    );
}
