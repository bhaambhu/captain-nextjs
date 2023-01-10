import React from "react";
import { RiDragMoveFill } from "react-icons/ri";
import { MdDeleteForever } from "react-icons/md";
import { useRouter } from "next/router";
import { truncateString } from "../../lib/utils";

export default function ListItemPath({
  overline,
  title,
  published = false,
  className = '',
  placeholder = "Enter Step Title",
  draggable = false,
  topicToSubjectDraggable = false,
  topic_id = -1,
  selected = false,
  onDelete,
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
      className={`flex border-cclrs-dark-strong w-fit cursor-pointer ${published ? 'bg-san-positive-container text-san-on-positive-container dark:bg-san-dark-positive dark:text-san-dark-on-positive' : 'bg-san-surface text-san-on-surface dark:text-san-dark-on-surface dark:bg-san-dark-surface'} border rounded-sm ${className}`}
      {...otherprops}
    >
      {onDelete && (
        <div className="cursor-pointer px-1 w-10 border-r border-r-cclrs-dark-strong h-full overflow-clip bg-cclrs-bg-error items-center flex" >
          <MdDeleteForever
            onClick={onDelete}
            className="w-full h-full"
          />
        </div>
      )}
      <div
        onClick={onClick} className={`flex flex-col p-1 justify-between`}
      >
        <div className="flex items-center mb-1">
          {draggable && (
            <RiDragMoveFill
              size="15"
              className="cursor-move mr-1"
            />
          )}
          <div className="text-xs font-overline">
            {truncateString(overline, 30)}
          </div>
        </div>
        <div className="font-overline">
          {onChange ? (
            <div className="flex">
              <input
                type="text"
                placeholder={placeholder}
                className="bg-transparent"
                value={title}
                onChange={(event) => {
                  onChange(event.target.value);
                }}
              />
            </div>
          ) : (
            <div>{truncateString(title, 40)}</div>
          )}
        </div>
        <div className={`font-overline text-xs self-end bg-san-dark-surface-variant rounded-tl-sm p-1 mt-2 -mr-1 -mb-1 ${published ? 'text-san-positive-container' : 'text-cclrs-bg-yellow'}`} >
          {published ? "PUBLISHED" : "DRAFT"}
        </div>
      </div>
    </div>
  );
}
