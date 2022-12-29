import React from "react";
import { RiDragMoveFill } from "react-icons/ri";
import { CgRemove } from "react-icons/cg";
import MyTextEditor from "../TextEditors/MyTextEditor";
import { twMerge } from "tailwind-merge";
import twColors from "../../config/twColors";
import { TiDelete } from "react-icons/ti";

export default function ListItemTheorySection({
  theorySectionData,
  onTheorySectionDataChange,
  className = '',
  titlePlaceholder = "Enter Section Title",
  contentPlaceholder,
  sid,
  draggable = false,
  editable = false,
  onDelete,
  onDeleteHover = 'Remove',
  ...otherprops
}) {
  // console.log("Content is ", theorySectionData.content);
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
            />
          )}
          {editable ? (
            <input
              type="text"
              className="w-full bg-transparent"
              placeholder={titlePlaceholder}
              value={theorySectionData.title}
              onChange={(event) => {
                theorySectionData.title = event.target.value;
                onTheorySectionDataChange(theorySectionData);
              }}
            />
          ) : (
            theorySectionData.title
          )}
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
            placeholder={contentPlaceholder}
            className="w-full bg-transparent p-1 border border-current"
            content={theorySectionData.content}
            sid={sid}
            onChangeContent={(content) => {
              theorySectionData.content = content;
              onTheorySectionDataChange(theorySectionData);
            }}
          />
        ) : (
          <div
            className="font-body_1"
            dangerouslySetInnerHTML={{ __html: theorySectionData.content }}
          />
        )}
      </div>
    </div>
    //   {/* Delete Button */}
    //   {onDelete && (
    //     <div className="cursor-pointer text-cclrs-dark-strong px-1 w-8 border-l border-l-cclrs-dark-strong h-full overflow-clip bg-cclrs-bg-error items-center flex">
    //       <CgRemove
    //         onClick={onDelete}
    //         className="w-full h-full"
    //       />
    //     </div>
    //   )}
    // </div>
  );
}
