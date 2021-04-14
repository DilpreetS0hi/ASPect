import React, { useState } from "react";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { useFormik, FormikProvider, Form } from "formik";
import { Button, Alert, Row } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import TextInputLiveFeedback from "../components/TextInputLiveFeedback";
import { nameRegex, emailRegex, passwordRegex } from "../util/regex";
import bcrypt from "bcryptjs";
import axios from "axios";
import url from "../config";

const schema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .matches(emailRegex, "Invalid"),
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
  password: Yup.string()
    .min(8, "Must be at least 8 characters")
    .max(20, "Must be less than 20 characters")
    .required("Password is required")
    .matches(passwordRegex, "Invalid"),
  confirmPassword: Yup.string()
    .min(8, "Must be at least 8 characters")
    .max(20, "Must be less than 20 characters")
    .required("Confirm password is required")
    .matches(passwordRegex, "Invalid")
    .when("password", {
      is: (val) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf([Yup.ref("password")], "Passwords do not match"),
    }),
});

const config = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
};

const Signup = () => {
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      email: "",
      userName: "",
      normalizedUserName: "",
      normalizedEmail: "",
      firstname: "",
      lastname: "",
      password: "",
      confirmPassword: "",
      emailConfirmed: true,
      passwordHash: "",
    },
    onSubmit: async (values) => {
      values.userName = values.email;
      values.firstname =
        values.firstname.charAt(0).toUpperCase() + values.firstname.slice(1);
      values.lastname =
        values.lastname.charAt(0).toUpperCase() + values.lastname.slice(1);
      values.normalizedUserName = values.email.toUpperCase();
      values.normalizedEmail = values.email.toUpperCase();
      const passwordHash = await bcrypt.hash(values.password, 10);
      values.passwordHash = passwordHash;
       console.log(values);
       console.log(url);
      const result = await axios.get(
        "https://localhost:5001/api/Student",
        config
      );
      const studentList = result.data;
      let studentUserNameList = [];

      studentList.forEach((student) => {
        studentUserNameList.push(student.userName);
      });

      if (studentUserNameList.includes(values.userName)) {
        setError("Email is already in use");
        setShowAlert(true);
        history.push("/signup");
      } else {
        try {
          await axios.post(
            "https://localhost:5001/api/Auth/register",
            values,
            config
          );
          history.push("/dashboard");
          console.log("created a student account");
        } catch (error) {
          console.log(error);
        }
      }
    },
    validationSchema: schema,
  });

  return (
    <FormikProvider value={formik}>
      <FormContainer>
        <Row className="text-center">
          <h1 className="mb-4 mx-auto">Sign Up</h1>
        </Row>

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
          <TextInputLiveFeedback
            label="Email"
            id="email"
            name="email"
            type="email"
          />

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

          <TextInputLiveFeedback
            label="Password"
            id="password"
            name="password"
            type="password"
          />

          <TextInputLiveFeedback
            label="Confirm Password"
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
          </Row>

          <Button type="submit" variant="primary" block className="rounded">
            Create an account
          </Button>
        </Form>
      </FormContainer>
    </FormikProvider>
  );
};
export default Signup;
