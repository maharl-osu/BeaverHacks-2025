import Rating from "./Rating";

export default function() {

    return (
        <div className={"p-20"}>
            <h1 className="text-5xl mb-10">My Profile</h1>
            <h1 className="text-2xl">Rating</h1>
            <Rating rating={3.2}/>
            <h1 className="text-2xl mt-10">Reviews</h1>
        </div>
    )
}