import React from "react";
import colors from "../config/colors";
import fonts from "../config/fonts";

function Clickable({ style, children, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        fontFamily: fonts.overline,
        color: colors.textStrong,
        alignSelf: "flex-start",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Button({ backgroundColor = colors.bgSurface, ...props }) {
  return (
    <Clickable
      onClick={props.onClick}
      style={{
        borderRadius: 1,
        border: "1px solid",
        backgroundColor: backgroundColor,
        borderColor: colors.textStrong,
        padding: 6,
        ...props.style,
      }}
      {...props}
    >
      {props.children}
    </Clickable>
  );
}

function TextButton({ style, children, onClick }) {
  return (
    <Clickable onClick={onClick} style={{ ...style }}>
      {children}
    </Clickable>
  );
}

export { Button, TextButton };
