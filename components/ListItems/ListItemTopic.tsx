import React from "react";
import colors from "../../config/colors";
import fonts from "../../config/fonts";
import { RiDragMoveFill } from "react-icons/ri";
import { CgRemove } from "react-icons/cg";
import { useRouter } from "next/router";

export default function ListItemTopic({
  overline,
  title,
  style,
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
      style={{
        cursor: "pointer",
        width: "100%",
        backgroundColor: selected ? colors.secondaryLight : colors.bgSurface,
        border: "1px solid",
        borderColor: colors.textStrong,
        borderRadius: 2,
        display: "flex",
        // padding: 10,
        flexDirection: "row",
        color: colors.textStrong,
        ...style,
      }}
      {...otherprops}
    >
      <div
        onClick={onClick}
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: 5,
          justifyContent: "space-between",
          // overflow: "auto",
          // flexGrow: 1,
          // marginRight: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          {draggable && (
            <RiDragMoveFill
              size="15"
              style={{
                // backgroundColor: "red",
                cursor: "move",
                alignSelf: "center",
                color: colors.textStrong,
                marginRight: 5,
              }}
            />
          )}
          <div
            style={{
              fontSize: 10,
              color: colors.textWeak,
              textTransform: "uppercase",
              fontFamily: fonts.overline,
            }}
          >
            {overline}
          </div>
        </div>
        <div>
          {onChange ? (
            <div style={{ display: "flex" }}>
              <input
                type="text"
                placeholder={placeholder}
                style={{
                  fontSize: 16,
                  marginBottom: 5,
                  fontFamily: fonts.overline,
                  color: colors.textMedium,
                  padding: 5,
                  flex: 1,
                }}
                value={title}
                onChange={(event) => {
                  onChange(event.target.value);
                }}
              />
            </div>
          ) : (
            <div
              style={{
                fontFamily: fonts.overline,
              }}
            >
              {title}
            </div>
          )}
        </div>
      </div>

      {onDelete && (
        <CgRemove
          onClick={onDelete}
          style={{
            cursor: "pointer",
            color: colors.textStrong,
            padding: "0px 5px",
            borderLeftWidth: 1,
            borderLeftColor: colors.textStrong,
            borderLeftStyle: "solid",
            height: "100%",
            overflow: "clip",
            backgroundColor: colors.bgDisabled,
          }}
        />
      )}
    </div>
  );
}
