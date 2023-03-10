import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import ReactQuill from "react-quill"; // ES6
// import "react-quill/dist/quill.snow.css"; // ES6

export default function MyTextEditor({
  sid,
  content,
  onChangeContent,
  placeholder = "Enter content of this theory section here...",
  className=''
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
    <textarea
      value={newContent}
      onChange={(e) => { setNewContent(e.target.value) }}
      placeholder={placeholder}
      className={`bg-san-surface dark:bg-san-dark-surface text-san-on-surface dark:text-san-dark-on-surface ${className}`}
    />
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
