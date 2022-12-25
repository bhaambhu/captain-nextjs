import React from "react";
import { Button } from "../Button";
import ListItemTopic from "../ListItems/ListItemTopic";
import ListContainer from "../ListItems/ListContainer";
import SectionHeader from "../Texts/SectionHeader";
import colors from "../../config/colors";
import JSONViewer from "../JSONViewer";
import Switch from "react-switch";
import Toggle from "../Toggle";

const topic_example = {
  breadcrumbs: [
    {
      title: "Computer Science",
      id: 1,
    },
    {
      title: "Fundamentals",
      id: 2,
    },
    {
      title: "Algorithms and structures",
      id: 3,
    },
    {
      title: "Intro to algorithms",
      id: 4,
    },
  ],
  title: "The big O notation",
  timeLength: "9 minutes",
  problemsSolved: "0 / 1 problems solved",
  difficulty: "Medium",
  about:
    "About this topic. This is a very subtle topic. Alright alright alright.",
};

export default function PathInfoStep({
  pathData,
  onPathDataChange,
  onDeletePath,
}) {
  return (
    <ListContainer>
      <ListItemTopic
        overline="TITLE"
        placeholder="Enter Path Title"
        title={pathData.title}
        onChange={(newValue) => {
          pathData.title = newValue;
          onPathDataChange(pathData);
        }}
      />
      <ListItemTopic
        overline="ABOUT"
        placeholder="Enter a short description about this path."
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
