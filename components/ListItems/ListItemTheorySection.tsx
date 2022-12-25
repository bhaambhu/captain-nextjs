import React from "react";
import colors from "../../config/colors";
import fonts from "../../config/fonts";
import { RiDragMoveFill } from "react-icons/ri";
import { CgRemove } from "react-icons/cg";
import MyTextEditor from "../TextEditors/MyTextEditor";
import dimensions from "../../config/dimensions";

export default function ListItemTheorySection({
  theorySectionData,
  onTheorySectionDataChange,
  titlePlaceholder = "Enter Section Title",
  contentPlaceholder,
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
        // overflow: "clip",
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
        <div
          style={{
            fontSize: 10,
            display: "flex",
            color: colors.textWeak,
            textTransform: "uppercase",
            fontFamily: fonts.overline,
            marginBottom: 5,
            width: "100%",
          }}
        >
          {editable ? (
            <input
              type="text"
              style={{
                fontSize: 16,
                marginBottom: 5,
                fontFamily: fonts.overline,
                color: colors.textMedium,
                padding: 5,
                flex: 1,
              }}
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
        {editable ? (
          <MyTextEditor
            style={{ width: "100%" }}
            placeholder={contentPlaceholder}
            content={theorySectionData.content}
            sid={sid}
            onChangeContent={(content) => {
              theorySectionData.content = content;
              onTheorySectionDataChange(theorySectionData);
            }}
          />
        ) : (
          <div
            style={{
              fontFamily: fonts.body_1,
            }}
            dangerouslySetInnerHTML={{ __html: theorySectionData.content }}
          />
        )}
      </div>
      {onDelete && (
        <div>
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
        </div>
      )}
    </div>
  );
}
