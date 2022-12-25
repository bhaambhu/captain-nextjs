import React from "react";
import colors from "../../config/colors";
import fonts from "../../config/fonts";
import { RiDragMoveFill } from "react-icons/ri";
import { CgRemove } from "react-icons/cg";
import MyTextEditor from "../TextEditors/MyTextEditor";

export default function ListItemMCQOption({
  mcqOptionData,
  onMCQOptionDataChange,
  style,
  sid,
  draggable = false,
  editable = false,
  onDelete,
  ...otherprops
}) {
  // console.log("Content is ", theorySectionData.content);
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: colors.bgSurface,
        border: "1px solid",
        borderColor: colors.textStrong,
        borderRadius: 2,
        display: "flex",
        // padding: 10,
        overflow: "clip",
        flexDirection: "row",
        color: colors.textStrong,
        ...style,
      }}
      {...otherprops}
    >
      {draggable && (
        <RiDragMoveFill
          style={{
            alignSelf: "center",
            color: colors.textStrong,
            padding: "10px 0px",
            paddingLeft: 10,
            height: "100%",
          }}
        />
      )}
      <div style={{ padding: 10, flex: 1 }}>
        {editable ? (
          <MyTextEditor
            placeholder="Enter content of this option here..."
            style={{ marginBottom: 10 }}
            content={mcqOptionData.content}
            sid={sid}
            onChangeContent={(content) => {
              mcqOptionData.content = content;
              onMCQOptionDataChange(mcqOptionData);
            }}
          />
        ) : (
          <div
            style={{
              fontFamily: fonts.body_1,
              padding: "0px 5px",
            }}
            dangerouslySetInnerHTML={{ __html: mcqOptionData.content }}
          />
        )}
        <div
          style={{
            backgroundColor: colors.bgDefault,
            display: "inline-flex",
            padding: 5,
            paddingRight: 8,
            gap: 5,
            border: "1px solid",
            borderRadius: 2,
          }}
        >
          <input
            type="checkbox"
            readOnly={!editable}
            onChange={(event) => {
              if (editable) {
                mcqOptionData.correct = event.target.checked;
                onMCQOptionDataChange(mcqOptionData, sid);
              }
            }}
            checked={mcqOptionData.correct}
          />{" "}
          <span
            style={{
              fontSize: 12,
              alignSelf: "center",
              color: colors.textStrong,
            }}
          >
            {mcqOptionData.correct ? "Correct Option" : "Incorrect Option"}
          </span>
        </div>
      </div>
      {onDelete && (
        <CgRemove
          onClick={onDelete}
          style={{
            cursor: "pointer",
            color: colors.textStrong,
            marginLeft: 10,
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
