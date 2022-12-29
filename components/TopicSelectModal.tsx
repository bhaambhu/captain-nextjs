import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import SectionHeader from "./Texts/SectionHeader";
import { breadString } from "../config/utils";
import ListContainer from "./ListItems/ListContainer";
import SanEDDButton from "./Buttons/SanEDDButton";
import topicsAPIService from "../lib/APIServices/topicsAPIService";
import subjectsAPIService from "../lib/APIServices/subjectsAPIService";
import { Button } from "./Buttons/Button";
import { loadSubjects, SubjectTree } from "./SubjectTree";
import twColors from "../config/twColors";
import { TiDelete } from "react-icons/ti";
import { twMerge } from "tailwind-merge";

export default function TopicSelectModal({ onSelectTopic, onCancel, heading }) {
  const [tree, setTree] = useState(null);
  const [networkLoading, setNetworkLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null);

  var breads = "";
  if (selectedSubject) breads = breadString(selectedSubject.breadcrumbs);

  const loadSelectedSubject = async (subject_id) => {
    if (selectedSubject != null && selectedSubject.id == subject_id) return;
    setNetworkLoading(true);
    console.log("fetching selected subject's details...");
    const result = await subjectsAPIService.getSubjectDetail(subject_id)
    if (!result.ok) return "Error: " + result.problem;
    console.log(result.data);
    setSelectedSubject(result.data);
    setNetworkLoading(false);
    return result.data;
  };

  const createNewTopicAndCloseModal = async (name, subjectId) => {
    setNetworkLoading(true);
    const result = await topicsAPIService.createTopic(name, subjectId);
    if (!result.ok) return alert("Error: " + result.problem);
    setNetworkLoading(false);
    onSelectTopic(result.data);
    console.log("done");
  };

  useEffect(() => {
    loadSubjects(setNetworkLoading, setTree);
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
            className={twMerge(twColors.primaryContainer + ' w-[80%] h-[80%] flex flex-col p-3 rounded-sm border ')}
          >
            {/* Top Area - Heading and Close Button */}
            <div className="flex justify-between items-center">
              <SectionHeader bar={false} className='uppercase text-xl'>{heading}</SectionHeader>
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
              className="flex h-full mt-2.5 justify-between"
            >

              {/* Left Area - Subject Tree */}
              <div
                className={twMerge(twColors.surface2+'h-full overflow-y-auto w-full leading-8 p-1 rounded-md border shadow-inner')}
              >
                {networkLoading ? (
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
                  <ListContainer className={twMerge(twColors.surface3+' border-current shadow-lg')}>
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
