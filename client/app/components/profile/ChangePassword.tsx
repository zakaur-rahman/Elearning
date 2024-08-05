import { styles } from '@/app/styles/style';
import { useUpdatePasswordMutation } from '@/redux/features/user/userApi';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Props = {};

const initialPassword = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
};

const ChangePassword = (props: Props) => {
    const [password, setPassword] = useState(initialPassword);
    const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword({ ...password, [e.target.name]: e.target.value });
    };

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { confirmPassword, newPassword, oldPassword } = password;
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
        } else {
            await updatePassword({ newPassword, oldPassword });
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success("Password updated successfully!");
        }
        if (error && "data" in error) {
            const errorData = error as any;
            toast.error(errorData.data.message);
        }
    }, [isSuccess, error]);

    return (
        <div className='w-full pl-7 px-2 800px:px-5 800px:pl-0'>
            <h1 className="block text-[25px] font-[500] text-black dark:text-[#fff] 800px:text-[30px] text-center font-Poppins pb-2">
                Change Password
            </h1>
            <div className="w-full">
                <form onSubmit={handleChangePassword} className='flex flex-col items-center'>
                    <div className="w-[100%] 800px:w-[60%] mt-5">
                        <label className="block text-black dark:text-[#fff] pb-2">Enter your old password</label>
                        <input
                            type="password"
                            name='oldPassword'
                            onChange={handleInputChange}
                            value={password.oldPassword}
                            className={`${styles.input} w-full mb-4 800px:mb-0`} />
                    </div>
                    <div className="w-[100%] 800px:w-[60%] mt-5">
                        <label className="block text-black dark:text-[#fff] pb-2">Enter your new password</label>
                        <input
                            type="password"
                            name='newPassword'
                            onChange={handleInputChange}
                            value={password.newPassword}
                            className={`${styles.input} w-full mb-4 800px:mb-0`} />
                    </div>
                    <div className="w-[100%] 800px:w-[60%] mt-5">
                        <label className="block text-black dark:text-[#fff] pb-2">Confirm your new password</label>
                        <input
                            type="password"
                            name='confirmPassword'
                            onChange={handleInputChange}
                            value={password.confirmPassword}
                            className={`${styles.input} w-full mb-4 800px:mb-0`} />
                        <input
                            className={`w-full h-[40px] border border-[#37a39a] text-center text-black dark:text-[#fff] rounded-[3px] mt-8 cursor-pointer`}
                            type="submit"
                            value="Update"
                            required />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
