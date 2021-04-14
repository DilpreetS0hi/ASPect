import React, { useState, useEffect } from "react";
import axios from "axios";

const ProjectList = () => {
   const [ProjectLists, setProjectLists] = useState([]);

   useEffect(() => {
      const getProjects = async () => {
         try {
            const { data } = await axios.get(`https://localhost:5001/api/Project`);
            setProjectLists(data);
         } catch (error) {
            console.log(error);
         }
      };
      getProjects();
   }, []);

   return ProjectLists.map((x) => {

      return (
         <option key={x.projectId} value={x.projectId}>
            {x.course.courseTitle + ' ' + x.projectCategory.projectCategoryName + ' No of Students: '+ x.memberships.length}
         </option>
      );
   });
};

export default ProjectList;
