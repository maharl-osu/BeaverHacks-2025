import DatePicker from "react-datepicker";
import Rating from "./Rating";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function() {

    let [createModalOpen, setCreateModalOpen] = useState(false)
    let [date, setDate] = useState(new Date())

    let titleRef = useRef()
    let descriptionRef = useRef()
    let zoomRef = useRef()
    let startRef = useRef()
    let endRef = useRef()
    let costRef = useRef()
    let debounce = false

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

            console.log(res.status)
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

    return (
        <div className={"p-20"}>
            <h1 className="text-5xl mb-10">My Profile</h1>

            <button onClick={() => setCreateModalOpen(true)} className="text-xl bg-gray-800 rounded-sm mb-4 p-2 hover:bg-gray-900 active:bg-gray-950">Create Class</button>

            <h1 className="text-2xl mb-10">Registered Classes</h1>

            <h1 className="text-2xl mb-10">Registered Events</h1>

            <h1 className="text-2xl">Rating</h1>
            <Rating rating={3.2}/>
            <h1 className="text-2xl mt-10">Reviews</h1>

            {createModalOpen && renderCreateModal()}
        </div>
    )
}