import Rating from "./Rating"


export default function({data}) {

    console.log(data)


    return (
        <div className="p-2 w-full bg-gray-200 rounded-md">
            <div className="flex gap-10">
                <h4 className="text-3xl text-gray-700">{data.creatorID}</h4>
                <Rating rating={data.starRating} />
            </div>
            
            <p className="text-gray-800 bg-gray-300 w-[calc(100%-32px)] m-2 p-2 rounded-md">
                {data.text}
            </p>
        </div>
    )
}