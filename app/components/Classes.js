"use client"
import ClassCard from "./ClassCard";
import { useEffect, useState } from "react";

export default function({shouldShow}) {

    let [events, setEvents] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/class', {method: "GET"})

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
        return events.map((event) => {
            return <ClassCard description={event.description} creator={event.creatorID} cost={event.cost} />
        })
    }

    let addedCSS = shouldShow ? "" : "hidden"

    return (
      <div className={"w-full flex flex-wrap " + addedCSS}>
        {events == null ? loading() : displayEvents()}
      </div>
    );
  }