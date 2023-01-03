import React, { useState } from "react";
import * as Yup from "yup";
import Form from "../components/Form/Form";
import FormField from "../components/Form/FormField";
import SubmitButton from "../components/Form/SubmitButton";
import useAuth from "../lib/auth/useAuth";
import routes from "../config/routes";
import usersAPIService from "../lib/APIServices/usersAPIService";
import dimensions from "../config/dimensions";
import colors from "../config/colors";
import ErrorPill from "../components/Pills/ErrorPill";
import useApi from "../lib/useAPI";
import LoadingIndicator from "../components/LoadingIndicator";

export default function Login() {
  const auth = useAuth();

  const loginAPI = useApi(usersAPIService.logIn);

  const handleSubmit = async ({ email, password }) => {
    const result = await loginAPI.request(email, password);
    if (result.ok) {
      auth.logIn(result.data);
      window.location.href = routes.HOME;
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required().email().label("E-mail"),
    password: Yup.string().required().min(4).label("Password"),
  });
  return (
    <div className="flex grow justify-center items-center"
    >
      <LoadingIndicator visible={loginAPI.loading} />
      <Form
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {/* Form Container */}
        <div
          className="m-3 p-3 flex border border-current bg-san-surface dark:bg-san-dark-surface flex-col gap-3 w-[350px] rounded-sm shadow-lg"
        >
          <ErrorPill
            message="Invalid email and/or password."
            visible={loginAPI.error}
          />
          <FormField
            id="email"
            name="email"
            placeholder="E-mail"
            type="email"
          />

          <FormField id="password" name="password" type="password" />

          <SubmitButton>Login</SubmitButton>
        </div>
      </Form>
    </div>
  );
}