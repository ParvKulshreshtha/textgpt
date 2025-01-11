"use client"

import React from 'react'
import { BiSolidMessageSquareEdit } from 'react-icons/bi'

const Navigation = () => {
  return (
    <div className='shadow-md w-screen absolute py-4 px-6 flex justify-between z-10 bg-offwhite'>
      <div>
      <BiSolidMessageSquareEdit onClick={()=>window.location.reload()} className='h-full fill-darkgrey hover:fill-mediumgrey cursor-pointer' size={20} />
      </div>
      <div>
        <button disabled={true} className='bg-darkgrey hover:bg-mediumgrey text-offwhite px-4 py-1 rounded-full text-sm'>Log In</button>
      </div>
    </div>
  )
}

export default Navigation
