import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import CourseList from "../components/CourseList";
import ProjectCategoryList from "../components/ProjectCategoryList";
import MembersList from "../components/MembersList";
import { Container, Table } from "react-bootstrap";
import axios from "axios";

const ViewPeeEvaluations = () => {


   const [PeeEvaluations, setPeeEvaluations] = useState([]);


   useEffect(() => {
      const getPeeEvaluations = async () => {
         try {
            const { data } = await axios.get(`https://localhost:5001/api/PeerEvaluation`);
            setPeeEvaluations(data);
            console.log(data);
         } catch (error) {
            console.log(error);
         }
      };
      getPeeEvaluations();
   }, []);

   console.log(PeeEvaluations);
   return (
      <Container>
         <h3>Peer Evaluation</h3>
         

         <Table striped bordered hover className="mt-4">
            <thead>
               <tr>
               
                  <th>Project</th>
                  <th>Evaluated By</th>
                  <th>Member</th>
                  <th>Rating</th>
                  <th>Comment</th>
               </tr>
            </thead>
            <tbody>
               {PeeEvaluations.map((x, i) => {
                  return(
                  <tr>
                     
                        <td>{x.project.course.courseTitle}</td>
                        <td>{x.userEvaluating.firstName + " " + x.userEvaluating.lastName}</td>
                        <td>{x.userBeingEvaluated.firstName + " " + x.userBeingEvaluated.lastName}</td>
                        <td>{x.rating}</td>
                        <td>{x.comments}</td>
                  </tr>
                     )
               })}
            </tbody>
         </Table>
      </Container>
   );



};

export default ViewPeeEvaluations;