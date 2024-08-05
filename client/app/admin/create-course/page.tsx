'use client'
import React from 'react'
import SideBar from '../../components/admin/sidebar/SideBar'
import Heading from '../../utils/Heading'
import CreateCourse from '../../components/admin/course/CreateCourse'
import DashboardHeader from '@/app/components/admin/DashboardHeader'
type Props = {}

const page = (props: Props) => {
  return (
    <div>
      <Heading title='Elearning' description='' keywords=''/>
      <div className="flex">
      <div className=" 1500px:w-[16%] w1/5">
            <SideBar/> 
          </div>
          <div className="w-[85%]">
            <DashboardHeader/>
          </div>
      </div>
    </div>
  )
}

export default page