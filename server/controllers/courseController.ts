import { Request, Response, NextFunction } from "express";
import { CatchAssyncError } from "../middleware/catchAssyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse, getAllCoursesService } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../database/redis";
import mongoose from "mongoose";
import path from "path";
import sendMail from "../mails/sendMail";
import ejs from "ejs";
import NotificationModel from "../models/notification.model";

export const uploadCourse = CatchAssyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      createCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const editCourse = CatchAssyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;

      if (thumbnail) {
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      const courseId = req.params.id;
      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        { new: true }
      );
      console.log(courseId);

      res.status(201).json({ success: true, course });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get single course --without purchasing
export const getSingleCourse = CatchAssyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      const isCacheExist = await redis.get(courseId);

      if (isCacheExist) {
        const course = JSON.parse(isCacheExist);
        res.status(201).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(req.params.id).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links"
        );
        await redis.set(courseId, JSON.stringify(course), 'EX', 604800); //7days expiry
        res.status(201).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get All course --without purchasing
export const getAllCourse = CatchAssyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCacheExist = await redis.get("allCourses");

      if (isCacheExist) {
        const courses = JSON.parse(isCacheExist);
        res.status(200).json({
          success: true,
          courses,
        });
      } else {
        const courses = await CourseModel.find().select(
          "-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links"
        );
        await redis.set("allCourses", JSON.stringify(courses));
        res.status(201).json({
          success: true,
          courses,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get course content by user -- only for valid user
export const getCourseByUser = CatchAssyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = await (req as any).user?.courses;
      const courseId = req.params.id;

      const courseExist = userCourseList?.find((course: any) => {
        course._id.toString() === courseId;
      });

      if (!courseExist) {
        return next(
          new ErrorHandler("You are not eligible to access this course", 404)
        );
      }
      const course = await CourseModel.findById(courseId);
      const content = course?.courseData;
      res.status(200).json({
        success: true,
        content,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Add questions in course
interface IAddQuestion {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = CatchAssyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestion = req.body;
      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 404));
      }

      const courseContent = course?.courseData?.find((item: any) => {
        item._id.equals(contentId);
      });

      //create a new question object
      const newQuestion: any = {
        user: (req as any).user,
        question,
        questionReplies: [],
      };

      //add this question to courses
      courseContent?.questions.push(newQuestion);

      await NotificationModel.create({
        user: (req as any).user?._id,
        title: "New Question",
        message: `You have a new question from ${courseContent?.title}`,
      });

      //save the updated course
      await course?.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add answer in course question
interface IAddQuestion {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addAnswer = CatchAssyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, questionId, courseId, contentId }: IAddQuestion =
        req.body;
      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 404));
      }

      const courseContent = course?.courseData?.find((item: any) => {
        item._id.equals(contentId);
      });

      if (!courseContent) {
        return next(new ErrorHandler("Invalid content id", 404));
      }

      const question = courseContent?.questions?.find((item: any) =>
        item._id.equals(questionId)
      );

      if (!question) {
        return next(new ErrorHandler("Invalid Question Id", 404));
      }

      // Create a new answer object
      const newAnswer: any = {
        user: (req as any).user,
        answer,
      };

      // Add this  answer to our course
      question.questionReplies.push(newAnswer);
      await course?.save();

      if ((req as any).user?._id === question.user._id) {
        // create a notification
        await NotificationModel.create({
          user: (req as any).user?._id,
          title: "New Question Reply received",
          message: `You have a new question reply from ${courseContent?.title}`,
        });
      } else {
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };

        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/questionReply.ejs"),
          data
        );
        try {
          await sendMail({
            email: question.user.email,
            subject: "Question Reply",
            template: "questionReply.ejs",
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
      }
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//Add review in course
interface IAddReview {
  review: string;
  rating: number;
  userId: string;
}

export const addCourseReview = CatchAssyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = (req as any).user?.courses;
      const courseId = req.params.id;

      const courseExist = userCourseList?.some((course: any) => {
        course._id.toString === courseId.toString();
      });

      if (!courseExist) {
        return next(
          new ErrorHandler("You are not eligible to access this couorse", 404)
        );
      }

      const course = await CourseModel.findById(courseId);

      const { review, rating } = req.body as IAddReview;

      const reviewData: any = {
        user: req.body,
        rating,
        Comment: review,
      };
      course?.reviews.push(reviewData);

      let avg = 0;
      course?.reviews.forEach((rev: any) => {
        avg += rev.rating;
      });

      if (course) {
        course.ratings = avg / course.reviews.length;
      }
      await course?.save();

      const notification = {
        title: "New Review Received",
        message: `${
          (req as any).user?.name
        } has given a  review on your course ${course?.name}`,
      };

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

interface IAddReviewData {
  comment: string;
  courseId: string;
  reviewId: string;
}

export const addReplyToReview = CatchAssyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId } = req.body as IAddReviewData;

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const review = course?.reviews?.find((rev: any) => {
        rev._id.toString() === reviewId;
      });

      if (!review) {
        return next(new ErrorHandler("Review not found", 404));
      }

      const replyData: any = {
        user: (req as any).user,
        comment,
      };

      if (!review.commentReplies) {
        review.commentReplies = [];
      }
      review.commentReplies?.push(replyData);

      await course?.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get all courses --only for Admin
export const getAllCourses = CatchAssyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllCoursesService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Delete course --- only admin
export const deleteCourse = CatchAssyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const course = await CourseModel.findById(id);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      await course.deleteOne({id});
      await redis.del(id);

      res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      });
      
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);