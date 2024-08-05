import Image from "next/image"
import { styles } from "@/app/styles/style"
import React, { FC, useEffect, useState } from "react"
import { AiOutlineCamera } from "react-icons/ai"
import avatarDefault from "../../../public/assests/client-1.jpg"
import { useEditProfileMutation, useUpdateAvatarMutation } from "@/redux/features/user/userApi"
import { useLoadUserQuery } from "@/redux/features/api/apiSlice"
import toast from "react-hot-toast"
type Props = {
    avatar: string | null;
    user: any
}

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
    const [name, setName] = useState(user && user.name);
    const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
    const [loadUser, setLoadUser] = useState(false);
    const [editProfile, { isSuccess: success, error: isError }] = useEditProfileMutation()
    const { } = useLoadUserQuery(undefined, { skip: loadUser ? false : true })

    const imageHandler = async (e: any) => {
        const fileReader = new FileReader();

        fileReader.onload = () => {
            if (fileReader.readyState === 2) {
                const avatar = fileReader.result
                updateAvatar(
                    avatar
                )
            }
        }
        fileReader.readAsDataURL(e.target.files[0]);
    }
    useEffect(() => {
        if (isSuccess || success) {
            setLoadUser(true)
            toast.success("Profile updated successfully!")
        }
        if (error || isError) {
            console.log(error);
        }
    }, [isSuccess, error, success, isError])


    const handleSubmit = async (e: any) => {
        e.preventDefault()
        if (name !== "") {
            await editProfile({ name })

        }
    }
    return (
        <>
            <div className="w-full flex justify-center">
                <div className=" relative ">
                    <Image src={user?.avatar || avatar ? user.avatar.url || avatar : avatarDefault} alt={""} width={0} height={0}
                        className=" w-[120px] h-[120px] cursor-pointer border-[3px] border-[#37a39a] rounded-full " />
                    <input type="file" id="avatar" name="" className="hidden" onChange={imageHandler} accept="/image/png,image/jpg,image/jpeg,/image/webp" />

                    <label htmlFor="avatar">
                        <div className=" w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer">
                            <AiOutlineCamera size={20} className=" z-1" />
                        </div>
                    </label>
                </div>
            </div>
            <br />
            <br />
            <div className="w-full pl-6 800px:pl-10">
                <form onSubmit={handleSubmit}>
                    <div className="800px:w-[50%] m-auto block pb-4">
                        <div className="w-[100%]" >
                            <label className="block text-black dark:text-white pb-2"> Full Name</label>
                            <input
                                name="name"
                                type="text"
                                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <br />
                        <div className="w-[100%]" >
                            <label className="block text-black dark:text-white pb-2"> Email Address</label>
                            <input
                                type="text"
                                name="email"
                                className={`${styles.input} !w-[95%] mb-1 800px:mb-0`}
                                required
                                value={user?.email}
                            />
                        </div>
                        <input type="submit" required value="Update" className={`w-full 800px:w-[250px] h-[40px] border border-[#37a39a] text-center dark:text-[#fff] text-black rounded-[3px] mt-8 cursor-pointer`} />
                    </div>
                </form>
                <br />
            </div>
        </>
    )
}

export default ProfileInfo