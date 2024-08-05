"use client";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import NavItems from "../components/NavItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import CustomModal from "../utils/CustomModal"
import Login from "../components/Route/Auth/Login";
import SignUp from "../components/Route/Auth/SignUp";
import Verification from "../components/Route/Auth/Verification";
import { useSelector } from "react-redux";
import Image from "next/image";
import avatar from "../../public/assests/client-1.jpg"
import { useSession } from "next-auth/react";
import { useLogOutQuery, useSocialAuthMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";


type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    activeItem: number;
    route: string;
    setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ activeItem, setOpen, route, open, setRoute }) => {
    const [active, setActive] = useState(false);
    const [openSideBar, setOpenSidebar] = useState(false);
    const { user } = useSelector((state: any) => state.auth)
    const { data } = useSession()
    const [socialAuth, { isSuccess, error }] = useSocialAuthMutation();
    const [logout, setLogOut] = useState(false)

    const { } = useLogOutQuery(undefined, {
        skip: !logout ? true : false
    })

    useEffect(() => {
        if (!user) {
            if (data) {
                socialAuth({
                    email: data?.user?.email,
                    name: data?.user?.name,
                    avatar: data?.user?.image
                })
            }
        }

        if (data === null) {
            if (isSuccess) {
                toast.success("Login successfull")
            }
        }

        if (data === null) {
            setLogOut(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, user])


    if (typeof window !== "undefined") {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 80) {
                setActive(true);
            } else {
                setActive(false);
            }
        });
    }

    const handleClose = (e: any) => {
        if (e.target.id === "screen") {
            setOpenSidebar(false);
        }
    };

    return (
        <div className="w-full relative">
            <div
                className={`${active
                    ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition-500"
                    : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"
                    }`}
            >
                <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
                    <div className="w-full h-[80px] flex items-center justify-between p-3">
                        <div>
                            <Link
                                href={"/"}
                                className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}
                            >
                                Elearning
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <NavItems activeItems={activeItem} isMobile={false} />
                            <ThemeSwitcher />
                            {/*Only for mobile*/}
                            <div className="800px:hidden">
                                <HiOutlineMenuAlt3
                                    size={25}
                                    className="cursor-pointer dark:text-white text-black"
                                    onClick={() => setOpenSidebar(true)}
                                />
                            </div>
                            {user ? (
                                <Link href={"/profile"}>
                                    <Image className="w-[25px] h-[25px] rounded-full cursor-pointer "
                                        src={user.avatar || avatar ? user.avatar.url : avatar}
                                        width={0}
                                        height={0}
                                        alt={""}
                                        style={{ border: activeItem === 5 ? "2px solid #ffc107" : "" }} />
                                </Link>
                            ) : (
                                <HiOutlineUserCircle
                                    size={25}
                                    className="cursor-pointer hidden 800px:block dark:text-white text-black"
                                    onClick={() => setOpen(true)}
                                />
                            )}
                        </div>
                    </div>
                </div>
                {/*Mobile Sidebar*/}
                {openSideBar && (
                    <div
                        className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024] "
                        onClick={handleClose}
                    >
                        <div className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0 ">
                            <NavItems activeItems={activeItem} isMobile={true} />
                            <HiOutlineUserCircle
                                size={25}
                                className="cursor-pointer ml-5 my-2 dark:text-white text-black"
                                onClick={() => setOpen(true)}
                            />
                            <br />
                            <br />
                            <br />
                            <p className="text-[16px] px-2 pl-5 text-black dark:text-white ">
                                Copyright  &copy; {new Date().getFullYear()} Elearnning. All rights reserved.
                            </p>
                        </div>
                    </div>
                )}
            </div>
            {
                route === "Login" && (
                    <>
                        {open && (
                            <CustomModal
                                open={open}
                                setOpen={setOpen}
                                setRoute={setRoute}
                                activeItem={activeItem}
                                component={Login}
                            />
                        )}
                    </>
                )
            }
            {
                route === "Sign-Up" && (
                    <>
                        {open && (
                            <CustomModal
                                open={open}
                                setOpen={setOpen}
                                setRoute={setRoute}
                                activeItem={activeItem}
                                component={SignUp}
                            />
                        )}
                    </>
                )
            }
            {
                route === "Verification" && (
                    <>
                        {open && (
                            <CustomModal
                                open={open}
                                setOpen={setOpen}
                                setRoute={setRoute}
                                activeItem={activeItem}
                                component={Verification}
                            />
                        )}
                    </>
                )
            }
        </div>
    );
};

export default Header;
