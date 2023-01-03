import React from "react";
import { useFormikContext } from "formik";
import colors from "../../config/colors";
import fonts from "../../config/fonts";
import ErrorPill from "../Pills/ErrorPill";
import { twMerge } from "tailwind-merge";
import twColors from "../../config/twColors";

export default function FormField({ name, ...otherProps }) {
  const { setFieldTouched, handleChange, errors, touched, values } = useFormikContext();

  return (
    <>
      <input
        className={twMerge(twColors.inputField+ "border resize-y p-2 font-overline ")}
        onChange={handleChange}
        value={values[name]}
        onBlur={() => setFieldTouched(name)}
        {...otherProps}
      />
      <ErrorPill message={errors[name]} visible={touched[name]} />
    </>
  );
}
