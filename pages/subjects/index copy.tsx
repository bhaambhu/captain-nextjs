import React, { useEffect, useState } from 'react'
import JSONViewer from '../../components/JSONViewer';
import Modal from '../../components/Modal';
import subjectsAPIService from '../../lib/APIServices/subjectsAPIService';
import Spinner from "@atlaskit/spinner";
import Tree, {
  mutateTree,
  moveItemOnTree,
  RenderItemParams,
  TreeItem,
  TreeData,
  ItemId,
  TreeSourcePosition,
  TreeDestinationPosition,
} from '@atlaskit/tree';
import SubjectInfo from '../../components/SubjectInfo';
import topicsAPIService from '../../lib/APIServices/topicsAPIService';
import { Button } from '../../components/Buttons/Button';
import SectionHeader from '../../components/Texts/SectionHeader';
import { twMerge } from 'tailwind-merge';
import twColors from '../../config/twColors';

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

const PADDING_PER_LEVEL = 16;
const SpinnerContainer = (props) => {
  return (
    <span
      style={{
        display: "inline-flex",
        width: "16px",
        justifyContent: "flex-start",
      }}
      {...props}
    />
  );
};
const ExpandingIcon = ({
  className = '',
  onClick,
  children,
}) => {
  return (
    <div
      className={twMerge(`inline-flex px-3.5 bg-san-primary w-10 justify-center font-bold text-san-on-primary border-r-san-on-surface border-r ${className}`)}
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
        <div className='text-san-dark-on-surface border-san-surface'>
          <Spinner appearance='invert' size={24} />
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
  return <ExpandingIcon className='bg-san-surface-variant text-san-on-surface-variant'>&bull;</ExpandingIcon>;
};
export default function Subjects(props) {
  const [treeData, setTreeData] = useState(null);

  // This needs to be true otherwise atlaskit/tree library produces errors - it needs to be delayed from loading
  const [networkLoading, setNetworkLoading] = useState(true);

  const [selectedSubject, setSelectedSubject] = useState();
  const [pendingChanges, setPendingChanges] = useState(false);

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

  const getIDFromPosition = (parentID, index, tree) => {
    return tree.items[parentID].children[index];
  };

  const onDeleteSubject = async (id, parentId) => {
    setNetworkLoading(true);
    await new Promise((r) => setTimeout(r, 100));

    // If the node we're deleting isn't expanded yet, and has children,
    // those children nodes need to be downloaded into tree, because they'll
    // need to be shown now because they will become children of this node's parent
    // which is currently in expanded state
    if (!treeData.items[id].isExpanded) {
      // Make the server request for downloading children nodes
      console.log(
        "Because this node wasn't expanded yet, downloading its children nodes..."
      );
      const childNodesResponse = await subjectsAPIService.getSubjectChildren(id);
      if (!childNodesResponse.ok) return "Error: " + childNodesResponse.problem;
      console.log(childNodesResponse.data);


      // Add the received children to the tree data
      childNodesResponse.data.forEach((item) => {
        treeData.items[item.id] = item;
      });
    }

    const result = await subjectsAPIService.deleteSubject(id);
    if (!result.ok) return alert("Error: " + result.problem);
    const childrenOfDeletedNode = treeData.items[id].children;
    var foundParent = false;

    // add these children to parent node
    console.log("searching for nodes who's children include:" + id);
    for (const [key, value] of Object.entries(treeData.items)) {
      console.log(value);

      // this is the parent
      // go through children to find if this is the parent node
      for (var i = 0; i < value.children.length; i++) {
        if (value.children[i] === id) {
          foundParent = true;
          console.log("Found parent!, children set of " + value.name + " is :");
          console.log(value.children);
          value.children.splice(i, 1);
          console.log("After splicing:");
          console.log(value.children);
          i--;
          // This is the parent
          // add children of deleted node to this parent node
          value.children = [...value.children, ...childrenOfDeletedNode];
          break;
        }
      }
      // If this was the parent node, break away
      // If it has only one child, set it's hasChildren to false, because the child is
      // going to delete anyway.
      if (foundParent) {
        if (value.children.length < 2) {
          value.hasChildren = false;
        }
        break;
      }
    }
    if (!foundParent) {
      alert("Found parent is still false.");
      return;
    }
    // Delete entire node info from tree
    delete treeData.items[id];
    setTreeData({ ...treeData, ...treeData });
    console.log("set tree to:");
    console.log(treeData);
    setNetworkLoading(false);
    setSelectedSubject(null);
    console.log("done");
  };

  const reparentTopic = async (topicId, subjectId) => {
    setNetworkLoading(true);
    const result = await topicsAPIService.updateTopicSubject(
      topicId,
      subjectId,
      selectedSubject.id
    );
    if (!result.ok) return alert("Error: " + result.problem);
    // Add only the updated topics to current subject, because name & about might be edited locally by user
    setSelectedSubject({ ...selectedSubject, ...result.data });
    setNetworkLoading(false);
  };

  const onCreateSubject = async (name, parentId) => {
    setNetworkLoading(true);
    // await new Promise((r) => setTimeout(r, 100));
    const result = await subjectsAPIService.createSubject(name, parentId);
    if (!result.ok) return alert("Error: " + result.problem);
    console.log("received new subject data:", result)
    const newSubject = result.data;
    console.log("tree data now:", treeData)
    // Add this item to tree
    treeData.items[newSubject.id] = newSubject;
    console.log("tree data after adding this:", treeData)
    // Add this id to parent node's children
    treeData.items[parentId].children = [
      ...treeData.items[parentId].children,
      newSubject.id,
    ];
    treeData.items[parentId].hasChildren = true;
    treeData.items[parentId].isExpanded = true;
    setTreeData({ ...treeData, ...treeData });
    console.log(treeData);
    setNetworkLoading(false);
    console.log("done");
  };

  // source has parentId and index => from this we determine dragged node's id
  // destination has parentId and index
  const onDragEnd = async (source, destination) => {

    console.log("Drag ended, source:", source, " destination: ", destination);
    if (!destination || (source == destination)) {
      console.log("They're equal")
      return;
    }
    if (!destination.index) destination.index = 0;

    setNetworkLoading(true);
    console.log(source);
    console.log(destination);

    var newTree = treeData;
    newTree = moveItemOnTree(newTree, source, destination);

    // If dest index == 0, target=parent, position="first-child",
    // else target=(id of node at index-1), position="right"
    var selfID = getIDFromPosition(source.parentId, source.index, treeData);
    console.log("Self ID: ", selfID);
    var targetID;
    var position;
    if (destination.index == 0) {
      targetID = destination.parentId;
      position = "first-child";
    } else {
      targetID = getIDFromPosition(
        destination.parentId,
        destination.index - 1,
        newTree
      );
      position = "right";
    }
    console.log("targetID: ", targetID);
    console.log("position", position);

    const result = await subjectsAPIService.moveSubject(selfID, targetID, position);
    if (!result.ok) return alert("Error: " + result.problem);
    setNetworkLoading(false);
    setTreeData({ ...treeData, ...newTree });
  };

  // MAKE SURE THE API returned Subjects no subject's id should be = 1, because thats the default root here.
  const loadSubjects = async () => {
    setNetworkLoading(true);
    console.log("fetching subjects...");
    // await new Promise((r) => setTimeout(r, 2000));
    const result = await subjectsAPIService.getRootLevelSubjects();
    if (!result.ok) return "Error: " + result.problem;
    console.log('received api response:', result.data);
    // convert children from JSONArray to simple array of IDS. add hasChildren and isExpanded fields
    var rootChildrenArray = [];
    result.data.forEach((item) => {
      // Add item to our base subjectsData array
      subjectsData.items[item.id] = item;
      // Configurations for base subjectsData array, which requires a root, we add these subjects to its root as children
      rootChildrenArray.push(item.id);
      subjectsData.items[subjectsData.rootId].hasChildren = true;
      subjectsData.items[subjectsData.rootId].isExpanded = true;
    })

    // result.data.forEach((item) => {
    //   subjectsData.items[item.id] = item;
    //   rootsChildrenArray.push(item.id);
    //   subjectsData.items[subjectsData.rootId].hasChildren = true;
    //   subjectsData.items[subjectsData.rootId].isExpanded = true;
    // });
    subjectsData.items[subjectsData.rootId].children = rootChildrenArray;
    console.log("Setting tree for the first time to:", subjectsData);
    setTreeData(subjectsData);
    console.log(treeData)
    setNetworkLoading(false);
    return result.data;
  };

  const saveSubjectDetail = async () => {
    console.log("saving subject detail...");
    // await new Promise((r) => setTimeout(r, 2000));
    const result = await subjectsAPIService.saveSubjectDetail(selectedSubject);
    if (!result.ok) return "Error: " + result.problem;
    console.log("Saved Subject Detail Online");
    console.log(result.data);
    setPendingChanges(false);
    treeData.items[selectedSubject.id].name = selectedSubject.name;
    setTreeData({ ...treeData, ...treeData });
    return result.data;
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
          <div className={`${selectedSubject?.id == item.id ? 'bg-san-primary-container text-san-on-primary-container' : 'bg-san-surface dark:bg-san-dark-surface text-san-on-surface dark:text-san-dark-on-surface'} border border-san-on-surface font-bold rounded overflow-hidden`}>
            {getIcon(item, onExpand, onCollapse)}
            <div
              onDrop={(e) => {
                e.preventDefault();
                const receivedTopicId = e.dataTransfer.getData("topic_id");
                if (item.id == selectedSubject.id) {
                  return;
                }
                var confirmRevert = window.confirm(
                  "Are you sure you want to move this topic to the subject " +
                  item.name +
                  "?"
                );
                if (!confirmRevert) return;
                else reparentTopic(receivedTopicId, item.id);
              }}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              className='inline-flex h-full px-2.5 cursor-pointer'
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

  useEffect(() => {
    console.log("inside useffect")
    loadSubjects();
  }, []);

  const loadSelectedSubject = async (subject_id) => {
    if (selectedSubject != null && selectedSubject.id == subject_id) return;
    if (pendingChanges) {
      var confirmRevert = window.confirm(
        "This subject has unsaved changes. They will be removed if you have not saved them yet. Are you sure you want to proceed?"
      );
      if (!confirmRevert) return;
      else setPendingChanges(false);
    }
    setNetworkLoading(true);
    console.log("fetching selected subject...");
    const result = await subjectsAPIService.getSubjectDetail(subject_id);
    if (!result.ok) return "Error: " + result.problem;
    console.log(result.data);
    setSelectedSubject(result.data);
    setNetworkLoading(false);
    return result.data;
  };

  if (networkLoading) {
    return (
      <div>
        <Modal />
      </div>
    );
  } else
    return (
      <div className='flex p-3 gap-3'>
        {/* <Prompt
          when={pendingChanges}
          message="You have unsaved changes that will be forgotten. Are you sure you want to leave?"
        /> */}
        <div className='w-full flex leading-8 flex-col'>
            <div className='flex justify-between'>
              <SectionHeader bar={false} className='mb-3 inline'>SUBJECTS </SectionHeader>
              <Button
                className={twColors.addContainer + 'w-fit text-xs uppercase'}
                onClick={() => {
                  const subjectName = window.prompt("Enter new subject's name:");
                  if (subjectName === null) return;
                  onCreateSubject(subjectName, 1);
                }}
              >
                Create New Subject
              </Button>
            </div>
            <Tree
              tree={treeData}
              renderItem={renderItem}
              onExpand={onExpand}
              onCollapse={onCollapse}
              onDragEnd={onDragEnd}
              offsetPerLevel={PADDING_PER_LEVEL}
              isDragEnabled
              isNestingEnabled
            />
        </div>
        {selectedSubject && (
          <SubjectInfo
            data={selectedSubject}
            onCreateChild={onCreateSubject}
            onAddTopic={(topic_id) => {
              reparentTopic(topic_id, selectedSubject.id);
            }}
            onDataChange={(newData) => {
              setSelectedSubject({ ...selectedSubject, ...newData });
              setPendingChanges(true);
            }}
            onDeleteSubject={(id, parentId) => {
              setPendingChanges(false);
              onDeleteSubject(id, parentId);
            }}
            onDataSave={
              pendingChanges
                ? () => {
                  saveSubjectDetail();
                }
                : null
            }
          />
        )}
      </div>
    );
  return (
    <JSONViewer heading="Subjects">{props}</JSONViewer>
  )
}
