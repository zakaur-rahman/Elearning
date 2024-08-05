import React from 'react'
import Heading from '../utils/Heading'
import AdminSidebar from "../components/admin/sidebar/AdminSidebar"
import AdminProtected from '../hooks/adminProtected'
import SideBar from "../components/admin/sidebar/SideBar"
import DashboardHero from "../components/admin/DashboardHero"


type Props = {}

const page = (props: Props) => {
  return (
    <AdminProtected>
      <div>
        <Heading
          title="Elearning - Admin"
          description="Elearning is a platform for students to learn and get help from teachers"
          keywords="Programming, MERN"
        />
        <div className="flex h-[200vh]">
          <div className=" 1500px:w-[16%] w1/5">
            <SideBar/> 
          </div>
          <div className="w-[85%]">
            <DashboardHero/>
          </div>
        </div>
      </div>
    </AdminProtected>
  )
}

export default page