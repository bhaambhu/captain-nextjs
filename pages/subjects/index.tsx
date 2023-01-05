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
import { SubjectTree, subjectDataFormat, loadSubjects } from '../../components/SubjectTree';
import LoadingIndicatorFullScreen from '../../components/Loading/LoadingIndicatorFullScreen';
import useAPI from '../../lib/useAPI';
import { confirmation } from '../../config/utils';
import useAuth from '../../lib/auth/useAuth';

export default function Subjects(props) {
  const [treeData, setTreeData] = useState(null);

  // This needs to be true otherwise atlaskit/tree library produces errors - it needs to be delayed from loading
  const [networkLoading, setNetworkLoading] = useState(true);

  const [selectedSubject, setSelectedSubject] = useState();
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [pendingChanges, setPendingChanges] = useState(false);

  const useGetSubjectDetailAPI = useAPI(subjectsAPIService.getSubjectDetail);
  const useSaveSubjectDetailAPI = useAPI(subjectsAPIService.saveSubjectDetail);
  const useCreateSubjectAPI = useAPI(subjectsAPIService.createSubject);

  const auth = useAuth();

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

  const onDropTopicOnSubject = async (topicId, subjectId) => {
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
    // await new Promise((r) => setTimeout(r, 100));
    const result = await useCreateSubjectAPI.request(name, parentId);
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
    console.log("done");
  };

  const saveSubjectDetail = async () => {
    console.log("saving subject detail...");
    // await new Promise((r) => setTimeout(r, 2000));
    const result = await useSaveSubjectDetailAPI.request(selectedSubject);
    if (!result.ok) return "Error: " + result.problem;
    console.log("Saved Subject Detail Online");
    console.log(result.data);
    setPendingChanges(false);
    treeData.items[selectedSubject.id].name = selectedSubject.name;
    setTreeData({ ...treeData, ...treeData });
    return result.data;
  };

  const loadSelectedSubject = async (subject_id) => {
    if (selectedSubject != null && selectedSubject.id == subject_id) return;
    if (pendingChanges) {
      if (confirmation("This subject has unsaved changes. They will be removed if you have not saved them yet. Are you sure you want to proceed?")) {
        setPendingChanges(false);
      } else {
        // Means we did not want to select other subject
        setSelectedSubjectId(selectedSubject.id);
        // Don't load this new subject anymore and exit function
        return;
      }
    }

    console.log("fetching selected subject...");
    const result = await useGetSubjectDetailAPI.request(subject_id);
    if (!result.ok) return "Error: " + result.problem;
    console.log(result.data);
    setSelectedSubject(result.data);
    return result.data;
  };

  const getIDFromPosition = (parentID, index, tree) => {
    return tree.items[parentID].children[index];
  };

  const onDropSubjectOnSubject = async (source, destination) => {

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

  useEffect(() => {
    if (selectedSubjectId)
      loadSelectedSubject(selectedSubjectId);
  }, [selectedSubjectId])

  useEffect(() => {
    console.log("inside useffect")
    loadSubjects(setNetworkLoading, setTreeData);
  }, []);

  // if (networkLoading) {
  //   return <LoadingIndicatorFullScreen visible={true} />
  // }

  return (
    <div className='flex p-3 gap-3'>
      {/* <Prompt
          when={pendingChanges}
          message="You have unsaved changes that will be forgotten. Are you sure you want to leave?"
        /> */}
      <LoadingIndicatorFullScreen visible={networkLoading || useGetSubjectDetailAPI.loading || useSaveSubjectDetailAPI.loading || useCreateSubjectAPI.loading} />
      <div className='w-full flex leading-8 flex-col'>
        <div className='flex justify-between'>
          <SectionHeader bar={false} className='mb-3 inline'>SUBJECTS </SectionHeader>
          {auth.isStaff() && <Button
            className={twColors.addContainer + 'w-fit text-xs uppercase'}
            onClick={() => {
              const subjectName = window.prompt("Enter new subject's name:");
              if (subjectName === null) return;
              onCreateSubject(subjectName, 1);
            }}
          >
            Create New Subject
          </Button>}
        </div>
        {treeData &&
          <SubjectTree
            treeData={treeData}
            setTreeData={setTreeData}
            selectedSubjectId={selectedSubjectId}
            setSelectedSubjectId={setSelectedSubjectId}
            onDropTopicOnSubject={auth.isStaff() ? onDropTopicOnSubject : null}
            onDropSubjectOnSubject={auth.isStaff() ? onDropSubjectOnSubject : null}
            isNestingEnabled={auth.isStaff()}
          />
        }
      </div>
      {selectedSubject && (
        <SubjectInfo
          data={selectedSubject}
          onCreateChild={onCreateSubject}
          onAddTopic={(topic_id) => {
            onDropTopicOnSubject(topic_id, selectedSubject.id);
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
