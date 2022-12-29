import React from "react";
import { Button } from "../Buttons/Button";
import SanEDDButton from "../Buttons/SanEDDButton";
import ListContainer from "../ListItems/ListContainer";
import SectionHeader from "../Texts/SectionHeader";
import colors from "../../config/colors";
import JSONViewer from "../JSONViewer";
import Toggle from "../Toggle";
import twColors from "../../config/twColors";

export default function PathInfoStep({
  pathData,
  onPathDataChange,
  onDeletePath,
}) {
  return (
    <ListContainer className={twColors.surface2}>
      <SanEDDButton
        overline="TITLE"
        placeholder="Enter Path Title"
        className={twColors.inputField}
        title={pathData.title}
        onChange={(newValue) => {
          pathData.title = newValue;
          onPathDataChange(pathData);
        }}
      />
      <SanEDDButton
        overline="ABOUT"
        placeholder="Enter a short description about this path."
        className={twColors.inputField}
        title={pathData.about}
        onChange={(newValue) => {
          pathData.about = newValue;
          onPathDataChange(pathData);
        }}
      />

      <SectionHeader>
        PUBLISHED{" "}
        <Toggle
          enabled={pathData.published}
          onChange={(checked) => {
            pathData.published = checked;
            onPathDataChange(pathData);
          }}
        />
      </SectionHeader>
      <SectionHeader>ACTIONS</SectionHeader>
      <Button
        backgroundColor={colors.errorBg}
        className={twColors.deleteContainer}
        onClick={() => {
          var confirmDelete = window.confirm(
            "Are you sure you want to delete this path?"
          );
          if (confirmDelete) {
            onDeletePath();
          }
        }}
      >
        Delete This Path
      </Button>
      <JSONViewer heading={"JSON View"}>{pathData}</JSONViewer>
    </ListContainer>
  );
}
