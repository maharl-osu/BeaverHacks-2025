

export default function() {
    
    return (
        <div className="w-full h-full absolute bg-orange-900 flex items-center justify-center">
            <div>
                <div className="bg-gray-800 p-2 rounded-sm mb-5">
                    <h1 className="text-5xl font-serif text-center">
                        SkillLeaf
                    </h1>
                    <h4 className="text-center">
                        Connecting Students & Professors
                    </h4>
                </div>
                <div className="mb-2 flex gap-5">
                    <input className="bg-gray-800 p-2 rounded-sm hover:bg-gray-900" placeholder="Username" />
                    <input className="bg-gray-800 p-2 rounded-sm hover:bg-gray-900" placeholder="Password" />
                </div>
                <button className="w-full bg-gray-800 rounded-md p-1 hover:bg-gray-900 active:bg-gray-950 duration-100">Sign In</button>
                <p className="text-xs mt-2 text-gray-400">
                    Don't Have An Account? <a href="/signup" className="underline text-blue-300">Sign Up</a>
                </p>
            </div>
        </div>
    )

}