import React, { useState } from 'react'
import axios from 'axios'

export default function SignUp() {

    const [name, setName] = useState<string>('');


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
  
        await axios.get(`/api/users`)
            .then(response => {
                const users = response.data;
                const user = users.find((user: any) => user.name === name);
                if (!user) {
                    window.alert("Username does not exist");
                } else {
                    axios.get(`/api/login?name=${name}`, { withCredentials: true })
                    .then(() => {
                        window.location.href = "/";
                    })            
                }  
            })
    }

    return (
        <div>
            <section className="h-screen">
                <div className="px-6 h-full text-gray-800">
                    <div
                        className="flex flex-col xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6">
                        <p className="text-xl font-bold text-center">
                            Log In DOTNET ChatApp
                        </p>
                        <div className="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-2/12 lg:w-2/12 md:w-3/12 mb-12 md:mb-0">
                            <img
                                src="/coco.svg"
                                className="w-full"
                                alt="Sample image"
                            />
                        </div>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Do not have an Account? <a href="SignUp" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign Up</a>
                        </p>
                        <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <input

                                        onChange={(e) => setName(e.target.value)}
                                        type="text"
                                        className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                        id="exampleFormControlInput2"
                                        placeholder="Name"
                                    />
                                </div>



                                <div className="text-center lg:text-left">
                                    <button
                                        type="submit"
                                        className="inline-block px-7 py-3 bg-[#704329] text-white font-medium text-sm leading-snug uppercase rounded border shadow-md hover:bg-white hover:shadow-lg   hover:text-[#704329] hover:border-[#704329] ">
                                        Sign In
                                    </button>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
