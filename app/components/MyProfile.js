import Rating from "./Rating";

export default function({shouldShow}) {
    let addedCSS = shouldShow ? "" : "hidden"

    return (
        <div className={"p-20 absolute " + addedCSS}>
            <h1 className="text-5xl mb-10">My Profile</h1>
            <h1 className="text-2xl">Rating</h1>
            <Rating rating={3.2}/>
            <h1 className="text-2xl mt-10">Reviews</h1>
        </div>
    )
}