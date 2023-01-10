import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import SectionHeader from "./Texts/SectionHeader";
import { Button } from "./Buttons/Button";
import { breadString } from "../lib/utils";
import twColors from "../config/twColors";
import { loadSubjects, SubjectTree } from "./SubjectTree";
import { TiDelete } from "react-icons/ti";
import { twMerge } from "tailwind-merge";

export default function SubjectSelectModal({
  onSelectSubject,
  onCancel,
}) {
  const [treeData, setTreeData] = useState(null);
  const [networkLoading, setNetworkLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null)

  var breads = "";
  if (selectedSubject) breads = breadString(selectedSubject.breadcrumbs);

  useEffect(() => {
    loadSubjects(setNetworkLoading, setTreeData);
  }, []);

  useEffect(() => {
    if (selectedSubjectId) {
      // We now have selected subject's ID, get subject data from treeData
      setSelectedSubject(treeData.items[selectedSubjectId]);
    }
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
            className={twMerge(twColors.window + ' w-[80%] h-[80%] flex flex-col p-3 rounded-sm border ')}
          >
            {/* Top Area - Heading and Close Button */}
            <div className="flex justify-between items-center">
              <SectionHeader bar={false} className='uppercase text-xl'>Select Subject</SectionHeader>
              <div className="text-4xl leading-none flex cursor-pointer" title='Close Window'>
                <TiDelete
                  onClick={onCancel}
                  className={twColors.cross}
                />
                {/* &ndash; */}
              </div>
            </div>
            {/* Middle Area - Subject Tree */}
            <div
              className="h-full overflow-y-auto bg-san-surface-variant w-full leading-8 p-1 rounded-sm border-san-on-surface-variant border shadow-inner"
            >
              {networkLoading ? (
                "Loading..."
              ) : (
                <SubjectTree
                  treeData={treeData}
                  setTreeData={setTreeData}
                  selectedSubjectId={selectedSubjectId}
                  setSelectedSubjectId={setSelectedSubjectId}
                />
              )}
            </div>

            {selectedSubject && (
              <Button
                className={twColors.addContainer + ' self-end shadow-lg mt-2.5 '}
                onClick={() => {
                  onSelectSubject(selectedSubject);
                }}
              >
                Select {selectedSubject.name}
              </Button>
            )}
          </div>
        </div>,
        document.getElementById("modal-root") as HTMLElement
      )}
    </div>
  );
}
