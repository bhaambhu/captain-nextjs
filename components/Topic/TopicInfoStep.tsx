import React, { useState } from "react";
import { Button } from "../Buttons/Button"
import SanEDDButton from "../Buttons/SanEDDButton";
import ListContainer from "../ListItems/ListContainer";
import SectionHeader from "../Texts/SectionHeader";
import colors from "../../config/colors";
import JSONViewer from "../JSONViewer";
import { breadString } from "../../lib/utils";
import Modal from "../Modal";
import TopicSelectModal from "../TopicSelectModal";
import SubjectSelectModal from "../SubjectSelectModal";
import APIEndpoints from "../../config/APIEndpoints";
import topicsAPIService from "../../lib/APIServices/topicsAPIService";
import twColors from "../../config/twColors";
import MobileTopicPreview from "../MobilePreview/MobileTopicPreview";

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

export default function TopicInfoStep({
  topicData,
  onTopicDataChange,
  onDeleteTopic,
}) {
  const [showSubjectSelector, setShowSubjectSelector] = useState(false);
  const [showTopicSelector, setShowTopicSelector] = useState(false);
  const [networkLoading, setNetworkLoading] = useState(false);

  const addRequirementIfSafe = async (requiredTopicID, requiredTopicTitle) => {
    setNetworkLoading(true);
    const result = await topicsAPIService.isRequirementSafe(
      topicData.id,
      requiredTopicID
    );
    console.log(result);
    setNetworkLoading(false);
    if (result.ok) {
      let newRequires = topicData.requires;
      newRequires.push({
        id: requiredTopicID,
        title: requiredTopicTitle,
      });
      onTopicDataChange({ ...topicData, requires: newRequires });
      setShowTopicSelector(false);
    } else {
      alert(result.data);
    }
  };

  // const addRequirement = async (requiredTopicID) => {
  //   setNetworkLoading(true);
  //   const result = await topicsAPI.addDependency(topicData.id, requiredTopicID);
  //   console.log(result);
  //   setNetworkLoading(false);
  //   if (result.ok) {
  //     // Add only the updated requirements to current topicData, because other things might be edited locally by the user
  //     onTopicDataChange({ ...topicData, requires: result.data });
  //   } else {
  //     return alert(result.data);
  //   }
  // };

  if (networkLoading) {
    return (
      <div>
        <Modal />
      </div>
    );
  } else
    return (
      // <JSONViewer heading={"Topic Info Step Data"}>{topicData}</JSONViewer>

      <ListContainer className={twColors.surface3}>
        {showTopicSelector && (
          <TopicSelectModal
            heading={"Select Topic"}
            onSelectTopic={(selectedTopic) => {
              console.log("Selected topic:", selectedTopic);
              // Don't select our current topic
              if (topicData.id == selectedTopic.id) {
                alert("A topic cannot have itself as its pre-requirement.");
                return;
              }
              // Don't add the same topic twice
              for (const existingReq of topicData.requires) {
                if (existingReq.id == selectedTopic.id) {
                  alert("Cannot add the same pre-requirement twice.");
                  return;
                }
              }
              addRequirementIfSafe(selectedTopic.id, selectedTopic.title);
            }}
            onCancel={() => {
              setShowTopicSelector(false);
            }}
          />
        )}
        {showSubjectSelector && (
          <SubjectSelectModal
            heading={breadString(topicData.breadcrumbs)}
            onSelectSubject={(selectedSubject) => {
              setShowSubjectSelector(false);
              topicData.subject = selectedSubject.id;
              topicData.breadcrumbs = selectedSubject.breadcrumbs;
              onTopicDataChange(topicData);
            }}
            onCancel={() => {
              setShowSubjectSelector(false);
            }}
          />
        )}
        {/* Topic Title Field */}
        <SanEDDButton
          overline="TITLE"
          placeholder="Enter Topic Title"
          className={twColors.inputField}
          title={topicData.title}
          onChange={(newValue) => {
            topicData.title = newValue;
            onTopicDataChange(topicData);
          }}
        />
        <SanEDDButton
          overline="ABOUT"
          placeholder="Enter a short description about topic."
          className={twColors.inputField}
          title={topicData.about}
          onChange={(newValue) => {
            topicData.about = newValue;
            onTopicDataChange(topicData);
          }}
        />
        <SectionHeader>SUBJECT</SectionHeader>
        <p className="">
          {breadString(topicData.breadcrumbs, true)}
        </p>
        <Button
          className={twColors.removeContainer}
          onClick={() => {
            setShowSubjectSelector(true);
          }}
        >
          Change Subject
        </Button>
        <SectionHeader>REQUIRES</SectionHeader>
        {
          "The topics this topic requires. The student must complete these topics before jumping on to reading this topic."
        }
        <TopicsGrid
          navigation={false}
          topics={topicData.requires}
          onDeleteTopic={(id) => {
            var confirmDelete = window.confirm(
              "Are you sure you want to remove this topic from requirements?"
            );
            if (confirmDelete) {
              let newRequires = [];

              for (const existingReq of topicData.requires) {
                if (existingReq.id != id) {
                  newRequires.push(existingReq);
                }
              }
              onTopicDataChange({ ...topicData, requires: newRequires });
            }
          }}
        />
        <Button
          className={twColors.addContainer}
          onClick={() => {
            setShowTopicSelector(true);
          }}
        >
          Add Required Topic
        </Button>
        <SectionHeader>ACTIONS</SectionHeader>
        <Button
          className={twColors.deleteContainer}
          onClick={() => {
            var confirmDelete = window.confirm(
              "Are you sure you want to delete this topic?"
            );
            if (confirmDelete) {
              onDeleteTopic();
            }
          }}
        >
          Delete This Topic
        </Button>
        <SectionHeader>PREVIEW</SectionHeader>
        <MobileTopicPreview topicData={topicData} />
        {/* <JSONViewer heading={'JSON View'}>{topicData}</JSONViewer> */}
      </ListContainer>
    );
}

function TopicsGrid({ topics, onDeleteTopic, navigation = true }) {
  return (
    <div
      className="flex flex-wrap gap-3"
    >
      {topics.map((item) => {
        return (
          <SanEDDButton
            key={item.id}
            topicToSubjectDraggable={true}
            topic_id={item.id}
            to={navigation ? APIEndpoints.TOPICS + item.id : ''}
            className="w-[200px]"
            title={item.title}
            overline={item.about}
            onDelete={
              onDeleteTopic
                ? () => {
                  onDeleteTopic(item.id);
                }
                : null
            }
          />
        );
      })}
    </div>
  );
}
