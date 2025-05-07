// src/data/courseDetailsData.ts

import { Lesson } from "./LessonListItem";

export interface CourseDetail {
  id: string;
  title: string;
  videoPreviewUrl?: any; // For the main image/video thumbnail
  imageUrl: any; // Fallback or general image
  duration: string;
  lessonCount: number;
  rating: number;
  ratingCount: string; // e.g., "(753)"
  studentCount: string; // e.g., "2K students"
  shortDescription: string;
  aboutCourse: string;
  price: string;
  lessons?: Lesson[];
}

// In a real app, you'd check against a user's purchased courses
export const MOCK_PURCHASED_COURSE_IDS = ['courseCrypto101'];


export const allCourseDetailsData: CourseDetail[] = [
  {
    id: "courseCrypto101",
    title: "Introduction to Cryptocurrency",
    // Use a specific image for the video preview if available
    videoPreviewUrl: require("../../../../assets/Images/dummy1.png"), // REPLACE with your image
    imageUrl: require("../../../../assets/Images/dummy1.png"), // REPLACE (used for lesson thumbs too)
    duration: "1 hour 30 min",
    lessonCount: 12,
    rating: 4.7,
    ratingCount: "(753)",
    studentCount: "2K students",
    shortDescription:
      "Lectus vitae lorem luctus mostie vitae mbi curabitur magna facilisis turpis nullam nibh gfas ultricies purus molestie quis imperdiet id agger adipiscing molestie auctor arcu ium atd eget faucibus quis id!",
    aboutCourse:
      "Ipsum quam imperdiet mollis massa bibendum odio vitae in vehicula augue ullamcorper eget a ultrices amet amet, arcu at sem et egestassaf a facilisi a, diam integer velit, sed gravida sed eu.\n\nTilamcorper eget a ultrices amet amet, arcu at sem et egestassaf a facilisi a, diam integer velit, sed gravida sed eu.",
    price: "₹9999/-",
    lessons: [
      { id: "L1", title: "Introduction to Cryptocurrency", lessonNumber: 1, thumbnailUrl: require("../../../../assets/Images/dummy1.png") },
      { id: "L2", title: "How Crypto Works on Blockchain", lessonNumber: 2, thumbnailUrl: require("../../../../assets/Images/dummy1.png") },
      { id: "L3", title: "Distributed Ledger Technology", lessonNumber: 3, thumbnailUrl: require("../../../../assets/Images/dummy1.png") },
      { id: "L4", title: "Decentralization Explained", lessonNumber: 4, thumbnailUrl: require("../../../../assets/Images/dummy1.png") },
      { id: "L5", title: "Smart Contracts", lessonNumber: 5, thumbnailUrl: require("../../../../assets/Images/dummy1.png") },
      { id: "L6", title: "How Ethereum Blockchain Works", lessonNumber: 6, thumbnailUrl: require("../../../../assets/Images/dummy1.png") },
      // ... more lessons
    ],
  },
  {
    id: "courseMarketing202",
    title: "Advanced Digital Marketing",
    videoPreviewUrl: require("../../../../assets/Images/dummy1.png"), // REPLACE
    imageUrl: require("../../../../assets/Images/dummy1.png"), // REPLACE
    duration: "5 hours",
    lessonCount: 25,
    rating: 4.9,
    ratingCount: "(1.2K)",
    studentCount: "5K students",
    shortDescription: "Master advanced digital marketing techniques to boost your career or business.",
    aboutCourse: "This comprehensive course covers SEO, SEM, content marketing, social media strategy, email automation, and analytics. Learn from industry experts with real-world case studies and hands-on projects.",
    price: "₹14999/-",
    // No lessons array here, or an empty one, to simulate not purchased or different content
  },
];