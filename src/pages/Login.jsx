import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  FloatingLabel,
} from "react-bootstrap";
import logo from "../assets/pixally-logo-light.png";
import * as formik from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axiosClient from "../utils/axiosClient";

const Login = () => {
  const [error, setError] = useState("");
  const { Formik } = formik;
  const navigate = useNavigate(); // Initialize useNavigate hook

  const schema = yup.object().shape({
    email: yup.string().email("Invalid Email").required("Email is required"),
    password: yup
      .string()
      // .min(8, "Password must be at least 8 characters")
      // .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      // .matches(/[0-9]/, "Password must contain at least one number")
      .required("Password is required"),
  });

  const handleLogin = (logindata) => {
    axiosClient
      .post(`/api/v1/user/login`, {
        ...logindata,
        // deviceName: "desktop",
      })
      .then((response) => {
        // console.log("resp", response?.data?.accessToken);
        localStorage.setItem(
          "accessToken",
          JSON.stringify(response?.data?.accessToken)
        );
        // localStorage.setItem("userData", JSON.stringify(response.data));
        // setUser(response.data);
        navigate("/");
        // console.log("login response", response?.data?.accessToken);
      })
      .catch((error) => {
        console.log("login error", error.message);
        setError(
          error?.response?.data?.message || "An error occurred during login"
        );
      });
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center vh-100"
    >
      <Row className="justify-content-center w-100">
        <Col md={4} className="text-center px-5">
          {/* Logo Section */}
          <img
            src={logo}
            alt="Logo"
            className="img-fluid my-5"
            style={{ maxWidth: "250px" }}
          />
          {/* <h2 className="mb-4">Pixally</h2> */}
          {error && <Alert variant="danger">{error}</Alert>}

          <Formik
            validationSchema={schema}
            onSubmit={(formData) => handleLogin(formData)}
            initialValues={{
              password: "",
              email: "",
            }}
          >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <FloatingLabel
                  controlId="floatingEmail"
                  label="Email address"
                  className="mb-3"
                >
                  <Form.Control
                    placeholder="name@example.com"
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    // isValid={touched.email && !errors.email}
                    isInvalid={touched.email && errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel
                  controlId="floatingPassword"
                  label="Password"
                  className="mb-3"
                >
                  <Form.Control
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    // isValid={touched.password && !errors.password}
                    isInvalid={touched.password && errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <Row className="gap-0">
                  <Col md={6} className="text-center">
                    <Button type="submit" className="w-100">
                      Login
                    </Button>
                  </Col>
                  <Col md={6} className="text-center">
                    <button
                      className="btn btn-outline-primary w-100"
                      type="button"
                      onClick={() => navigate("/register")} // Navigate to register page
                    >
                      Register
                    </button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
