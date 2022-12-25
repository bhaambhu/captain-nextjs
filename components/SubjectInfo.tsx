import React, { useState } from "react";
import { Button, TextButton } from "./Button"
import ListItemTopic from "./ListItems/ListItemTopic";
import ListContainer from "./ListItems/ListContainer";
import SectionHeader from "./Texts/SectionHeader";
import colors from "../config/colors";
import JSONViewer from "./JSONViewer";
import { breadString } from "../config/utils";
import dimensions from "../config/dimensions";
import APIEndpoints from "../config/APIEndpoints";
import TopicSelectModal from "./TopicSelectModal";

export default function SubjectInfo({
  data,
  onDataChange,
  onAddTopic,
  onDataSave,
  onDeleteSubject,
  onCreateChild,
}) {
  const [showTopicSelector, setShowTopicSelector] = useState(false);
  return (
    <div>
      {showTopicSelector && (
        <TopicSelectModal
          heading={"Select Topic"}
          onSelectTopic={(selectedTopic) => {
            console.log("Selected topic:");
            console.log(selectedTopic);
            onAddTopic(selectedTopic.id);
            setShowTopicSelector(false);
          }}
          onCancel={() => {
            setShowTopicSelector(false);
          }}
        />
      )}
      <ListContainer>
        <SectionHeader>{breadString(data.breadcrumbs, true)}</SectionHeader>
        <ListItemTopic
          overline="TITLE"
          placeholder="Enter Subject Title"
          title={data.name}
          onChange={(newValue) => {
            data.name = newValue;
            onDataChange(data);
          }}
        />
        <ListItemTopic
          overline="ABOUT"
          placeholder="Enter a short description about this subject."
          title={data.about}
          onChange={(newValue) => {
            data.about = newValue;
            onDataChange(data);
          }}
        />
        {onDataSave && (
          <TextButton style={{ color: colors.secondary }} onClick={onDataSave}>
            Save
          </TextButton>
        )}
      </ListContainer>
      <div style={{ border: "1px solid", borderColor: colors.bgDisabled }} />
      <ListContainer>
        <SectionHeader>TOPICS</SectionHeader>
        <TopicsGrid topics={data.topics} />
        <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Button
            backgroundColor={colors.yellowBG}
            onClick={() => {
              setShowTopicSelector(true);
            }}
          >
            Add Topic
          </Button>
        </div>

        <SectionHeader>ACTIONS</SectionHeader>
        <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Button
            backgroundColor={colors.yellowBG}
            onClick={() => {
              const subjectName = window.prompt("Enter new subject's name:");
              if (subjectName === null) return;
              onCreateChild(subjectName, data.id);
            }}
          >
            Add Child Subject
          </Button>
          <Button
            backgroundColor={colors.errorBg}
            onClick={() => {
              console.log("calling delete with id: " + data.id);
              var confirmDelete = window.confirm(
                "Are you sure you want to delete this subject?"
              );
              if (confirmDelete) {
                onDeleteSubject(data.id, data.parentId);
              }
            }}
          >
            Delete This Subject
          </Button>
        </div>
        <SectionHeader>JSON View</SectionHeader>
        <JSONViewer>{data}</JSONViewer>
      </ListContainer>
    </div>
  );
}

function TopicsGrid({ topics }) {
  return (
    <div
      style={{
        // padding: dimensions.contentDistance,
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        gap: dimensions.contentDistance,
      }}
    >
      {topics.map((item) => {
        return (
          <ListItemTopic
            key={item.id}
            topicToSubjectDraggable={true}
            topic_id={item.id}
            to={APIEndpoints.TOPICS + item.id}
            style={{ width: 200 }}
            title={item.title}
            overline={item.about}
          />
        );
      })}
    </div>
  );
}
