import { useState } from "react";
import * as Yup from "yup";
import Form from "../components/Form/Form";
import FormField from "../components/Form/FormField";
import SubmitButton from "../components/Form/SubmitButton";
import useAuth from "../lib/auth/useAuth";
import routes from "../config/routes";
import usersAPIService from "../lib/APIServices/usersAPIService";
import ErrorPill from "../components/Pills/ErrorPill";
import useAPI from "../lib/useAPI";
import { Button } from "../components/Buttons/Button";
import LoadingIndicatorFullScreen from "../components/Loading/LoadingIndicatorFullScreen";

export default function Register() {
  const auth = useAuth();

  const registerAPI = useAPI(usersAPIService.register)
  const loginAPI = useAPI(usersAPIService.logIn);

  const [error, setError] = useState("");

  const handleSubmit = async (data) => {

    const result = await registerAPI.request(data);

    // If result is not ok, we exit this function
    if (!result.ok) {
      if (result.data.email) setError(result.data.email);
      else {
        setError("An unexpected error occurred.");
        console.log(result);
      }
      return;
    }

    // Else we login the newly registered user
    const { data: tokens } = await loginAPI.request(data.email, data.password);
    auth.logIn(tokens);
    window.location.href = routes.HOME;
  };

  const validationSchema = Yup.object().shape({
    display_name: Yup.string().required().label("Your name"),
    email: Yup.string().required().email().label("E-mail"),
    password: Yup.string().required().min(8).label("Password"),
    confirmPassword: Yup.string().test(
      "passwords-match",
      "Passwords must match",
      function (value) {
        return this.parent.password === value;
      }
    ),
  });
  return (
    <div className="flex grow justify-center items-center"
    >
      <LoadingIndicatorFullScreen visible={registerAPI.loading || loginAPI.loading} />
      <Form
        initialValues={{
          email: "",
          password: "",
          confirmPassword: "",
          display_name: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {/* Form Container */}
        <div
          className="m-3 p-3 flex border border-current bg-san-surface dark:bg-san-dark-surface flex-col gap-3 w-[350px] rounded-sm shadow-lg"
        >
          <ErrorPill
            message={error}
            visible={error}
          />
          <FormField
            autoCapitalize="words"
            autoCorrect={false}
            name="display_name"
            id="display_name"
            placeholder="Your Name"
            textContentType="name"
          />
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            id="email"
            name="email"
            placeholder="E-mail"
            textContentType="emailAddress"
          />
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            id="password"
            name="password"
            placeholder="Password"
            textContentType="password"
            type="password"
          />
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Password"
            secureTextEntry
            textContentType="password"
            type="password"
          />

          {/* Buttons Container */}
          <div className="flex justify-between">
          <Button onClick={()=>{window.location.href = "/"}}>Cancel</Button>
          <SubmitButton>Register</SubmitButton>
          </div>
        </div>
      </Form>
    </div>
  );
}