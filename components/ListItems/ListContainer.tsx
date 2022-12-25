import React from "react";
import colors from "../../config/colors";

export default function ListContainer({ style, ...otherProps }) {
  return (
    <div
      style={{
        padding: 10,
        backgroundColor: colors.bgDefault,
        gap: 10,
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
      {...otherProps}
    />
  );
}
