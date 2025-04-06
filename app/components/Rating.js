

export default function({rating}) {
    let amts = []
    let color = "#888888"

    if (rating == null || rating < 0) {
        amts = [0.5, 0.5, 0.5, 0.5, 0.5]
    } else {
        color = "#EFBF04"
        for(let i = 0; i < 5; i++) {
            if (rating >= 1) {
                amts.push(1)
                rating = rating - 1
            } else {
                amts.push(rating)
                rating = 0
            }
        }
    }

    return (
        <div className="p-2 bg-black w-fit rounded-lg flex">
            {amts.map((val, idx) => {
                return <svg key={idx} className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 0h512v512H0z" fill="#000" fillOpacity="1"></path><g className="" transform="translate(0,0)"><path d="M256 38.013c-22.458 0-66.472 110.3-84.64 123.502-18.17 13.2-136.674 20.975-143.614 42.334-6.94 21.358 84.362 97.303 91.302 118.662 6.94 21.36-22.286 136.465-4.116 149.665 18.17 13.2 118.61-50.164 141.068-50.164 22.458 0 122.9 63.365 141.068 50.164 18.17-13.2-11.056-128.306-4.116-149.665 6.94-21.36 98.242-97.304 91.302-118.663-6.94-21.36-125.444-29.134-143.613-42.335-18.168-13.2-62.182-123.502-84.64-123.502z" fill={color} fillOpacity={val} stroke="#ccc" strokeOpacity="1" strokeWidth="8"></path></g></svg>
            })}
        </div>
    )

}