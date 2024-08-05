'use client'
import React, { useState } from 'react'
import CourseOptions from './CourseOptions'
import CourseInformations from './CourseInformations'
type Props = {}

const CreateCourse = (props: Props) => {
    const [active, setActive] = useState(0);
    const [prerequisites, setPrerequisites] = useState([{ title: "" }]);
    const [courseContentData, setCourseContentData] = useState([
        {
            videoUrl: "",
            title: "",
            videoSection: "Untiled Section",
            links: [
                {
                    title: "",
                    url: "",
                },
            ],
            suggestion: "",
        }
    ]);

    const [courseData, setCourseData] = useState({});

    return (
        <div className="w-full flex min-h-screen">
            <div className="w-[80%]">
                {
                    active === 0 && (
                        <CourseInformations />
                    )
                }
            </div>
            <div className="h-screen w-[20%] mt-[100px] z-[-1] fixed top-18 right-0">
                <CourseOptions active={active} setActive={setActive} />
            </div>
        </div>
    )
}

export default CreateCourse