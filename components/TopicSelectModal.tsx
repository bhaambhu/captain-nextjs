import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import colors from "../config/colors";
import dimensions from "../config/dimensions";
import SectionHeader from "./Texts/SectionHeader";
import Tree, { mutateTree, moveItemOnTree } from "@atlaskit/tree";
import Spinner from "@atlaskit/spinner";
import { breadString, makeSubjectAPIDataReadyForAtlaskit } from "../config/utils";
import ListContainer from "./ListItems/ListContainer";
import ListItemTopic from "./ListItems/ListItemTopic";
import topicsAPIService from "../lib/APIServices/topicsAPIService";
import subjectsAPIService from "../lib/APIServices/subjectsAPIService";
import { Button, TextButton } from "./Button";

const subjectsData = {
  rootId: 1,
  items: {
    1: {
      id: 1,
      children: [],
      hasChildren: false,
      isExpanded: false,
      isChildrenLoading: false,
      name: "root",
      display_name: "root",
    },
  },
};

export default function TopicSelectModal({ onSelectTopic, onCancel, heading }) {
  const [tree, setTree] = useState(null);
  const [networkLoading, setNetworkLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  var breads = "";
  if (selectedSubject) breads = breadString(selectedSubject.breadcrumbs);

  const loadSubjects = async () => {
    setNetworkLoading(true);
    console.log("fetching subjects...");
    // await new Promise((r) => setTimeout(r, 2000));
    const result = await subjectsAPIService.getRootLevelSubjects();
    if (!result.ok) return "Error: " + result.problem;
    console.log('received api response:', result.data);

    var rootChildrenArray = [];
    result.data.forEach((item) => {
      // Add item to our base subjectsData array
      subjectsData.items[item.id] = item;
      // Configurations for base subjectsData array, which requires a root, we add these subjects to its root as children
      rootChildrenArray.push(item.id);
      subjectsData.items[subjectsData.rootId].hasChildren = true;
      subjectsData.items[subjectsData.rootId].isExpanded = true;
    })

    subjectsData.items[subjectsData.rootId].children = rootChildrenArray;
    console.log("Setting tree for the first time");
    setTree(subjectsData);
    setNetworkLoading(false);
    return result.data;
  };

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

  useEffect(() => {
    loadSubjects();
  }, []);

  const createNewTopicAndCloseModal = async (name, subjectId) => {
    setNetworkLoading(true);
    const result = await topicsAPIService.createTopic(name, subjectId);
    if (!result.ok) return alert("Error: " + result.problem);
    setNetworkLoading(false);
    onSelectTopic(result.data);
    console.log("done");
  };

  const PreTextIcon = ({
    bgcolor = colors.secondaryLight,
    onClick,
    children,
  }) => {
    return (
      <div
        style={{
          display: "inline-flex",
          padding: "0px 15px",
          backgroundColor: bgcolor,
          cursor: "pointer",
        }}
        onClick={onClick}
      >
        {children}
      </div>
    );
  };
  const onExpand = async (itemId) => {
    console.log("OnExpand on " + itemId);

    // 1. Marking the expanded item with `isChildrenLoading` flag
    // setTree((tree) => mutateTree(tree, itemId, { isChildrenLoading: true }));
    tree.items[itemId].isChildrenLoading = true;
    setTree({ ...tree, ...tree });

    // 2. Make the async server request
    console.log("fetching children for " + itemId);
    const result = await subjectsAPIService.getSubjectChildren(itemId);
    if (!result.ok) return "Error: " + result.problem;
    console.log(result.data);

    // Add the received children to the tree data
    result.data.forEach((item) => {
      tree.items[item.id] = item;
    });
    // 3. When the result comes back we can mutate the tree.
    //    It's important to get a fresh reference from the state.
    const currentItem = tree.items[itemId];
    if (currentItem.isChildrenLoading) {
      currentItem.isExpanded = true;
      currentItem.isChildrenLoading = false;
    }
    tree.items[itemId] = currentItem;
    setTree({ ...tree, ...tree });
    return result.data;
  };
  const onCollapse = (itemId) => {
    setTree((tree) =>
      mutateTree(tree, itemId, { isExpanded: false, isChildrenLoading: false })
    );
  };
  const getIcon = (item, onExpand, onCollapse) => {
    if (item.isChildrenLoading) {
      return (
        <PreTextIcon onClick={() => onCollapse(item.id)}>
          <div>
            <Spinner appearance="inherit" size={12} />
          </div>
        </PreTextIcon>
      );
    }
    if (item.hasChildren) {
      return item.isExpanded ? (
        <PreTextIcon
          bgcolor={colors.bgDefault}
          onClick={() => onCollapse(item.id)}
        >
          -
        </PreTextIcon>
      ) : (
        <PreTextIcon onClick={() => onExpand(item.id)}>+</PreTextIcon>
      );
    }
    return <PreTextIcon bgcolor={colors.textDisabled}>&bull;</PreTextIcon>;
  };
  const PADDING_PER_LEVEL = 16;
  const renderItem = ({ item, onExpand, onCollapse, provided }) => {
    return (
      <div
        style={{
          display: "flex",
          padding: 5,
        }}
      >
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div
            style={{
              border: selectedSubject?.id == item.id ? "2px solid" : "",
              borderRadius: 4,
              borderColor: colors.secondaryDark,
              overflow: "hidden",
            }}
          >
            {getIcon(item, onExpand, onCollapse)}
            <div
              style={{
                display: "inline-flex",
                backgroundColor: colors.bgSurface,
                height: "100%",
                padding: "0px 10px",
                cursor: "pointer",
              }}
              onClick={() => {
                loadSelectedSubject(item.id);
              }}
            >
              {item ? item.name : ""}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {ReactDOM.createPortal(
        <div
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            left: 0,
            top: 0,
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              // backgroundColor: "red",
              display: "inline-flex",
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                backgroundColor: colors.bgSurface,
                borderRadius: 2,
                width: "80%",
                height: "80%",
                display: "flex",
                flexDirection: "column",
                padding: dimensions.contentDistance,
              }}
            >
              <SectionHeader>{heading}</SectionHeader>
              {/* Content */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexGrow: 1,
                  marginTop: dimensions.contentDistance,
                  marginBottom: dimensions.contentDistance,
                }}
              >
                <div
                  style={{
                    maxHeight: 500,
                    flexGrow: 1,
                    overflow: "scroll",
                    backgroundColor: colors.bgDisabled,
                    lineHeight: 2,
                  }}
                >
                  {networkLoading ? (
                    "Loading..."
                  ) : (
                    <Tree
                      tree={tree}
                      renderItem={renderItem}
                      onExpand={onExpand}
                      onCollapse={onCollapse}
                      offsetPerLevel={PADDING_PER_LEVEL}
                    />
                  )}
                </div>
                {selectedSubject && (
                  <div className="overflow-y-scroll min-w-[225px]"
                  // style={{ overflowY: "scroll", minWidth: 225 }}
                  >
                    <ListContainer>
                      <SectionHeader>{selectedSubject.name}</SectionHeader>
                      <SectionHeader>Topics</SectionHeader>
                      {selectedSubject.topics.map((item) => {
                        return (
                          <ListItemTopic
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
                      <ListItemTopic
                        overline={"Add New"}
                        title={"TOPIC"}
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
                    </ListContainer>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <TextButton
                  style={{ display: "inline-flex" }}
                  onClick={onCancel}
                >
                  Close
                </TextButton>
                {selectedTopic && (
                  <TextButton
                    style={{ display: "inline-flex" }}
                    onClick={() => {
                      onSelectTopic(selectedTopic);
                    }}
                  >
                    Select {selectedTopic.title}
                  </TextButton>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.getElementById("modal-root") as HTMLElement
      )}
    </div>
  );
}
