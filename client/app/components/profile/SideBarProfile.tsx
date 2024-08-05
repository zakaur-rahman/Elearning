import React, { FC } from 'react'
import Image from 'next/image'
import avatarDefault from "../../../public/assests/client-3.jpg"
import { RiLockPasswordLine } from "react-icons/ri"
import { SiCoursera } from "react-icons/si"
import { AiOutlineLogout } from 'react-icons/ai'
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import Link from 'next/link'
type Props = {
    user: any;
    active: number;
    avatar: string | null
    setActive: (active: any) => void;
    logOutHandler: any
}

const SideBarProfile: FC<Props> = ({ user, active, avatar, setActive, logOutHandler }) => {
    return (
        <div className='w-full'>
            <div className={`w-full flex items-center px-3 py-4 cursor-pointer 
                ${active === 1 ? "dark:bg-slate-800 bg-white" : "bg-transparent"} `}
                onClick={() => setActive(1)}
            >
                <Image src={user?.avatar || avatar ? user.avatar.url || avatar : avatarDefault} width={0} height={0} alt=''
                    className='w-[20px] h-[20px] 800px:w-[30px] 800px:h-[30px] cursor-pointer rounded-full ' />
                <h5 className='pl-2 800px:block hidden font-Poppins dark:text-white text-black ' >
                    My Account
                </h5>
            </div>
            <div className={`w-full flex items-center text-black dark:text-white px-3 py-4 cursor-pointer 
                ${active === 2 ? "dark:bg-slate-800 bg-white" : "bg-transparent"} `}
                onClick={() => setActive(2)}
            >
                <RiLockPasswordLine size={20}  />
                <h5 className='pl-2 800px:block hidden font-Poppins dark:text-white text-black ' >
                    Change Password
                </h5>
            </div>
            <div className={`w-full flex items-center text-black dark:text-white px-3 py-4 cursor-pointer 
                ${active === 3 ? "dark:bg-slate-800 bg-white" : "bg-transparent"} `}
                onClick={() => setActive(3)}
            >
                <SiCoursera size={20}  />
                <h5 className='pl-2 800px:block hidden font-Poppins dark:text-white text-black ' >
                    Enrolled Courses
                </h5>
            </div>
            {
                user?.role === "admin" && (
                    <Link className={`w-full flex text-black dark:text-white items-center px-3 py-4 cursor-pointer 
                        ${active === 6 ? "dark:bg-slate-800 bg-white" : "bg-transparent"} `}
                        href={"/admin"}
                    >
                        <MdOutlineAdminPanelSettings size={20}  />
                        <h5 className='pl-2 800px:block hidden font-Poppins dark:text-white text-black ' >
                            Admin Dashboard
                        </h5>
                    </Link>
                )
            }
            <div className={`w-full flex text-black dark:text-white items-center px-3 py-4 cursor-pointer 
                ${active === 4 ? "dark:bg-slate-800 bg-white" : "bg-transparent"} `}
                onClick={() => logOutHandler()}
            >
                <AiOutlineLogout size={20}  />
                <h5 className='pl-2 800px:block hidden font-Poppins dark:text-white text-black ' >
                    Log Out
                </h5>
            </div>

        </div>
    )
}

export default SideBarProfile