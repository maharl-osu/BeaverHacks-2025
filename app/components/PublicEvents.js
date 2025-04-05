"use client"
import EventCard from "./EventCard";
import { useEffect, useState } from "react";

export default function() {

    let [events, setEvents] = useState(null);

    useEffect(() => {

        (async () => {
            try {
                const res = await fetch('/api/event', {method: "GET"})

                const body = await res.json()

                setEvents([body])

                console.log(body)
            } catch (e) {
                console.log(e)
            }
        })()

    }, [])

    function loading() {
        return <div>Loading...</div>
    }

    function displayEvents() {
        return events.map((event, idx) => {
            return <EventCard key={idx} title={event.name} description={event.description} creator={event.creatorID}  />
        })
    }

    return (
      <div className={"w-full flex flex-wrap "}>
        {events == null ? loading() : displayEvents()}
      </div>
    );
  }