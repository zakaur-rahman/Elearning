"use client";
import React from 'react';
import { Sidebar, Menu, MenuItem, SubMenu, menuClasses, MenuItemStyles } from 'react-pro-sidebar';
import { SidebarHeader } from './components/SidebarHeader';
import { Diamond } from './icons/Diamond';
import { BarChart } from './icons/BarChart';
import { Global } from './icons/Global';
import { InkBottle } from './icons/InkBottle';
import { Book } from './icons/Book';
import { Calendar } from './icons/Calendar';
import { ShoppingCart } from './icons/ShoppingCart';
import { Service } from './icons/Service';
import { Badge } from './components/Badge';
import { Typography } from './components/Typography';
import Image from 'next/image';
import { Box } from '@mui/material';
import { useSelector } from "react-redux";
import avatar from "../../../../public/assests/client-2.jpg"
import avatarDefault from "../../../../public/assests/client-2.jpg"
import { BsClipboardData } from "react-icons/bs";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import EqualizerSharpIcon from '@mui/icons-material/EqualizerSharp';
import ManageHistorySharpIcon from '@mui/icons-material/ManageHistorySharp';
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import {
    HomeOutlinedIcon,
    PeopleOutlinedIcon,
    ContactsOutlinedIcon,
    ReceiptOutlinedIcon,
    PersonOutlinedIcon,
    CalendarTodayOutlinedIcon,
    HelpOutlineOutlinedIcon,
    BarChartOutlinedIcon,
    PieChartOutlineOutlinedIcon,
    TimelineOutlinedIcon,
    MenuOutlinedIcon,
    MapOutlinedIcon,
    DescriptionOutlinedIcon

} from './Icon'
import Link from 'next/link';



type Theme = 'light' | 'dark';

const themes = {
    light: {
        sidebar: {
            backgroundColor: '#ffffff',
            color: '#607489',
        },
        menu: {
            menuContent: '#fbfcfd',
            icon: '#0098e5',
            hover: {
                backgroundColor: '#c5e4ff',
                color: '#44596e',
            },
            disabled: {
                color: '#9fb6cf',
            },
        },
    },
    dark: {
        sidebar: {
            backgroundColor: '#0b2948',
            color: '#8ba1b7',
        },
        menu: {
            menuContent: '#082440',
            icon: '#59d0ff',
            hover: {
                backgroundColor: '#00458b',
                color: '#b6c8d9',
            },
            disabled: {
                color: '#3e5e7e',
            },
        },
    },
};

// hex to rgba converter
const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const Playground: React.FC = () => {
    const [collapsed, setCollapsed] = React.useState(false);
    const [toggled, setToggled] = React.useState(false);
    const [broken, setBroken] = React.useState(false);
    const [rtl, setRtl] = React.useState(false);
    const [hasImage, setHasImage] = React.useState(false);
    const [theme, setTheme] = React.useState<Theme>('light');
    const { user } = useSelector((state: any) => state.auth)

    // handle on RTL change event
    const handleRTLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRtl(e.target.checked);
    };

    // handle on theme change event
    const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTheme(e.target.checked ? 'dark' : 'light');
    };

    // handle on image change event
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHasImage(e.target.checked);
    };

    const menuItemStyles: MenuItemStyles = {
        root: {
            fontSize: '13px',
            fontWeight: 400,
        },
        icon: {
            color: themes[theme].menu.icon,
            [`&.${menuClasses.disabled}`]: {
                color: themes[theme].menu.disabled.color,
            },
        },
        SubMenuExpandIcon: {
            color: '#b6b7b9',
        },
        subMenuContent: ({ level }) => ({
            backgroundColor:
                level === 0
                    ? hexToRgba(themes[theme].menu.menuContent, hasImage && !collapsed ? 0.4 : 1)
                    : 'transparent',
        }),
        button: {
            [`&.${menuClasses.disabled}`]: {
                color: themes[theme].menu.disabled.color,
            },
            '&:hover': {
                backgroundColor: hexToRgba(themes[theme].menu.hover.backgroundColor, hasImage ? 0.8 : 1),
                color: themes[theme].menu.hover.color,
            },
        },
        label: ({ open }) => ({
            fontWeight: open ? 600 : undefined,
        }),
    };

    return (
        <Sidebar
            collapsed={collapsed}
            toggled={toggled}
            onBackdropClick={() => setToggled(false)}
            onBreakPoint={setBroken}
            rtl={rtl}
            className='h-full rounded-lg dark:border-[#3b3b3bd2]'
            rootStyles={{
                color: themes[theme].sidebar.color,
            }}
        >
            <div className="flex dark:bg-[#111c43] flex-col h-full">
                <div className="flex-1 mb-8" >
                    <SidebarHeader rtl={rtl} collapsed={collapsed} setCollapsed={setCollapsed} className="pb-6 mt-4" />
                    {!collapsed && (
                        <Box mb="25px">
                            <Box display="flex" borderRadius={50} justifyContent="center" alignItems="center">
                                <Image src={user?.avatar || avatar ? user.avatar.url || avatar : avatarDefault} className='border-[2px] mb-2 rounded-full border-[#0098e5]' alt={""} width={80} height={80} />

                            </Box>
                            <Box textAlign="center">
                                <Typography
                                    variant="subtitle2"
                                    fontWeight="bold"
                                >
                                    {user?.name}
                                </Typography>
                                <Typography variant="subtitle2" >
                                    - Admin
                                </Typography>
                            </Box>
                        </Box>
                    )}
                    {/*  <div className="px-6 mb-2">
                        <Typography
                            variant="body2"
                            fontWeight={600}
                            className={`${collapsed ? 'opacity-0' : 'opacity-70'} tracking-wide`}
                        >
                            General
                        </Typography>
                    </div> */}
                    <Menu menuItemStyles={menuItemStyles}>
                        <MenuItem icon={<DashboardOutlinedIcon />}>
                            Dashboard
                        </MenuItem>

                    </Menu>

                    <div className="px-4  mt-2">
                        <Typography
                            variant="body1"
                            fontWeight={700}
                            className={`${collapsed ? 'opacity-0' : 'opacity-100'} tracking-wide`}
                        >
                            Data
                        </Typography>
                    </div>

                    <Menu menuItemStyles={menuItemStyles}>
                        <MenuItem icon={<ContactsOutlinedIcon />} >
                            Users
                        </MenuItem>
                        <MenuItem icon={<DescriptionOutlinedIcon />}>Invoices</MenuItem>
                    </Menu>
                    <div className="px-4  mt-2">
                        <Typography
                            variant="body1"
                            fontWeight={700}
                            className={`${collapsed ? 'opacity-0' : 'opacity-100'} tracking-wide`}
                        >
                            Content
                        </Typography>
                    </div>

                    <Menu menuItemStyles={menuItemStyles}>
                        <Link href="admin/create-course">
                            <MenuItem icon={<VideoCallOutlinedIcon />} >

                                Create Course
                            </MenuItem>
                        </Link>
                        <MenuItem icon={<OndemandVideoOutlinedIcon />}>
                            Live Courses
                        </MenuItem>
                    </Menu>
                    <div className="px-4  mt-2">
                        <Typography
                            variant="body1"
                            fontWeight={700}
                            className={`${collapsed ? 'opacity-0' : 'opacity-100'} tracking-wide`}
                        >
                            Customization
                        </Typography>
                    </div>

                    <Menu menuItemStyles={menuItemStyles}>
                        <MenuItem icon={<SpaceDashboardOutlinedIcon />} >
                            Hero
                        </MenuItem>
                        <MenuItem icon={<QuizOutlinedIcon />}>
                            FAQs
                        </MenuItem>
                        <MenuItem icon={<CategoryOutlinedIcon />}>
                            Categories
                        </MenuItem>
                    </Menu>
                    <div className="px-4  mt-2">
                        <Typography
                            variant="body1"
                            fontWeight={700}
                            className={`${collapsed ? 'opacity-0' : 'opacity-100'} tracking-wide`}
                        >
                            Controllers
                        </Typography>
                    </div>

                    <Menu menuItemStyles={menuItemStyles}>
                        <MenuItem icon={<PeopleOutlinedIcon />} >
                            Manage Team
                        </MenuItem>
                    </Menu>
                    <div className="px-4  mt-2">
                        <Typography
                            variant="body1"
                            fontWeight={700}
                            className={`${collapsed ? 'opacity-0' : 'opacity-100'} tracking-wide`}
                        >
                            Analytics
                        </Typography>
                    </div>

                    <Menu menuItemStyles={menuItemStyles}>
                        <MenuItem icon={<EqualizerSharpIcon />} >
                            Course Analytics
                        </MenuItem>
                        <MenuItem icon={<TimelineOutlinedIcon />} >
                            Orders Analytics
                        </MenuItem>
                        <MenuItem icon={<ManageHistorySharpIcon />} >
                            Users Analytics
                        </MenuItem>
                    </Menu>
                    <div className="px-4  mt-2">
                        <Typography
                            variant="body1"
                            fontWeight={700}
                            className={`${collapsed ? 'opacity-0' : 'opacity-100'} tracking-wide`}
                        >
                            Extras
                        </Typography>
                    </div>

                    <Menu menuItemStyles={menuItemStyles}>
                        <MenuItem icon={<SettingsSharpIcon />} >
                            Settings
                        </MenuItem>
                        <MenuItem icon={<LogoutSharpIcon />} >
                            Logout
                        </MenuItem>
                    </Menu>

                </div>
            </div>
        </Sidebar>


    );
};

export default Playground;
