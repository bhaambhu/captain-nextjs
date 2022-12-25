import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import colors from "../config/colors";
import dimensions from "../config/dimensions";
import SectionHeader from "./Texts/SectionHeader";
import subjectsAPIService from "../lib/APIServices/subjectsAPIService";
import { Button, TextButton } from "./Button";
import Tree, { mutateTree, moveItemOnTree } from "@atlaskit/tree";
import Spinner from "@atlaskit/spinner";
import { breadString, makeSubjectAPIDataReadyForAtlaskit } from "../config/utils";

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

export default function SubjectSelectModal({
  onSelectSubject,
  onCancel,
  heading,
}) {
  const [treeData, setTreeData] = useState(null);
  const [networkLoading, setNetworkLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null);
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
    });
    subjectsData.items[subjectsData.rootId].children = rootChildrenArray;
    console.log("Setting tree for the first time");
    setTreeData(subjectsData);
    setNetworkLoading(false);
    return result.data;
  };

  useEffect(() => {
    loadSubjects();
  }, []);

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
          borderTopLeftRadius: 4,
          borderBottomLeftRadius: 4,
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
    // setTreeData((tree) => mutateTree(tree, itemId, { isChildrenLoading: true }));
    treeData.items[itemId].isChildrenLoading = true;
    setTreeData({ ...treeData, ...treeData });

    // 2. Make the async server request
    console.log("fetching children for " + itemId);
    const result = await subjectsAPIService.getSubjectChildren(itemId);
    if (!result.ok) return "Error: " + result.problem;
    console.log('received api data on expand', result.data);

    // Add the received children to the tree data
    result.data.forEach((item) => {
      treeData.items[item.id] = item;
    });
    // 3. When the result comes back we can mutate the tree.
    //    It's important to get a fresh reference from the state.
    const currentItem = treeData.items[itemId];
    if (currentItem.isChildrenLoading) {
      currentItem.isExpanded = true;
      currentItem.isChildrenLoading = false;
    }
    treeData.items[itemId] = currentItem;
    setTreeData({ ...treeData, ...treeData });
    return result.data;
  };
  const onCollapse = (itemId) => {
    setTreeData((treeData) =>
      mutateTree(treeData, itemId, { isExpanded: false, isChildrenLoading: false })
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
              // backgroundColor: colors.bgSurface,
              paddingRight: 10,
            }}
          >
            {getIcon(item, onExpand, onCollapse)}
            <div
              style={{
                display: "inline-flex",
                backgroundColor:
                  selectedSubject == item
                    ? colors.greenBGLight
                    : colors.bgSurface,
                borderTopRightRadius: 4,
                borderBottomRightRadius: 4,
                height: "100%",
                padding: "0px 10px",
                cursor: "pointer",
              }}
              onClick={() => {
                setSelectedSubject(item);
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
                padding: dimensions.contentDistance,
              }}
            >
              <SectionHeader>{heading}</SectionHeader>
              {/* Content */}
              <div
                style={{
                  marginTop: dimensions.contentDistance,
                  marginBottom: dimensions.contentDistance,
                  width: 500,
                  maxHeight: 500,
                  overflowY: "scroll",
                  backgroundColor: colors.bgDisabled,
                  lineHeight: 2,
                }}
              >
                {networkLoading ? (
                  "Loading..."
                ) : (
                  <Tree
                    tree={treeData}
                    renderItem={renderItem}
                    onExpand={onExpand}
                    onCollapse={onCollapse}
                    offsetPerLevel={PADDING_PER_LEVEL}
                  />
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <TextButton
                  style={{ display: "inline-flex" }}
                  onClick={onCancel}
                >
                  Close
                </TextButton>
                {selectedSubject && (
                  <TextButton
                    style={{ display: "inline-flex" }}
                    onClick={() => {
                      onSelectSubject(selectedSubject);
                    }}
                  >
                    Select {selectedSubject.name}
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
