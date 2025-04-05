import Image from "next/image";


export default function Home() {
  return (
    <div className="grid grid-cols-[min(300px,30%)_1fr] items-center justify-items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
      <div className="bg-gray-900 w-full h-full relative">
        <div className="p-2">
            <button className="w-full bg-gray-500 rounded-sm mb-2 active:bg-gray-600">Public Events</button>
            <button className="w-full bg-gray-500 rounded-sm mb-2 active:bg-gray-600">Classes</button>
        </div>
        
        
        <div className="absolute bottom-20 w-full p-2">
            <p className="mb-4 inline">
                John Doe
            </p>
            <p className="ml-4 inline text-gray-400">
                ($19.99)
            </p>
            <button className="bg-gray-200 text-black w-full rounded-sm mt-2 active:bg-gray-600">
                Sign Out
            </button>
        </div>
      </div>
      <div>
        Hello
      </div>
    </div>
  );
}
