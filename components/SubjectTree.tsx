import Spinner from "@atlaskit/spinner";
import Tree, { mutateTree, moveItemOnTree } from '@atlaskit/tree'
import React, { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge';
import subjectsAPIService from "../lib/APIServices/subjectsAPIService";
import topicsAPIService from '../lib/APIServices/topicsAPIService';
import InfoPill from "./Pills/InfoPill";
import SanSpinner from "./SanSpinner";

const subjectDataFormat = Object.freeze({
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
})

const loadSubjects = async (setNetworkLoading, setTreeData) => {
  setNetworkLoading(true);
  console.log("fetching subjects...");
  // await new Promise((r) => setTimeout(r, 2000));
  const result = await subjectsAPIService.getRootLevelSubjects();
  if (!result.ok) return "Error: " + result.problem;
  console.log('received api response:', result.data);
  // convert children from JSONArray to simple array of IDS. add hasChildren and isExpanded fields
  let rootChildrenArray = [];
  let subjectsData = JSON.parse(JSON.stringify(subjectDataFormat))
  result.data.forEach((item) => {
    // Add item to our base subjectsData array
    subjectsData.items[item.id] = item;
    // Configurations for base subjectsData array, which requires a root, we add these subjects to its root as children
    rootChildrenArray.push(item.id);
    subjectsData.items[subjectsData.rootId].hasChildren = true;
    subjectsData.items[subjectsData.rootId].isExpanded = true;
  })
  subjectsData.items[subjectsData.rootId].children = rootChildrenArray;
  console.log("Setting tree for the first time to:", subjectsData);
  setTreeData(subjectsData);
  setNetworkLoading(false);
  return result.data;
}

function SubjectTree({ treeData, setTreeData, selectedSubjectId, setSelectedSubjectId, isNestingEnabled = false, onDropSubjectOnSubject = null, onDropTopicOnSubject = null }) {


  const PADDING_PER_LEVEL = 16;
  const ExpandingIcon = ({
    className = '',
    onClick,
    children,
  }) => {
    return (
      <div
        className={twMerge(`inline-flex  bg-san-dark-primary dark:bg-san-dark-primary w-10 justify-center items-center font-bold text-san-dark-on-primary dark:text-san-dark-on-primary border-current  border-r dark:border-san-on-surface cursor-pointer ${className}`)}
        onClick={onClick}
      >
        {children}
      </div>
    );
  };

  const getIcon = (item, onExpand, onCollapse) => {
    if (item.isChildrenLoading) {
      return (
        <ExpandingIcon onClick={() => onCollapse(item.id)}>
          <div className=' border-san-surface'>
            <Spinner appearance='inherit' size={24} />
          </div>
        </ExpandingIcon>
      );
    }
    if (item.hasChildren) {
      return item.isExpanded ? (
        <ExpandingIcon
          className='bg-san-surface-variant text-san-on-surface-variant'
          onClick={() => onCollapse(item.id)}
        >
          -
        </ExpandingIcon>
      ) : (
        <ExpandingIcon onClick={() => onExpand(item.id)}>+</ExpandingIcon>
      );
    }
    return <ExpandingIcon className=' bg-san-surface-variant dark:bg-san-dark-surface-variant  text-san-on-surface-variant dark:text-san-dark-on-surface-variant'>&bull;</ExpandingIcon>;
  };

  const onExpand = async (itemId) => {
    console.log("OnExpand on " + itemId);

    // 1. Marking the expanded item with `isChildrenLoading` flag
    // setTree((tree) => mutateTree(tree, itemId, { isChildrenLoading: true }));
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

  const renderItem = ({ item, onExpand, onCollapse, provided }) => {
    return (
      <div className='flex p-1'>
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {/* Subject Expandable Button */}
          <div className={`${selectedSubjectId == item.id ? 'bg-san-primary-container dark:bg-san-dark-primary-container text-san-on-primary-container dark:text-san-dark-on-primary-container border-current border-2' : 'bg-san-surface dark:bg-san-dark-surface text-san-on-surface dark:text-san-dark-on-surface border-san-on-surface border'} font-bold rounded overflow-hidden`}>
            {getIcon(item, onExpand, onCollapse)}
            <div
              onDrop={(e) => {
                e.preventDefault();
                const receivedTopicId = e.dataTransfer.getData("topic_id");
                if (item.id == selectedSubjectId) {
                  return;
                }
                var confirmRevert = window.confirm(
                  "Are you sure you want to move this topic over to the subject " +
                  item.name +
                  "?"
                );
                if (!confirmRevert) return;
                else onDropTopicOnSubject(receivedTopicId, item.id);
              }}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              className='inline-flex h-full px-2.5 cursor-pointer'
              onClick={() => {
                setSelectedSubjectId(item.id);
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
      {onDropSubjectOnSubject && <div className='w-fit mb-3'>
        <InfoPill message="Drag subjects to change order or group together" />
      </div>}
      <Tree
        tree={treeData}
        renderItem={renderItem}
        onExpand={onExpand}
        onCollapse={onCollapse}
        offsetPerLevel={PADDING_PER_LEVEL}
        onDragEnd={onDropSubjectOnSubject}
        isDragEnabled={onDropSubjectOnSubject}
        isNestingEnabled={isNestingEnabled}
      />
    </div>
  )
}

export { SubjectTree, subjectDataFormat, loadSubjects }