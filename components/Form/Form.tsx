import React from "react";
import { Formik } from "formik";

export default function Form({
  initialValues,
  onSubmit,
  validationSchema,
  children,
}) {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize
      validationSchema={validationSchema}
    >
      {() => <>{children}</>}
    </Formik>
  );
}
