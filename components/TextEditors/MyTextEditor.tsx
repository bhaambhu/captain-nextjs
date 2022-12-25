import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import ReactQuill from "react-quill"; // ES6
// import "react-quill/dist/quill.snow.css"; // ES6
import colors from "../../config/colors";

export default function MyTextEditor({
  sid,
  content,
  onChangeContent,
  placeholder = "Enter content of this theory section here...",
  style,
}) {
  const [newContent, setNewContent] = useState(content);

  useEffect(() => {
    const timeOutID = setTimeout(() => onChangeContent(newContent), 300);
    return () => {
      clearTimeout(timeOutID);
    };
  }, [newContent]);

  useEffect(() => {
    setNewContent(content);
  }, [content]);

  return (
    <textarea value={newContent} onChange={(e)=>{setNewContent(e.target.value)}} placeholder={placeholder} style={{...style,
          backgroundColor: colors.bgSurface,}} />
    // <ReactQuill
    //   style={{
    //     ...style,
    //     backgroundColor: colors.bgSurface,
    //   }}
    //   placeholder={placeholder}
    //   onChange={(changedContent) => {
    //     setNewContent(changedContent);
    //   }}
    //   value={newContent}
    // />
  );
}
