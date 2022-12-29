import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import React, { useEffect, useState } from 'react'
import JSONViewer from '../../../components/JSONViewer';
import TopicEditor from '../../../components/Topic/TopicEditor';
import Modal from '../../../components/Modal';
import dimensions from '../../../config/dimensions';
import { stepType } from '../../../config/enums';
import pathsAPIService from '../../../lib/APIServices/pathsAPIService';
import useApi from '../../../lib/useAPI';
import PathInfoStep from '../../../components/Path/PathInfoStep';
import ListContainer from '../../../components/ListItems/ListContainer';
import SanEDDButton from '../../../components/Buttons/SanEDDButton';
import SectionHeader from '../../../components/Texts/SectionHeader';
import colors from '../../../config/colors';
import TopicSelectModal from '../../../components/TopicSelectModal';
import { Button } from '../../../components/Buttons/Button';
import twColors from '../../../config/twColors';

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   try {
//     const result = await pathDBHelper.getById(+String(params?.id));
//     return {
//       props: result,
//     }
//   } catch (e) {
//     return {
//       notFound: true,
//     }
//   }
// };

export default function Path() {
  const router = useRouter();
  const { id: pathID } = router.query;
  const [showTopicSelector, setShowTopicSelector] = useState(false);
  const [topicUnsavedChanges, setTopicUnsavedChanges] = useState(false);
  const [pathUnsavedChanges, setPathUnsavedChanges] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState({
    stepType: stepType.Info,
    id: null,
  });

  const pathDetailsAPI = useApi(pathsAPIService.getPathDetail);
  const deletePathAPI = useApi(pathsAPIService.deletePath);
  const savePathAPI = useApi(pathsAPIService.savePathDetail);

  const deletePath = async () => {
    await deletePathAPI.request(pathID);
    setPathUnsavedChanges(false);
    router.replace('/paths');
  }

  const savePath = async (newPathDetails) => {
    await savePathAPI.request(newPathDetails);
    setPathUnsavedChanges(false);
  };

  const loadPath = async (id) => {
    await pathDetailsAPI.request(id);
  };

  useEffect(() => {
    if (!router.isReady) return;
    console.log('loading now')
    loadPath(pathID);
  }, [pathID, router.isReady]);

  if (!pathDetailsAPI.loadedOnce) return <Modal />

  // return(
  //   <div>
  //     <JSONViewer heading={'Path Data Edit Mode'}>{pathDetailsAPI.data}</JSONViewer>
  //   </div>
  // )

  return (
    <div
      className='flex gap-2.5 p-3'
    >
      {showTopicSelector && (
        <TopicSelectModal
          heading={"Select Topic"}
          onSelectTopic={(selectedTopic) => {
            console.log("Selected topic:");
            console.log(selectedTopic);

            // Find max order currently used, also check if this topic is already in topic_sequence
            var maxOrder = 0;
            for (
              let i = 0;
              i < pathDetailsAPI.data.topic_sequence.length;
              i++
            ) {
              if (
                pathDetailsAPI.data.topic_sequence[i].topic.id ==
                selectedTopic.id
              ) {
                alert("This topic is already added in this path.");
                return;
              }
              if (pathDetailsAPI.data.topic_sequence[i].order > maxOrder)
                maxOrder = pathDetailsAPI.data.topic_sequence[i].order;
            }
            maxOrder = maxOrder + 1;

            pathDetailsAPI.data.topic_sequence.push({
              order: maxOrder,
              topic: selectedTopic,
            });
            pathDetailsAPI.setData({
              ...pathDetailsAPI.data,
              topic_sequence: pathDetailsAPI.data.topic_sequence,
            });
            setShowTopicSelector(false);
            setPathUnsavedChanges(true);
          }}
          onCancel={() => {
            setShowTopicSelector(false);
          }}
        />
      )}
      {/* <Prompt
        when={pathUnsavedChanges || topicUnsavedChanges}
        message="You have unsaved changes that will be forgotten. Are you sure you want to leave?"
      /> */}

      {/* Left side section */}
      <div className='max-w-[200px]'>
        <DragDropContext
          onDragEnd={(param) => {
            const srcI = param.source.index;
            const desI = param.destination?.index;
            if (desI !== null) {
              // let currentPath = Object.assign({}, pathDetail);
              // currentPath.topic_sequence = newTopicSequence;

              // Re-arrange objects in pathDetail.topic_sequence
              let newTopicSequence = pathDetailsAPI.data.topic_sequence;
              newTopicSequence.splice(
                desI,
                0,
                newTopicSequence.splice(srcI, 1)[0]
              );
              // Re-assign 'order' attribute of objects in pathDetail.topic_sequence
              for (let i = 0; i < newTopicSequence.length; i++) {
                newTopicSequence[i].order = i + 1;
              }
              setPathUnsavedChanges(true);
              pathDetailsAPI.setData({
                ...pathDetailsAPI.data,
                topic_sequence: newTopicSequence,
              });
            }
          }}
        >
          <Droppable droppableId="droppable-1">
            {(provided, _) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <ListContainer
                  className={twColors.surface1}
                >
                  {/* Info list item */}
                  <SanEDDButton
                    onClick={() => {
                      if (topicUnsavedChanges) {
                        var confirmRevert = window.confirm(
                          "This topic has unsaved changes. They will be removed if you have not saved them yet. Are you sure you want to proceed?"
                        );
                        if (!confirmRevert) return;
                        else setTopicUnsavedChanges(false);
                      }

                      setSelectedTopic({
                        ...selectedTopic,
                        stepType: stepType.Info,
                        id: null,
                      });
                    }}
                    overline="Edit Path"
                    title={pathDetailsAPI.data.title}
                    selected={selectedTopic.stepType === stepType.Info}
                  />
                  <SectionHeader>TOPICS IN PATH</SectionHeader>
                  {pathDetailsAPI.data.topic_sequence.map((item, i) => {
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
                              className='w-full'
                              overline={"Topic"}
                              title={item.topic.title}
                              onDelete={() => {
                                var confirmDelete = window.confirm(
                                  "Are you sure you want to remove this topic from this path?"
                                );
                                if (confirmDelete) {
                                  if (selectedTopic.id == item.topic.id) {
                                    if (topicUnsavedChanges) {
                                      var confirmRevert = window.confirm(
                                        "This topic has unsaved changes. They will be removed if you have not saved them yet. Are you sure you want to proceed?"
                                      );
                                      if (!confirmRevert) return;
                                      else setTopicUnsavedChanges(false);
                                    }

                                    setSelectedTopic({
                                      ...selectedTopic,
                                      stepType: stepType.Info,
                                      id: null,
                                    });
                                  }
                                  // let currentTrack = Object.assign({}, pathDetail);
                                  let newTopicSequence =
                                    pathDetailsAPI.data.topic_sequence;
                                  newTopicSequence.splice(i, 1);
                                  // currentTrack.topic_sequence = newTopicSequence;
                                  // Re-assign 'order' attribute of objects in pathDetail.topic_sequence
                                  for (
                                    let i = 0;
                                    i < newTopicSequence.length;
                                    i++
                                  ) {
                                    newTopicSequence[i].order = i + 1;
                                  }
                                  setPathUnsavedChanges(true);
                                  pathDetailsAPI.setData({
                                    ...pathDetailsAPI.data,
                                    topic_sequence: newTopicSequence,
                                  });
                                }
                              }}
                              draggable
                              onClick={() => {
                                if (selectedTopic.id == item.topic.id) return;
                                if (topicUnsavedChanges) {
                                  var confirmRevert = window.confirm(
                                    "This topic has unsaved changes. They will be removed if you have not saved them yet. Are you sure you want to proceed?"
                                  );
                                  if (!confirmRevert) return;
                                  else setTopicUnsavedChanges(false);
                                }
                                setSelectedTopic({
                                  ...selectedTopic,
                                  stepType: stepType.Topic,
                                  id: item.topic.id,
                                });
                              }}
                              selected={selectedTopic.id === item.topic.id}
                            />
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                  <div>
                    {/* <Button
                      onClick={() => {
                        setShowTopicSelector(true);
                      }}
                      className="bg-san-additem-container w-fit text-san-on-additem-container border-san-on-additem-container"
                    >Add Topic</Button> */}
                    <SanEDDButton
                      onClick={() => {
                        setShowTopicSelector(true);
                      }}
                      overline="Add"
                      className={twColors.add}
                      title="TOPIC"
                    />
                  </div>
                  {pathUnsavedChanges && (
                    <>
                      <SectionHeader>ACTIONS</SectionHeader>
                      <SanEDDButton
                        onClick={() => {
                          savePath(pathDetailsAPI.data);
                        }}
                        className={twColors.unsaved}
                        overline="Unsaved Changes"
                        title="SAVE PATH ONLINE"
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
      <div
        className="flex flex-1"
      >
        {selectedTopic.stepType === stepType.Info ? (
          <PathInfoStep
            pathData={pathDetailsAPI.data}
            onPathDataChange={(newPathDetails) => {
              setPathUnsavedChanges(true);
              pathDetailsAPI.setData({
                ...pathDetailsAPI.data,
                ...newPathDetails,
              });
            }}
            onDeletePath={deletePath}
          />
        ) : selectedTopic.stepType === stepType.Topic ? (
          <TopicEditor
            onTopicDeletedOnline={() => {
              alert("lets remove this topic from path list");
            }}
            topic_id={selectedTopic.id}
            unsavedChanges={topicUnsavedChanges}
            setUnsavedChanges={setTopicUnsavedChanges}
            onTopicSaved={(updatedTopicData) => {
              pathDetailsAPI.setData({
                ...pathDetailsAPI.data,
                topic_sequence: [...pathDetailsAPI.data.topic_sequence].map(
                  (object) => {
                    if (object.topic.id === updatedTopicData.id) {
                      return {
                        ...object,
                        topic: {
                          ...object.topic,
                          title: updatedTopicData.title,
                          about: updatedTopicData.about,
                          dependencies: updatedTopicData.dependencies,
                          breadcrumbs: updatedTopicData.breadcrumbs,
                        },
                      };
                    } else return object;
                  }
                ),
              });
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
