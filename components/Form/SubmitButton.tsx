import { useFormikContext } from "formik";
import React from "react";
import { Button } from "../Buttons/Button";

export default function SubmitButton({ children }) {
  const { handleSubmit } = useFormikContext();

  return (
    <Button className="self-center" type="submit" onClick={handleSubmit}>
      {children}
    </Button>
  );
}
