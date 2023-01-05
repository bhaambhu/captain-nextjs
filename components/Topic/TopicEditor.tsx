import React, { useState, useEffect } from "react";
import { stepType, stepTypeString } from "../../config/enums";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import SanEDDButton from "../Buttons/SanEDDButton";
import ListContainer from "../ListItems/ListContainer";
import SectionHeader from "../Texts/SectionHeader";
import TheoryStep from "./TheoryStep";
import MCQStep from "./MCQStep";
import TopicInfoStep from "./TopicInfoStep";
import topicsAPIService from "../../lib/APIServices/topicsAPIService";
import Modal from "../../components/Modal";
import twColors from "../../config/twColors";
import LoadingIndicatorForComponent from "../Loading/LoadingIndicatorForComponent";
import LoadingIndicatorFullScreen from "../Loading/LoadingIndicatorFullScreen";
import useAPI from "../../lib/useAPI";
import InfoPill from "../Pills/InfoPill";

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

  steps: [
    {
      sid: 0,
      title: "First Step",
      type: stepType.Theory,
      timeLength: "9 minutes",
      problemsSolved: "0 / 1 problems solved",
      sections: [
        {
          title: "First step first section",
          content: "First step first section text...",
        },
        {
          title: "First step second section",
          content: "First step second section text...",
        },
        {
          title: "First step third section",
          content: "First step third section text...",
        },
      ],
    },
    {
      sid: 1,
      title: "Find max",
      type: stepType.MCQ,
      timeLength: "9 minutes",
      difficulty: "Medium",
      content: `<p align="Justify"><b>Exponentiation</b> is a heavily used operation in public key cryptography. Which of the following options is the tightest upper bound on the number of multiplications required to compute b<sup>n</sup>&nbsp;mod m, 0≤b, n≤m?</p>`,
      options: [
        {
          content: `<p>O(n/log n)</p>`,
          correct: false,
        },
        {
          content: `<p> In this we need to compute like<br>
          C<sub>1</sub> = b<sup>n/2</sup> × b<sup>n/2</sup> <br>
          C<sub>2</sub> = b<sup>n/4</sup> × b<sup>n/4</sup> <br>
          C<sub>3</sub> = b<sup>n/8</sup> × b<sup>n/8</sup> <br>
          ⋮ <br>
          C<sub>k</sub> = b<sup>2</sup> × b<sup>2</sup> <br>
          Recurrence relation T(n) = T(n/2) + O(1)<br>
          T(n) = O(log n)</p>`,
          correct: false,
        },
        {
          content: `<p>O(log n)</p>`,
          correct: true,
        },
        {
          content: `<p>O(n)</p>`,
          correct: false,
        },
        {
          content: `Last option`,
          correct: false,
        },
      ],
      explanation: `<p> In this we need to compute like<br>
      C<sub>1</sub> = b<sup>n/2</sup> × b<sup>n/2</sup> <br>
      C<sub>2</sub> = b<sup>n/4</sup> × b<sup>n/4</sup> <br>
      C<sub>3</sub> = b<sup>n/8</sup> × b<sup>n/8</sup> <br>
      ⋮ <br>
      C<sub>k</sub> = b<sup>2</sup> × b<sup>2</sup> <br>
      Recurrence relation T(n) = T(n/2) + O(1)<br>
      T(n) = O(log n)</p>`,
      concepts: [
        {
          title: `Some Concept`,
          id: 12,
        },
        {
          title: `Another Concept`,
          id: 14,
        },
      ],
      exams: [
        {
          title: `GATE 2007`,
          id: 12,
        },
        {
          title: `UGC NET 2017 - November`,
          id: 15,
        },
      ],
    },
    {
      sid: 2,
      title: "Third Step",
      type: stepType.Theory,
      timeLength: "9 minutes",
      problemsSolved: "0 / 1 problems solved",
      sections: [
        {
          title: "Third Step First Section",
          content: "Third Step First Section Text",
        },
        {
          title: "Third Step Second Section",
          content: `
          Third Step Second Section Text
              `,
        },
      ],
    },
  ],
};

export default function TopicEditor({
  topic_id,
  unsavedChanges,
  setUnsavedChanges,
  onTopicSaved,
  onTopicDeletedOnline,
}) {
  const [topicData, setTopicData] = useState("Loading...");
  const [selectedStep, setSelectedStep] = useState({
    stepType: stepType.Info,
    sid: null,
  });

  const useGetTopicAPI = useAPI(topicsAPIService.getTopic)
  const useUpdateTopicAPI = useAPI(topicsAPIService.updateTopic)
  const useDeleteTopicAPI = useAPI(topicsAPIService.deleteTopic)
  
  const deleteTopic = async () => {
    // Logic to delete topic on server
    const result = await useDeleteTopicAPI.request(topicData.id);
    // const result = await topicsAPIService.deleteTopic(topicData.id);
    if (!result.ok) return "Error: " + result.problem;

    setUnsavedChanges(false);
    // The below function knows where to redirect
    onTopicDeletedOnline();
  };

  const saveTopic = async (newTopicData) => {
    console.log("saving topic data...");
    // await new Promise((r) => setTimeout(r, 2000));
    const result = await useUpdateTopicAPI.request(newTopicData);
    // const result = await topicsAPIService.updateTopic(newTopicData);
    if (!result.ok) return "Error: " + result.problem;
    console.log("Saved Topic Online");
    console.log(result.data);
    setUnsavedChanges(false);
    onTopicSaved(newTopicData);
    return result.data;
  };

  const loadTopic = async (id) => {
    console.log("fetching topic data...");
    // await new Promise((r) => setTimeout(r, 2000));
    const result = await useGetTopicAPI.request(id)
    if (!result.ok) return "Error: " + result.problem;
    console.log(result.data);
    setTopicData(result.data);
    // setTopicLoaded(true);
    setUnsavedChanges(false);
    return result.data;
  };

  useEffect(() => {
    // setTopicLoaded(false);
    loadTopic(topic_id);
    setSelectedStep({
      ...selectedStep,
      stepType: stepType.Info,
      sid: null,
    });
  }, [topic_id]);

  // SID is something we use to uniquely identify a step.
  // It is required so that we can re-position the steps while
  // uniquely editing the selected step.
  const getNextSID = () => {
    var currentMaxSID = 0;
    // First we find the max SID being used
    if (topicData.steps.length > 0) currentMaxSID = topicData.steps[0].sid;
    for (let i = 1; i < topicData.steps.length; i++) {
      if (topicData.steps[i].sid > currentMaxSID) {
        currentMaxSID = topicData.steps[i].sid;
      }
    }
    return currentMaxSID + 1;
  };

  const stepIndexfromStepID = (sid) => {
    for (let i = 0; i < topicData.steps.length; i++) {
      if (topicData.steps[i].sid === sid) {
        return i;
      }
    }
    return null;
  };

  const onStepDataChange = (stepData) => {
    var stepIndex = stepIndexfromStepID(stepData.sid);
    if (topicData.steps[stepIndex] == stepData) {
      return;
    }
    let currentTopicSteps = topicData.steps;
    currentTopicSteps[stepIndex] = stepData;
    setUnsavedChanges(true);
    setTopicData({ ...topicData, steps: currentTopicSteps });
  };

  // if (!topicLoaded) return <Modal />;

  if (!useGetTopicAPI.loadedOnce || !topicData) return <LoadingIndicatorFullScreen visible={true} />

  return (
    <div
      className="flex w-full gap-2.5"
    >
      <LoadingIndicatorFullScreen visible={useGetTopicAPI.loading || useUpdateTopicAPI.loading || useDeleteTopicAPI.loading} />
      {/* Left side section */}
      <div
        className="max-w-[200px]"
      >
        <DragDropContext
          onDragEnd={(param) => {
            const srcI = param.source.index;
            const desI = param.destination?.index;
            if (desI !== null) {
              // let currentTopic = Object.assign({}, topicData);
              let newSteps = topicData.steps;
              newSteps.splice(desI, 0, newSteps.splice(srcI, 1)[0]);
              // currentTopic.steps = newSteps;
              setUnsavedChanges(true);
              setTopicData({ ...topicData, steps: newSteps });
            }
          }}
        >
          <Droppable droppableId="droppable-1">
            {(provided, _) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <ListContainer
                  className={twColors.surface2}
                >
                  {/* Info list item */}
                  <SanEDDButton
                    onClick={() => {
                      setSelectedStep({
                        ...selectedStep,
                        stepType: stepType.Info,
                        sid: null,
                      });
                    }}
                    overline="Edit Topic"
                    title={topicData.title}
                    selected={selectedStep.stepType === stepType.Info}
                  />
                  <SanEDDButton
                    onClick={() => {
                      setSelectedStep({
                        ...selectedStep,
                        stepType: stepType.AssessQ,
                        sid: null,
                      });
                    }}
                    overline="Assessment MCQ"
                    title={topicData.assessor?.title}
                    selected={selectedStep.stepType === stepType.AssessQ}
                  />
                  <SectionHeader>STEPS IN TOPIC</SectionHeader>
                  {topicData.steps.length > 1 && <InfoPill message="Drag to re-order" />}
                  {topicData.steps?.map((step, i) => {
                    return (
                      <Draggable
                        key={i}
                        draggableId={"draggable-" + i}
                        index={i}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              display: "inherit",
                            }}
                          >
                            {/* List Item for Step (Theory/MCQ) */}
                            <SanEDDButton
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                boxShadow: snapshot.isDragging
                                  ? "0 0 .4rem #666"
                                  : "none",
                              }}
                              className="w-full"
                              overline={stepTypeString(step.type)}
                              title={step.title}
                              onDelete={() => {
                                var confirmDelete = window.confirm(
                                  "Are you sure you want to delete this whole step?"
                                );
                                if (confirmDelete) {
                                  // Load info step onto step displayer
                                  if (selectedStep.sid === step.sid) {
                                    console.log("setting step to", stepType.Info)
                                    setSelectedStep(selectedStep => {
                                      return {
                                        ...selectedStep,
                                        stepType: stepType.Info,
                                        sid: null,
                                      };
                                    });
                                  }
                                  // let currentTopic = Object.assign({}, topicData);
                                  let newSteps = topicData.steps;
                                  newSteps.splice(i, 1);
                                  // currentTopic.steps = newSteps;
                                  setUnsavedChanges(true);
                                  setTopicData({
                                    ...topicData,
                                    steps: newSteps,
                                  });
                                }
                              }}
                              dragIcon
                              onClick={() => {
                                console.log("setting selected step via onclick to ", step.type)
                                setSelectedStep({
                                  ...selectedStep,
                                  stepType: step.type,
                                  sid: step.sid,
                                });
                              }}
                              selected={selectedStep.sid === step.sid}
                            />
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                  <div
                    className="flex gap-2.5"
                  >
                    <SanEDDButton
                      onClick={() => {
                        // let newTopic = Object.assign({}, topicData);
                        let newSteps = topicData.steps;
                        newSteps.push({
                          sid: getNextSID(),
                          title: "",
                          type: stepType.Theory,
                          timeLength: "9 minutes",
                          problemsSolved: "0 / 1 problems solved",
                          sections: [
                            {
                              title: "",
                              content: "",
                            },
                          ],
                        });
                        setUnsavedChanges(true);
                        setTopicData({ ...topicData, steps: newSteps });
                      }}
                      className={twColors.addContainer}
                      overline="Add New Step"
                      title="THEORY"
                    />
                    <SanEDDButton
                      onClick={() => {
                        // let newTopic = Object.assign({}, topicData);
                        let newSteps = topicData.steps;
                        newSteps.push({
                          sid: getNextSID(),
                          title: "",
                          type: stepType.MCQ,
                          timeLength: "9 minutes",
                          difficulty: "Medium",
                          content: "",
                          options: [
                            {
                              content: "",
                              correct: true,
                            },
                          ],
                          explanation: "",
                          concepts: [],
                          exams: [],
                        });
                        setUnsavedChanges(true);
                        setTopicData({ ...topicData, steps: newSteps });
                      }}
                      className={twColors.addContainer}
                      overline="Add New Step"
                      title="MCQ"
                    />
                  </div>
                  {unsavedChanges && (
                    <>
                      <SectionHeader>ACTIONS</SectionHeader>
                      <SanEDDButton
                        onClick={() => {
                          saveTopic(topicData);
                        }}
                        className={twColors.unsavedContainer}
                        overline="Unsaved Changes"
                        title="SAVE TOPIC ONLINE"
                      />
                    </>
                  )}
                </ListContainer>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      {/* Right section */}
      <div className="w-full">
        {console.log("Selected step is ", selectedStep.stepType)}
        {selectedStep.stepType === stepType.Info ? (
          <TopicInfoStep
            topicData={topicData}
            onTopicDataChange={(newTopicData) => {
              setUnsavedChanges(true);
              setTopicData({ ...topicData, ...newTopicData });
            }}
            onDeleteTopic={deleteTopic}
          />
        ) :
          // <div>
          //     <pre>{JSON.stringify(topic, null, 2)}</pre>
          //   </div>
          selectedStep.stepType === stepType.Theory ? (
            <TheoryStep
              theoryStepData={Object.assign(
                {},
                topicData.steps[stepIndexfromStepID(selectedStep.sid)]
              )}
              onTheoryStepDataChange={(data) => {
                onStepDataChange(data);
              }}
            />
          ) : selectedStep.stepType === stepType.MCQ ? (
            <MCQStep
              mcqStepData={Object.assign(
                {},
                topicData.steps[stepIndexfromStepID(selectedStep.sid)]
              )}
              onMCQStepDataChange={(data) => {
                onStepDataChange(data);
              }}
            />
          ) : selectedStep.stepType === stepType.AssessQ ? (
            <MCQStep
              mcqStepData={Object.assign({}, topicData.assessor)}
              onMCQStepDataChange={(data) => {
                setUnsavedChanges(true);
                setTopicData({ ...topicData, assessor: data });
              }}
            />
          ) : null}
      </div>
    </div>
  );
}
