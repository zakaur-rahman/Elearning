import { Response } from "express";
import { CatchAssyncError } from "../middleware/catchAssyncErrors";
import CourseModel from "../models/course.model";

export const createCourse = CatchAssyncError(
  async (data: any, res: Response) => {
    const course = await CourseModel.create(data);
    res.status(201).json({ success: true, course });
  }
);


//Get All Courses

export const getAllCoursesService = async (res: Response) => {
  const courses = await CourseModel.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, courses });
};