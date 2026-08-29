import React from 'react'
import { navLink } from './Navbar'
import Link from 'next/link'
interface MenuProps{
    setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>,
    openMenu: boolean
}
const MobileNav = ({openMenu, setOpenMenu}:MenuProps) => {
  return (
    <div className='md:hidden'>
        <div className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300  ${openMenu?"opacity-100": "opacity-0 pointer-events-none"}`} />
        <ul className={`fixed top-18 z-50 right-0 h-[80vh] w-full flex flex-col items-center justify-center gap-10 bg-black/30 backdrop-blur-xl border-t border-white/10 transition-transform duration-500 ease-in-out ${openMenu? "translate-x-0":"translate-x-full"} `}>
            {navLink.map((link)=>{
                return(
                    <li key={link.url}>
                        <Link href={link.url} onClick={()=>setOpenMenu(false)} className='tet-xl font-semibold tracking-wide text-gray-200 hover:text-orange-600-400 transition-colors' > {link.label} </Link>
                    </li>
                )
            })}
        </ul>
    </div>
  )
}

export default MobileNav