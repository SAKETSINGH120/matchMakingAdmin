import { useEffect } from "react";
import { getCourses, getCoursesConfig } from "../Services/CounsellorApi";
import { useState } from "react";
import toast from "react-hot-toast";

export const useFetchUniqueCourses = () => {
  const [courses, setCourses] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);

  useEffect(() => {
    const fetchCoursesList = async () => {
      try {
        const courseRes = await getCourses();
        if (
          courseRes?.status &&
          Array.isArray(courseRes.data) &&
          courseRes.data.length > 0
        ) {
          setCourses(courseRes.data);
          setCourseOptions(
            courseRes.data.map((item) => ({ value: item, label: item }))
          );
        } else {
          toast.error("Failed to fetch course data");
        }
      } catch (error) {
        toast.error("Error fetching data: " + error.message);
      }
    };

    fetchCoursesList();
  }, []);

  return { courses, courseOptions };
};

export const useFetchUniqueCoursesConfig = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCoursesList = async () => {
      try {
        const courseRes = await getCoursesConfig();
        if (
          courseRes?.status &&
          Array.isArray(courseRes.data) &&
          courseRes.data.length > 0
        ) {
          setCourses(courseRes.data);
        } else {
          toast.error("Failed to fetch course data");
        }
      } catch (error) {
        toast.error("Error fetching data: " + error.message);
      }
    };

    fetchCoursesList();
  }, []);

  return { courses };
};
