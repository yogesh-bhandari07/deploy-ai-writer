import React from 'react'

import LoadingGif from "../../Assets/images/Loading2.gif";
function Loading() {
  return (
    <div className='flex justify-center align-middle bg-[#fff] h-screen w-screen'>
        <img src={LoadingGif} className='w-[40rem] h-[40rem]' />

    </div>
  )
}

export default Loading