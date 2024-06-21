import React from 'react'
import { Button } from './ui/button'

const Questions = () => {
  return (
    <>
        <nav className="">
        <a href="#home">
          <img
            src="/logo.svg"
            alt="logo"
            className=" absolute left-[73px] top-10"
          />
        </a>
      </nav>

      <div
        className='
            border-2    
            border-dashed
            flex 
            justify-center
            items-center
            mt-[200px]
        '
      >
        <div    
            className='
                flex flex-col justify-center items-center gap-5
            '
        >
            <h2 className='text-[#97a0af] text-sm'>
                Before we get started, we need to know,
            </h2>
            <h2 className='text-[#344563] text-3xl font-bold'>
                What are you planning to achive with UXmagic?
            </h2>
        </div>
        {/* <div>
            <Button variant='outline' >
                
            </Button>
        </div> */}
      </div>
    </>
  )
}

export default Questions