import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import SectionHeader from "./Texts/SectionHeader";
import ListContainer from "./ListItems/ListContainer";
import SanEDDButton from "./Buttons/SanEDDButton";
import topicsAPIService from "../lib/APIServices/topicsAPIService";
import subjectsAPIService from "../lib/APIServices/subjectsAPIService";
import { Button } from "./Buttons/Button";
import { loadSubjects, SubjectTree } from "./SubjectTree";
import twColors from "../config/twColors";
import { TiDelete } from "react-icons/ti";
import { twMerge } from "tailwind-merge";
import { breadString } from "../lib/utils";
import ContainerWithLoading from "./ContainerWithLoading";

export default function TopicSelectModal({ onSelectTopic, onCancel, heading }) {
  const [tree, setTree] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [loadingTree, setLoadingTree] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null);

  var breads = "";
  if (selectedSubject) breads = breadString(selectedSubject.breadcrumbs);

  const loadSelectedSubject = async (subject_id) => {
    if (selectedSubject != null && selectedSubject.id == subject_id) return;
    setDetailsLoading(true);
    console.log("fetching selected subject's details...");
    const result = await subjectsAPIService.getSubjectDetail(subject_id)
    if (!result.ok) return "Error: " + result.problem;
    console.log(result.data);
    setSelectedSubject(result.data);
    setDetailsLoading(false);
    return result.data;
  };

  const createNewTopicAndCloseModal = async (name, subjectId) => {
    setDetailsLoading(true);
    const result = await topicsAPIService.createTopic(name, subjectId);
    if (!result.ok) return alert("Error: " + result.problem);
    setDetailsLoading(false);
    onSelectTopic(result.data);
    console.log("done");
  };

  useEffect(() => {
    loadSubjects(setLoadingTree, setTree);
  }, []);

  useEffect(() => {
    if (selectedSubjectId)
      loadSelectedSubject(selectedSubjectId);
  }, [selectedSubjectId])

  return (
    <div>
      {ReactDOM.createPortal(
        // The Whole Screen
        <div
          className='fixed w-full h-full left-0 top-0 backdrop-blur bg-black/50 flex justify-center items-center'
        >
          {/* The Window */}
          <div
            className={twMerge(twColors.primaryContainer + ' w-[80%] h-[80%] flex flex-col rounded-sm border ')}
          >
            {/* Top Area - Heading and Close Button */}
            <div className="flex justify-between items-center p-1">
              <SectionHeader bar={false} className='uppercase text-xl px-1'>{heading}</SectionHeader>
              <div className="text-4xl leading-none flex cursor-pointer" title='Close Window'>
                <TiDelete
                  onClick={onCancel}
                  className={twColors.cross}
                />
                {/* &ndash; */}
              </div>
            </div>

            {/* Bottom Area - Content */}
            <div
              className={twMerge(twColors.surface2 + "flex h-full justify-between p-3 ")}
            >

              {/* Left Area - Subject Tree */}
              <div
                className={twMerge('h-full overflow-y-auto w-full leading-8 p-1 ')}
              >
                {loadingTree ? (
                  "Loading..."
                ) : (
                  <SubjectTree
                    treeData={tree}
                    setTreeData={setTree}
                    selectedSubjectId={selectedSubjectId}
                    setSelectedSubjectId={setSelectedSubjectId}
                  />
                )}
              </div>

              {/* <div className="bg-red-200 w-[50%]">
                aa
              </div> */}
              {/* Right Area - Subject Topics Display */}
              <div
                className="w-[50%]"
              >
                <div className="ml-2 h-full flex flex-col justify-between">
                  <ContainerWithLoading loading={detailsLoading} className=' '>
                    <ListContainer className={twMerge(twColors.surface1 + ' border-current shadow-lg w-full')}>
                      {selectedSubject ? (
                        <>
                          <SectionHeader bar={false} className='uppercase'>{selectedSubject.name}</SectionHeader>
                          <SectionHeader>TOPICS</SectionHeader>
                          {selectedSubject.topics.map((item) => {
                            return (
                              <SanEDDButton
                                key={item.id}
                                overline={item.about}
                                title={item.title}
                                onClick={() => {
                                  setSelectedTopic({
                                    ...selectedTopic,
                                    ...item,
                                  });
                                }}
                                selected={selectedTopic?.id === item.id}
                              />
                            );
                          })}
                          <SectionHeader>ACTIONS ON SUBJECT</SectionHeader>
                          <SanEDDButton
                            overline={"Create New"}
                            title={"TOPIC"}
                            className={twColors.addContainer}
                            onClick={() => {
                              const topicName = window.prompt(
                                "Enter new topic's name:"
                              );
                              if (topicName === null) return;
                              createNewTopicAndCloseModal(
                                topicName,
                                selectedSubject.id
                              );
                            }}
                          />
                        </>
                      ) : <div>Select a subject to list its topics</div>}
                    </ListContainer>
                  </ContainerWithLoading>
                  {selectedTopic && (
                    <Button
                      className={twColors.add + ' self-end shadow-lg '}
                      onClick={() => {
                        onSelectTopic(selectedTopic);
                      }}
                    >
                      Select {selectedTopic.title}
                    </Button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>,
        document.getElementById("modal-root") as HTMLElement
      )}
    </div>
  );
}
