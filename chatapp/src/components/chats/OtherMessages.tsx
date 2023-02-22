import React, {useRef, useEffect} from 'react'
interface Props {
    message: any;
    name: string;
}
export default function OtherMessages({message, name}: Props) {
    const msgContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      msgContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
    }, [])
    function editMessage() {
      console.log("edit", message)
    }
  
  return (
    <div 
    ref={msgContainerRef}
    className="col-start-1 col-end-8 p-3 rounded-lg">
    <div className="flex flex-row items-center">
        <div
            className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
        >
             {name[0].toUpperCase()}
        </div>
        <div
            className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl"
        >
            <div>{message.message}</div>
        </div>
    </div>
</div>
  )
}
