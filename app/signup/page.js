"use client"
import { useRouter } from "next/navigation"
import { useRef } from "react"
import { toast } from "sonner"


export default function() {
    const router = useRouter()
    const userRef = useRef()
    const nameRef = useRef()
    const passRef = useRef()

    let debounce = false

    async function signUp() {
        if (debounce) {return}
        debounce = true
        let username = userRef.current?.value
        let name = nameRef.current?.value
        let password = passRef.current?.value

        if (username == null || name == null || password == null) {
            toast("Something Went Wrong", {description: "Please Try Again."})
            debounce = false
            return
        }else if (username == "" || name == "" || password == "") {
            toast("Incomplete Form", {description: "Please Fill Out All Fields."})
            debounce = false
            return
        }


        try {
            const res = await fetch("/api/createAccount", {
                method: "POST",
                body: JSON.stringify({
                    username: username,
                    name: name,
                    password: password
                })
            })

            if (res.status == 200) {
                toast("Signed In")
                router.push("/")
            } else {
                toast("Something Went Wrong", {description: "Please Try Again."})
            }
        } catch (e) {
            console.log(e)
            toast("Something Went Wrong", {description: "Please Try Again."})
        }
        
        debounce = false

    }

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
                <input ref={nameRef} className="bg-gray-800 p-2 w-full rounded-sm hover:bg-gray-900 mb-2" placeholder="Name" />
                <div className="mb-2 flex gap-5">
                    <input ref={userRef} className="bg-gray-800 p-2 rounded-sm hover:bg-gray-900" placeholder="Username" />
                    <input ref={passRef} className="bg-gray-800 p-2 rounded-sm hover:bg-gray-900" placeholder="Password" />
                </div>
                <button className="w-full bg-gray-800 rounded-md p-1 hover:bg-gray-900 active:bg-gray-950 duration-100" onClick={() => signUp()}>Sign Up</button>
                <p className="text-xs mt-2 text-gray-400">
                    Already Have An Account? <a href="/signin" className="underline text-blue-300">Sign In</a>
                </p>
            </div>
        </div>
    )

}