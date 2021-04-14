import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik, FormikProvider, Form } from "formik";
import { Button, Row, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import TextInputLiveFeedback from "../components/TextInputLiveFeedback";
import { emailRegex } from "../util/regex";
import axios from "axios";
import jwt from "jwt-decode";

const schema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .matches(emailRegex, "Invalid"),
  password: Yup.string().required("Password is required"),
});

const config = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
};

const Login = () => {
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      // console.log(values);
      const credentials = {
        Username: values.email,
        Password: values.password,
      };
      // console.log(credentials);
      try {
        await axios
          .post(
            "https://localhost:5001/api/Auth/login",
            credentials,
            config
          )
          .then((res) => {
            // console.log(res.data);
            const { token, expiration, hashPassword } = res.data;
            localStorage.setItem("token", token);
            localStorage.setItem("expiration", expiration);
            localStorage.setItem("hashPassword", hashPassword);
            const user = jwt(token);
            const userId = user.sub[0];
            console.log(userId);
            localStorage.setItem("id", userId);
          });
        history.push("/dashboard");
        window.location.reload(false);
        console.log(`user: ${credentials.Username}. logged-in`);
      } catch (error) {
        setError("Invalid Credentials");
        setShowAlert(true);
        console.log(error);
      }
    },
    validationSchema: schema,
  });

  return (
    <>
      <FormikProvider value={formik}>
        <FormContainer>
          <Row className="text-center">
            <h1 className="mb-4 mx-auto">Login</h1>
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
              label="Password"
              id="password"
              name="password"
              type="password"
            />

            <Button type="submit" variant="primary" block className="rounded">
              Login
            </Button>

            <Row className="text-center">
              <Link
                className="ml-3 mt-3 text-left text-secondary"
                to="/forgot-password"
              >
                <u>Forgot Password</u>
              </Link>
            </Row>
          </Form>
        </FormContainer>
      </FormikProvider>
    </>
  );
};

export default Login;
