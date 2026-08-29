import Link from 'next/link'
import React from 'react'

const Logo = () => {
  return (
    <Link href={"/"} className='text-gray-300 font-bold text-xl md:text-2xl lg:text-3xl'>
     Tech<span className='text-orange-400'>Blog</span>
    </Link>
  )
}

export default Logo