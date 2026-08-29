"use client"
import Link from "next/link";
import MobileNav from "./MobileNav";
import { useState } from "react";
import Logo from "./Logo";
import { LuMenu, LuNotebookPen, LuSearch, LuX } from "react-icons/lu";
import { useModalStore } from "@/store/useModalStore";
import { authClient } from "@/lib/auth-client";

export const navLink=[
    {url:"/", label:"Home"},
    {url:"/articles", label:"Article"},
    {url:"/about", label:"About"},
];


export default function Navbar(){
    const {openSearch, openSignIn}=useModalStore();
    const [openMenu, setOpenMenu]=useState(false);

    const {data:session, isPending}=authClient.useSession();
    const handleLogOut=async ()=>{
    await authClient.signOut();
   }


    return(
        <nav className="h-18 fixed top-0 left-0 z-50 backdrop-blur-md backdrop-saturate-50 w-full ">
          <div className="flex items-center justify-between h-full w-[90%] mx-auto">
            {/* logo */}
               <Logo/>
            {/* nablink */}
            <ul className="flex items-center gap-4 md:gap-8 text-gray-400 font-semibold">
                <li className="cursor-pointer flex items-center gap-1" onClick={openSearch}>
                    <LuSearch size={20} />
                    <span className="hidden md:block">Search</span>
                </li>
                {
                    session && (
                         <li className="cursor-pointer flex items-center gap-1 ">
                    <LuNotebookPen size={20} />
                    <Link href={"/write"} className="hidden md:block">Write</Link>
                </li>
                    )
                }
               
               {
                navLink.map((link)=>{
                    return(
                        <li key={link.url} className="hidden md:block hover:text-gray-200">
                            <Link href={link.url}>{link.label}</Link>
                        </li>
                    )
                })
               }
               
                <>
               {!isPending && (
                <> 
                {session ? (
                    <li onClick={handleLogOut} className="bg-amber-300 text-orange-800 px-3 lg:px-5 py-2 rounded-full cursor-pointer hover:bg-amber-400 transition-colors">
                        LogOut
                    </li>
                ) : (
                    <li onClick={openSignIn} className="bg-amber-300 text-orange-800 px-3 lg:px-5 py-2 rounded-full cursor-pointer hover:bg-amber-400 transition-colors">
                        Login
                    </li>
                )}
                </>
               )}
               </>

              
               <li className="cursor-pointer md:hidden z-80" onClick={()=>setOpenMenu(!openMenu)}>
                {openMenu? <LuX size={25}/> : <LuMenu size={25} />}
               </li>
            </ul>
          </div>
          <MobileNav openMenu={openMenu} setOpenMenu={setOpenMenu} />
        </nav>
    )
}