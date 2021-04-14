import React from "react";
import { Container, Table } from "react-bootstrap";
import { useHistory } from "react-router";

const ProjectStatus = () => {
  const authenticated =
    localStorage.getItem("id") &&
    localStorage.getItem("token") &&
    localStorage.getItem("expiration")
      ? true
      : false;

  const history = useHistory();

  if (authenticated) {
    console.log("logged in");
  } else {
    console.log("not logged in");
    history.push("/login");
  }

  return (
    <Container>
      <h3>Project Status</h3>
      <div className="mt-3">
        <p>Project Name: sample project</p>
        <p>Project Category: sample project category</p>
      </div>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Task</th>
            <th>Created Date</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Task A</td>
            <td>2021-01-01</td>
            <td>2021-01-11</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Task B</td>
            <td>2021-01-06</td>
            <td>2021-02-01</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Task C</td>
            <td>2021-01-22</td>
            <td>2021-02-15</td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
};

export default ProjectStatus;
