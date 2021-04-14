
import React, { useState, useEffect } from "react";
import axios from "axios";

const CourseList = () => {
   const [CourseLists, setCourseLists] = useState([]);

   useEffect(() => {
      const getCourses = async () => {
         try {
            const { data } = await axios.get(`https://localhost:5001/api/Courses`);
            setCourseLists(data);
         } catch (error) {
            console.log(error);
         }
      };
      getCourses();
   }, []);

   return CourseLists.map((CourseList) => {
      console.log(CourseList);
      return (
         <option key={CourseList.courseID} value={CourseList.courseID}>
            {CourseList.courseTitle}
         </option>
      );
   });
};

export default CourseList;
