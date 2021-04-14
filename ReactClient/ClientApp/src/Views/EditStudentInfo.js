import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useFormik, FormikProvider, Form } from "formik";
import { Button, Alert, Row } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import TextInputLiveFeedback from "../components/TextInputLiveFeedback";
import { nameRegex, emailRegex, passwordRegex } from "../util/regex";
import bcrypt from "bcryptjs";
import axios from "axios";

const schema = Yup.object({
  // email: Yup.string()
  //   .required("Email is required")
  //   .matches(emailRegex, "Invalid"),
  firstname: Yup.string()
    .min(2, "Must be at least 2 characters")
    .max(20, "Must be less than 20 characters")
    .required("First name is required")
    .matches(nameRegex, "Invalid"),
  lastname: Yup.string()
    .min(2, "Must be at least 2 characters")
    .max(20, "Must be less than 20 characters")
    .required("Last name is required")
    .matches(nameRegex, "Invalid"),
  // password: Yup.string()
  //   .min(8, "Must be at least 8 characters")
  //   .max(20, "Must be less than 20 characters")
  //   .required("Password is required")
  //   .matches(passwordRegex, "Invalid"),
  // confirmPassword: Yup.string()
  //   .min(8, "Must be at least 8 characters")
  //   .max(20, "Must be less than 20 characters")
  //   .required("Confirm password is required")
  //   .matches(passwordRegex, "Invalid")
  //   .when("password", {
  //     is: (val) => (val && val.length > 0 ? true : false),
  //     then: Yup.string().oneOf([Yup.ref("password")], "Passwords do not match"),
  //   }),
});

const config = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
};

const EditStudentInfo = ({ studentId }) => {
  const history = useHistory();
  const authenticated =
    localStorage.getItem("id") &&
    localStorage.getItem("token") &&
    localStorage.getItem("expiration")
      ? true
      : false;

  if (authenticated) {
    // console.log("logged in");
  } else {
    // console.log("not logged in");
    history.push("/login");
  }

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (studentId !== null) {
      const getUserInfo = async () => {
        await axios
           .get(`https://localhost:5001/api/Student/${studentId}`)
          .then((res) => {
            const { firstName, lastName, userName } = res.data;
            setUserInfo({
              firstName: firstName,
              lastName: lastName,
              userName: userName,
            });
          });
      };
      getUserInfo();
    }
  }, [studentId]);

  const { firstName, lastName, userName } = userInfo;
  // console.log(userInfo);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: userName,
      userName: userName,
      normalizedUserName: "",
      normalizedEmail: "",
      firstname: firstName,
      lastname: lastName,
      password: "",
      confirmPassword: "",
      emailConfirmed: true,
      passwordHash: localStorage.getItem("hashPassword"),
    },
    onSubmit: async (values) => {
      values.id = studentId;
      values.email = userName;
      values.userName = values.email;
      values.firstname =
        values.firstname.charAt(0).toUpperCase() + values.firstname.slice(1);
      values.lastname =
        values.lastname.charAt(0).toUpperCase() + values.lastname.slice(1);
      values.normalizedUserName = values.email.toUpperCase();
      values.normalizedEmail = values.email.toUpperCase();
      // const passwordHash = await bcrypt.hash(values.password, 10);
      // values.passwordHash = passwordHash;
      console.log(values);

      try {
        await axios.put(
          `https://localhost:5001/api/Student/${studentId}`,
          values,
          config
        );
        history.push("/dashboard");
        console.log("saved changes");
      } catch (error) {
        console.log(error);
      }
    },
    validationSchema: schema,
  });

  return (
    <FormikProvider value={formik}>
      <FormContainer>
        <Row className="text-center">
          <h1 className="mb-4 mx-auto">Edit Student Info</h1>
        </Row>
        <p>Email: {userName}</p>

        {error && showAlert && (
          <Alert
            variant="danger"
            onClose={() => setShowAlert(false)}
            dismissible
          >
            {error}
          </Alert>
        )}

        <Form>
          {/* <TextInputLiveFeedback
            label="Email"
            id="email"
            name="email"
            type="email"
          /> */}

          <TextInputLiveFeedback
            label="First Name"
            id="firstname"
            name="firstname"
            type="text"
          />

          <TextInputLiveFeedback
            label="Last Name"
            id="lastname"
            name="lastname"
            type="text"
          />

          {/* <TextInputLiveFeedback
            label="New Password"
            id="password"
            name="password"
            type="password"
          />

          <TextInputLiveFeedback
            label="New Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
          />

          <Row className="text-center">
            <p className="mx-4 text-left" style={{ fontSize: "0.75rem" }}>
              Password must conatin 8-20 characters, at least 1 numeric
              character, at least 1 lowercase letter, at least 1 uppercase
              letter, and at least 1 special character.
            </p>
          </Row> */}

          <Button type="submit" variant="primary" block className="rounded">
            Save Changes
          </Button>

          <LinkContainer to="/dashboard">
            <Button variant="light" block className="rounded">
              <u>Cancel</u>
            </Button>
          </LinkContainer>
        </Form>
      </FormContainer>
    </FormikProvider>
  );
};

export default EditStudentInfo;
