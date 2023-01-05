import React from "react";
import { RiDragMoveFill } from "react-icons/ri";
import { useRouter } from "next/router";
import { twMerge } from 'tailwind-merge'
import { MdEdit } from "react-icons/md";
import {TiDelete} from "react-icons/ti"
import twColors from "../../config/twColors";

// Sanjay's Editable Draggable Deletable Button
export default function SanEDDButton({
  overline,
  title,
  className = '',
  placeholder = "Enter Step Title",
  draggable = false,
  topicToSubjectDraggable = false,
  topic_id = -1,
  selected = false,
  onDelete,
  onDeleteHover='Remove',
  onChange,
  to,
  onClick,
  ...otherprops
}) {
  const router = useRouter();
  if (to) {
    onClick = () => router.push(to);
  }
  return (
    <div
      onDragStart={(e) => {
        e.dataTransfer.setData("topic_id", topic_id);
      }}
      onDragOver={(e) => {
        e.stopPropagation();
      }}
      draggable={topicToSubjectDraggable}
      className={twMerge(`flex ${selected ? twColors.primaryContainer : twColors.primary} border rounded-sm ${onClick ? 'cursor-pointer' : ''} ${className}`)}
      {...otherprops}
    >
      <div
        onClick={onClick}
        className="flex flex-col justify-between font-overline w-full"
      >

        {/* Upper Area - Subtitle, Drag Handle, Delete Button */}
        <div className={`flex justify-between text-xs uppercase`}>

          {/* Drag Handle and Subtitle */}
          <div className="flex p-1 items-center">
            {draggable && (
              <RiDragMoveFill
                className="cursor-move mr-1"
              />
            )}
            {overline}
            {onChange && (
              <MdEdit
              className="ml-1"
            />
            )}
          </div>

          {/* Delete */}
          {onDelete && (
            <div className="text-xl leading-none flex cursor-pointer" title={onDeleteHover}>
              <TiDelete
                onClick={(e) => { 
                  e.stopPropagation();
                  onDelete();
                }}
                className={selected ? twColors.cross : twColors.crossContainer}
              />
              {/* &ndash; */}
            </div>
          )}

        </div>
        {/* Lower Area - Content */}
        {(title || onChange) && <div className="mt-1 p-1">
          {onChange ? (
            <input
              type="text"
              placeholder={placeholder}
              className="mb-1 w-full bg-transparent"
              value={title}
              onChange={(event) => {
                onChange(event.target.value);
              }}
            />
          ) : (
            <div>{title}</div>
          )}
        </div>}
      </div>

      {/* {onDelete && (
        <div className="cursor-pointer text-cclrs-dark-strong px-1 w-8 border-l border-l-cclrs-dark-strong h-full overflow-clip bg-cclrs-bg-error items-center flex">
          <CgRemove
            onClick={onDelete}
            className="w-full h-full"
          />
        </div>
      )} */}
    </div>
  );
}
