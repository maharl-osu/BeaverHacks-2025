"use client"
import ClassCard from "./ClassCard";
import { useEffect, useState } from "react";

export default function() {

    let [events, setEvents] = useState(null);
    let [detailEvent, setDetailEvent] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/getClasses', {method: "GET"})

                const body = await res.json()

                setEvents(body)

            } catch (e) {
                console.log(e)
            }
        })()

    }, [])

    function loading() {
        return <div>Loading...</div>
    }

    function displayClasses() {
        return events.map((event, idx) => {
            return <ClassCard key={idx} title={event.name} description={event.description} creator={event.creatorID} cost={event.cost} onViewDetails={()=> {setDetailEvent(event)}} />
        })
    }

    return (
      <div className={"w-full flex flex-wrap "}>
        {events == null ? loading() : displayClasses()}
        {detailEvent != null && 
            <div className="bg-black/50 inset-0 absolute w-full h-full flex items-center justify-center">
                <div className="w-80">
                    <div className="bg-gray-700 p-4 w-full rounded-md">
                        <h1 className="text-5xl text-center">{detailEvent.name}</h1>
                        <p>
                            {detailEvent.description}
                        </p>
                    </div>
                    <button className="bg-gray-700 hover:bg-gray-800 active:bg-gray-900 mt-5 text-xl p-2 w-full rounded-md" onClick={() => setDetailEvent(null)}>Back</button>
                </div>
                
            </div>
        }
      </div>
    );
  }