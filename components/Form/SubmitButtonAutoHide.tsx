import { useFormikContext } from "formik";
import React from "react";
import { Button } from "../Buttons/Button";

export default function SubmitButtonAutoHide({ children }) {
  const { handleSubmit, dirty } = useFormikContext();

  if (dirty)
  return (
      <Button className="self-center" type="submit" onClick={handleSubmit}>
        {children}
      </Button>
    );

  return null;
}
