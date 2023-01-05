import React from "react";
import { RiDragMoveFill } from "react-icons/ri";
import { CgRemove } from "react-icons/cg";
import MyTextEditor from "../TextEditors/MyTextEditor";
import { TiDelete } from "react-icons/ti";
import twColors from "../../config/twColors";
import { twMerge } from "tailwind-merge";
import CheckboxPill from "../CheckboxPill";

export default function ListItemMCQOption({
  mcqOptionData,
  onMCQOptionDataChange,
  displayLabel="",
  className = '',
  sid,
  draggable = false,
  editable = false,
  onDelete,
  onDeleteHover = 'Remove',
  ...otherprops
}) {
  // console.log("Content is ", mcqOptionData.content);
  return (
    <div
      className={twMerge(`${twColors.inputField} flex flex-col cursor-pointer border rounded-sm border-current ${className}`)}
      {...otherprops}
    >
      {/* Upper Area - Title, Drag Handle, Delete Button */}
      <div className="w-full py-1.5 px-2 flex justify-between items-center">

        {/* Drag Handle and Title */}
        <div className="flex items-center font-overline w-full gap-1 ">
          {draggable && (
            <RiDragMoveFill
              className="mr-1"
            />
          )}
          {displayLabel}
        </div>

        {/* Delete */}
        {onDelete && (
          <div className="text-xl leading-none flex cursor-pointer" title={onDeleteHover}>
            <TiDelete
              onClick={onDelete}
              className={twColors.cross}
            />
            {/* &ndash; */}
          </div>
        )}
      </div>

      {/* Main Editor Section */}
      <div className="m-2 rounded-sm">
        {editable ? (
          <MyTextEditor
            placeholder="Enter content of this option here..."
            className="w-full bg-transparent p-1 border border-current"
            content={mcqOptionData.content}
            sid={sid}
            onChangeContent={(content) => {
              mcqOptionData.content = content;
              onMCQOptionDataChange(mcqOptionData);
            }}
          />
        ) : (
          <div
            className="font-body_1"
            dangerouslySetInnerHTML={{ __html: mcqOptionData.content }}
          />
        )}
      </div>
      {/* Correct Option Checker */}
      <CheckboxPill
        onChange={(event) => {
          if (editable) {
            mcqOptionData.correct = event.target.checked;
            onMCQOptionDataChange(mcqOptionData, sid);
          }
        }}
        className='mx-2 mb-2'
        readOnly={!editable}
        checked={mcqOptionData.correct}
      >
        {mcqOptionData.correct ? "Option Correct" : "Option Incorrect"}
      </CheckboxPill>
    </div>
  );
}
