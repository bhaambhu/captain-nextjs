import React, { useState } from "react";
import { Button, TextButton } from "./Buttons/Button"
import SanEDDButton from "./Buttons/SanEDDButton";
import ListContainer from "./ListItems/ListContainer";
import SectionHeader from "./Texts/SectionHeader";
import colors from "../config/colors";
import JSONViewer from "./JSONViewer";
import { breadString } from "../config/utils";
import dimensions from "../config/dimensions";
import APIEndpoints from "../config/APIEndpoints";
import TopicSelectModal from "./TopicSelectModal";
import twColors from "../config/twColors";

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
    <div className="max-w-[40%]">
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
      <ListContainer className={twColors.surface1}>
        <SectionHeader bar={false} className='uppercase'>{breadString(data.breadcrumbs, true)}</SectionHeader>
        <SanEDDButton
          overline="TITLE"
          placeholder="Enter Subject Title"
          className={twColors.inputField}
          title={data.name}
          onChange={(newValue) => {
            data.name = newValue;
            onDataChange(data);
          }}
        />
        <SanEDDButton
          overline="ABOUT"
          placeholder="Enter a short description about this subject."
          className={twColors.inputField}
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
        <SectionHeader>TOPICS</SectionHeader>
        <TopicsGrid topics={data.topics} />
        <Button
          className={twColors.addContainer}
          onClick={() => {
            setShowTopicSelector(true);
          }}
        >
          Add Topic
        </Button>

        <SectionHeader>ACTIONS</SectionHeader>
        <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Button
          className={twColors.addContainer}
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
            className={twColors.deleteContainer}
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
        <JSONViewer heading={'JSON View'}>{data}</JSONViewer>
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
          <SanEDDButton
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
