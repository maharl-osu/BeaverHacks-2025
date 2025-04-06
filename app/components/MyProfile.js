import DatePicker from "react-datepicker";
import Rating from "./Rating";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import RegisteredClassCard from "./RegisteredClassCard";
import { DayToString, MonthToString, WeekDayToString } from "../util/dateHelper";
import TeachingClassCard from "./TeachingClassCard";
import Profile from "./Profile";
import Review from "./Review";

export default function({onRemove}) {

    let [registered, setRegistered] = useState(null)
    let [teaching, setTeaching] = useState(null)
    let [createModalOpen, setCreateModalOpen] = useState(false)
    let [date, setDate] = useState(new Date())
    let [viewedProfile, setViewedProfile] = useState(null)
    let [user, setUser] = useState(null)

    let titleRef = useRef()
    let descriptionRef = useRef()
    let zoomRef = useRef()
    let startRef = useRef()
    let endRef = useRef()
    let costRef = useRef()
    let debounce = false


    useEffect(() => {
        (async () => {

            try {
                const res = await fetch("/api/user", {method: "GET"})

                const body = await res.json()

                setUser(body)

                const res2 = await fetch("/api/register", {method: "GET"})

                const body2 = await res2.json()


                setRegistered(body2)

                const res3 = await fetch("/api/teacher", {method: "GET"})

                const body3 = await res3.json()

                setTeaching(body3)

            } catch (e) {
                console.log(e)
            }

        })()
    }, [])

    async function createClass() {
        if (debounce) {return}
        debounce = true

        let title = titleRef.current?.value
        let description = descriptionRef.current?.value
        let zoom = zoomRef.current?.value
        let start = startRef.current?.value
        let end = endRef.current?.value
        let cost = costRef.current?.value

        const [startHr, startMin] = start.split(":")
        const [endHr, endMin] = end.split(":")
        
        let startDate = new Date(date)
        let endDate = new Date(date)

        startDate.setHours(Number(startHr), Number(startMin))
        endDate.setHours(Number(endHr), Number(endMin))

        if (title == null || zoom == null || start == null || end == null || cost == null || description == null) {
            toast("Something  Went Wrong", {description: "Please Try Again."})
            debounce = false
            return
        } else if (title == "" || zoom == "" || start == "" || end == "" || cost == "" || description == "") {
            debounce = false
            toast("Incomplete Form", {description: "Please Fill Out All Fields."})
            return
        }

        try {
            const res = await fetch("/api/class", {
                method: "POST",
                body: JSON.stringify({
                    name: title,
                    description: description,
                    startTime: startDate,
                    endTime: endDate,
                    zoomLink: zoom,
                    cost: cost
                })
            })

            if (res.status == 200) {
                setCreateModalOpen(false)
            } else {
                toast("Something  Went Wrong", {description: "Please Try Again."})
            }
        } catch (e) {
            console.log(e)
            toast("Something  Went Wrong", {description: "Please Try Again."})
        }
        
        debounce = false
    }

    function renderRegisteredClasses() {
        return registered.map((event, idx) => {
            let startDate = new Date(event.startTime)
            let weekday = WeekDayToString(startDate.getDay())
            let day = DayToString(startDate.getDate())
            let month = MonthToString(startDate.getMonth())
            let start = startDate.toLocaleTimeString(undefined, {timeStyle: "short"})
            let end = new Date(event.endTime).toLocaleTimeString(undefined, {timeStyle: "short"})
            return <RegisteredClassCard key={idx} onViewInstructor={() => {setViewedProfile(event.creatorID)}} onRemove={() => {unregister(event.classID, idx)}} creatorRating={event.creatorRating} numRegistered={event.registerCount} zoom={event.zoomLink} creator={event["creatorName"]} time={start + " - " + end} date={month + " " + day + " (" + weekday + ")"} title={event.name} description={event.description} cost={event.cost} onViewDetails={()=> {setDetailEvent(idx)}} />
        })
    }

    function renderTeachingClasses() {
        return teaching.map((event, idx) => {
            let startDate = new Date(event.startTime)
            let endDate = new Date(event.endTime)
            let weekday = WeekDayToString(startDate.getDay())
            let day = DayToString(startDate.getDate())
            let month = MonthToString(startDate.getMonth())
            let start = startDate.toLocaleTimeString(undefined, {timeStyle: "short"})
            let end = endDate.toLocaleTimeString(undefined, {timeStyle: "short"})

            let showDrop = ((startDate.getTime() - new Date().getTime()) / 60000) > 30

            return <TeachingClassCard key={idx} onRemove={() => {stopTeaching(event.classID, idx)}} showDrop={showDrop} numRegistered={event.registerCount} zoom={event.zoomLink} time={start + " - " + end} date={month + " " + day + " (" + weekday + ")"} title={event.name} description={event.description} cost={event.cost} onViewDetails={()=> {setDetailEvent(idx)}} />
        })
    }

    function renderCreateModal() {
        return (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="bg-gray-800 p-2 rounded-md flex gap-5 h-fit">
                    <div>
                        <p>Title</p>
                        <input ref={titleRef} className="p-2" placeholder="Title"></input>
                        <p>Zoom Link</p>
                        <input ref={zoomRef} className="p-2" placeholder="Zoom"></input>
                        <p>Date</p>
                        <DatePicker selected={date} onSelect={setDate} />
                        <p>Start Time</p>
                        <input ref={startRef} aria-label="Time" type="time" />
                        <p>End Time</p>
                        <input ref={endRef} aria-label="Time" type="time" />
                        <p>Cost ($)</p>
                        <input ref={costRef} className="p-2" placeholder="0.00"></input>
                        <button onClick={() => createClass()} className="mt-5 p-2 rounded-lg bg-green-800 w-full active:bg-green-950 hover:bg-green-900">Create Class</button>
                        <button onClick={() => setCreateModalOpen(false)} className="mt-5 p-2 rounded-lg bg-red-800 w-full active:bg-red-950 hover:bg-red-900">Cancel</button>
                    </div>
                    <div className="h-full">
                        <p>Description</p>
                        <textarea ref={descriptionRef} className="h-[430px] resize-none" />
                    </div>
                </div>
            </div>
        )
    }

    async function unregister(classID, idx) {
        if (debounce) {return}
        debounce = true
        
        try {
            const res = await fetch("/api/register", {method: "DELETE", body: JSON.stringify({classID: classID})})

            if (res.status == 200) {
                toast("Unregistered")

                let new_registered = [...registered]
                new_registered.splice(idx, 1)

                setRegistered(new_registered)
                onRemove()

            } else {
                toast("Something Went Wrong", {description: "Please Try Again."})
            }

        } catch (e) {
            console.log(e)
            toast("Something Went Wrong", {description: "Please Try Again."})
        }

        debounce = false
    }

    async function stopTeaching(classID, idx) {
        if (debounce) {return}
        debounce = true
        
        try {
            const res = await fetch("/api/class", {method: "DELETE", body: JSON.stringify({classID: classID})})

            if (res.status == 200) {
                toast("Dropped Class")

                let new_teaching = [...teaching]
                new_teaching.splice(idx, 1)

                setTeaching(new_teaching)
            } else {
                toast("Something Went Wrong", {description: "Please Try Again."})
            }

        } catch (e) {
            console.log(e)
            toast("Something Went Wrong", {description: "Please Try Again."})
        }

        debounce = false
    }

    function renderReviews() {
        return (
            <div className="grid grid-cols-1 gap-5 max-h-[calc(100%-400px)] overflow-y-scroll">
                {user.reviews.map((val, idx) => {
                    return <Review key={idx} data={val} />
                })}
            </div>
        )
    }

    return  (teaching == null) ? 
        (<div className="flex items-center justify-center h-full">
            <img src="/loading.png" className="animate-spin w-80"></img>
        </div>
        )
    :(
        <div className={"p-20"}>
            <h1 className="text-5xl mb-10">My Profile</h1>

            <button onClick={() => setCreateModalOpen(true)} className="text-xl bg-gray-800 rounded-sm mb-4 p-2 shadow-sm shadow-black hover:bg-gray-900 active:bg-gray-950">Create Class</button>

            <h1 className="text-2xl">Classes I'm Teaching</h1>
            <div className="flex flex-wrap mb-10">
                {teaching && renderTeachingClasses()}
            </div>

            <h1 className="text-2xl">Registered Classes</h1>
            <div className="flex flex-wrap mb-10">
                {registered && renderRegisteredClasses()}
            </div>
            

            <h1 className="text-2xl mb-10">Registered Events</h1>

            <h1 className="text-2xl">Overall Rating</h1>
            {user && <Rating rating={user.Rating}/>}
            <h1 className="text-2xl mt-10">Reviews</h1>

            {createModalOpen && renderCreateModal()}
            <Profile viewedProfile={viewedProfile} setViewedProfile={setViewedProfile} />

            {user && renderReviews()}
        </div>
    )
}