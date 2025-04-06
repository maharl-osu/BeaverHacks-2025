"use client"
import { DayToString, MonthToString, WeekDayToString } from "../util/dateHelper";
import ClassCard from "./ClassCard";
import { useEffect, useState } from "react";
import Rating from "./Rating";
import { toast } from "sonner";

export default function({onRegister}) {

    let [events, setEvents] = useState(null);
    let [detailEventIdx, setDetailEvent] = useState(null);
    let debounce = false

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/getClasses', {method: "GET"})

                const body = await res.json()

                console.log(body)

                setEvents(body)

            } catch (e) {
                console.log(e)
                toast("Failed To Load")
            }
        })()

    }, [])

    function loading() {
        return <div>Loading...</div>
    }

    async function register(classID, eventidx) {
        if (debounce) {return}
        debounce = true

        try {
            const res = await fetch("/api/register", {method: "POST", body: JSON.stringify({classID: classID})})

            if (res.status == 200) {
                toast("Registration Complete")

                let new_events = [...events]
                new_events[eventidx]['registered'] = true
                setEvents(new_events)

                onRegister()

            } else if (res.status == 402) {
                toast("Insufficient Funds")
            } else {
                toast("Something Went Wrong", {description: "Please Try Again."})
            }
        } catch (e) {
            console.log(e)
            toast("Something Went Wrong", {description: "Please Try Again."})
        }
        
        debounce = false
    }

    function displayClasses() {
        return events.map((event, idx) => {
            let startDate = new Date(event.startTime)
            let weekday = WeekDayToString(startDate.getDay())
            let day = DayToString(startDate.getDate())
            let month = MonthToString(startDate.getMonth())
            let start = startDate.toLocaleTimeString(undefined, {timeStyle: "short"})
            let end = new Date(event.endTime).toLocaleTimeString(undefined, {timeStyle: "short"})
            return <ClassCard onRegister={() => {register(event["classID"], idx)}} key={idx} numRegistered={event.registerCount} registered={event.registered} creator={event["creatorName"]} time={start + " - " + end} date={month + " " + day + " (" + weekday + ")"} title={event.name} description={event.description} cost={event.cost} onViewDetails={()=> {setDetailEvent(idx)}} />
        })
    }

    function displayDetails() {
        let detailEvent = events[detailEventIdx]
        let startDate = new Date(detailEvent.startTime)
        let weekday = WeekDayToString(startDate.getDay())
        let day = DayToString(startDate.getDate())
        let month = MonthToString(startDate.getMonth())
        let start = startDate.toLocaleTimeString(undefined, {timeStyle: "short"})
        let end = new Date(detailEvent.endTime).toLocaleTimeString(undefined, {timeStyle: "short"})

        return (
            <div className="bg-black/50 inset-0 absolute w-full h-full flex items-center justify-center">
                <div className="w-[500px]">
                    <h1 className="text-3xl text-center bg-gray-700 w-full mb-4 p-2 rounded-md">{detailEvent.name}</h1>
                    <div className="bg-gray-700 p-4 w-full rounded-md">
                        <p>
                            Instructor: {detailEvent.creatorName}
                        </p>
                        <Rating rating={detailEvent.creatorRating} />
                        <p>
                            Students Registered: {detailEvent.registerCount}
                        </p>
                        <p>
                            Cost: ${detailEvent.cost}
                        </p>
                        <p>
                            Date: {month + " " + day + " (" + weekday + ")"}
                        </p>
                        <p>
                            Time: {start} - {end}
                        </p>
                        <p>
                            Description: {detailEvent.description}
                        </p>
                    </div>
                    <button className="bg-gray-700 hover:bg-gray-800 active:bg-gray-900 mt-5 text-xl p-2 w-full rounded-md" onClick={() => setDetailEvent(null)}>Back</button>
                </div>
                
            </div>
        )
    }

    return (
      <div className={"w-full flex flex-wrap "}>
        {events == null ? loading() : displayClasses()}
        {detailEventIdx != null && displayDetails()}
      </div>
    );
  }