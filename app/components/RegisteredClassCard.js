

export default function({title, creator, date, time, description, cost, onRemove}) {

    return (
      <div className=" bg-gray-800 rounded-md w-80 h-fit shadow-md shadow-black pb-2 m-2">
        <h1 className="bg-gray-700 bg-cover h-fit p-2 rounded-t-md text-center text-2xl shadow-black shadow-xs">
            {title}
        </h1>
        <p className="pl-2 pt-2">
            Instructor: {creator}
        </p>
        <p className="pl-2 text-gray-300">
            {date}
        </p>
        <p className="px-2 text-gray-300">
            {time}
        </p>
        <p className="p-2 h-20 overflow-clip">
            Description: {description}
        </p>
        <button onClick={onRemove} className="m-2 w-[calc(100%-16px)] bg-red-800 px-4 py-2 rounded-sm hover:bg-red-900 active:bg-red-950 duration-100">
            Unregister <span className="text-gray-400">(${cost})</span>
        </button>
      </div>
    );
  }