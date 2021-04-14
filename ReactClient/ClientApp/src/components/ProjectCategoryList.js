import React, { useState, useEffect } from "react";
import axios from "axios";

const ProjectCategoryList = () => {
   const [ProjectCategoryLists, setProjectCategoryLists] = useState([]);

  useEffect(() => {
    const getProjects = async () => {
      try {
         const { data } = await axios.get(`https://localhost:5001/api/ProjectCategories`);
        setProjectCategoryLists(data);
      } catch (error) {
        console.log(error);
      }
    };
    getProjects();
  }, []);

   return ProjectCategoryLists.map((x) => {
      console.log(ProjectCategoryLists);
    return (
       <option key={x.projectCategoryId} value={x.projectCategoryId}>
          {x.projectCategoryName}
      </option>
    );
  });
};

export default ProjectCategoryList;
