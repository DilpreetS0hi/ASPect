import axios from "axios";
import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { useHistory } from "react-router";
import { LinkContainer } from "react-router-bootstrap";

export const Dashboard = ({ studentId }) => {
  const authenticated =
    localStorage.getItem("id") &&
    localStorage.getItem("token") &&
    localStorage.getItem("expiration")
      ? true
      : false;

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    userName: "",
  });

  const history = useHistory();

  if (authenticated) {
    console.log("logged in");
  } else {
    console.log("not logged in");
    history.push("/login");
  }

  const config = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    },
  };

  useEffect(() => {
    if (studentId !== null) {
      const getUserInfo = async () => {
        const { data } = await axios.get(`/api/Student/${studentId}`);
        console.log(data);
        const { firstName, lastName, userName } = data;
        setUserInfo({
          firstName: firstName,
          lastName: lastName,
          userName: userName,
        });
      };
      getUserInfo();
    }
  }, [studentId]);

  const { firstName, lastName, userName } = userInfo;

  return (
    <Container>
      <h3>Dashboard</h3>
      <p className="mt-4 ml-2">
        Hello, <strong>{`${firstName} ${lastName}`}.</strong>
      </p>
      <p className="mt-4 ml-2">
        Your email address: <em>{userName}</em>.
      </p>

     
        <LinkContainer to="/view-project">
           <Button className="my-2 mx-2">View Projects</Button>
        </LinkContainer>
      <LinkContainer to="/create-project">
        <Button className="my-2 mx-2">Create Project</Button>
      </LinkContainer>

      <LinkContainer to="/edit-student">
        <Button className="my-2 mx-2">Edit Student Info</Button>
      </LinkContainer>

      <LinkContainer to="/peer-evaluation">
        <Button className="my-2 mx-2">Peer Evaluation</Button>
        </LinkContainer>
        <LinkContainer to="/view-peerevaluation">
           <Button className="my-2 mx-2">View Evaluation</Button>
        </LinkContainer>
    </Container>
  );
};
