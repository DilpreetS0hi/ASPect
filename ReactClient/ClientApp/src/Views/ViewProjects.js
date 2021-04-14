import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import CourseList from "../components/CourseList";
import ProjectCategoryList from "../components/ProjectCategoryList";
import MembersList from "../components/MembersList";
import { Container, Table } from "react-bootstrap";
import axios from "axios";

const ViewProjects = () => {


   const [projects, setProjects] = useState([]);


   useEffect(() => {
      const getProjects = async () => {
         try {
            const { data } = await axios.get(`https://localhost:5001/api/Project`);
            setProjects(data);
         } catch (error) {
            console.log(error);
         }
      };
      getProjects();
   }, []);

   console.log(projects);
   return (
      <Container>
         <h3>Project View</h3>
         

         <Table striped bordered hover className="mt-4">
            <thead>
               <tr>
                  <th>#</th>
                  <th>Course</th>
                  <th>Project Category Date</th>
                  <th>Memeber</th>
               </tr>
            </thead>
            <tbody>
               {projects.map((x, i) => {
                  return(
                  <tr>
                     <td>{i+1}</td>
                     <td>{x.course.courseTitle}</td>
                     <td>{x.projectCategory.projectCategoryName}</td>
                        <td>{x.memberships.map((l, j) => { 
                        return(<>
                           { l.student.firstName + ' ' + l.student.lastName }
                           <br /></>)
                        })}</td>
                  </tr>
                     )
               })}
            </tbody>
         </Table>
      </Container>
   );



};

export default ViewProjects;