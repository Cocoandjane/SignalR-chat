import React, { useEffect, useRef } from 'react'
interface Props {
  message: any;
  name: string;
  

}
export default function MyMessages({ message, name }: Props) {

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
       className="col-start-6 col-end-13 p-3 rounded-lg">
      <div className="flex items-center justify-start flex-row-reverse">
        <div
          className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
        >
          {name[0].toUpperCase()}
        </div>
        <div
          className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl"
        >
          <div>{message.message}</div>
        </div>
      </div>
    </div>
  )
}
