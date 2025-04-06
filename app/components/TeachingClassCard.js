

export default function({title, date, time, description, numRegistered, cost, zoom, onRemove, showDrop}) {
    let dropColor = showDrop ? "bg-red-800 hover:bg-red-900 active:bg-red-950" : "bg-gray-700"

    return (
      <div className=" bg-gray-800 rounded-md w-80 h-fit shadow-md shadow-black pb-2 m-2">
        <h1 className="bg-gray-700 bg-cover h-fit p-2 rounded-t-md text-center text-2xl shadow-black shadow-xs">
            {title}
        </h1>
        <p className="pl-2 text-gray-300">
            {date}
        </p>
        <p className="px-2 text-gray-300">
            {time}
        </p>
        <p className="pl-2">
            Students Registered: {numRegistered}
        </p>
        <p className="p-2 h-20 overflow-clip">
            Description: {description}
        </p>

        <a className="p-2 underline text-blue-400" href={zoom}>Zoom Link</a>

        <button onClick={onRemove} disabled={!showDrop} className={"m-2 w-[calc(100%-16px)] px-4 py-2 rounded-sm duration-100 " + dropColor}>
            Drop Class <span className="text-gray-400">(${cost})</span>
        </button>

      </div>
    );
  }