import React from "react";
import { stepType } from "../../config/enums";
import ListItemTopic from "../ListItems/ListItemTopic";
import ListContainer from "../ListItems/ListContainer";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import SectionHeader from "../Texts/SectionHeader";
import ListItemTheorySection from "../ListItems/ListItemTheorySection";
import ListItemMCQOption from "../ListItems/ListItemMCQOption";
import MyTextEditor from "../TextEditors/MyTextEditor";

const example = {
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
};

export default function MCQStep({ mcqStepData, onMCQStepDataChange }) {
  return (
    <DragDropContext
      onDragEnd={(param) => {
        const srcI = param.source.index;
        const desI = param.destination?.index;
        if (desI !== null) {
          let newOptions = mcqStepData.options;
          newOptions.splice(desI, 0, newOptions.splice(srcI, 1)[0]);
          mcqStepData.options = newOptions;
          onMCQStepDataChange(mcqStepData);
        }
      }}
    >
      <Droppable droppableId="droppable-1">
        {(provided, _) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <ListContainer style={{ flex: 1 }}>
              <ListItemTheorySection
                theorySectionData={{
                  title: mcqStepData.title,
                  content: mcqStepData.content,
                }}
                titlePlaceholder="Enter MCQ Title"
                contentPlaceholder="Enter question here..."
                sid={mcqStepData.sid}
                onTheorySectionDataChange={(section) => {
                  mcqStepData.content = section.content;
                  mcqStepData.title = section.title;
                  onMCQStepDataChange(mcqStepData);
                }}
                editable
              />
              <SectionHeader>OPTIONS</SectionHeader>
              {mcqStepData.options?.map((option, i) => {
                return (
                  <Draggable key={i} draggableId={"draggable-" + i} index={i}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          display: "inherit",
                        }}
                      >
                        <ListItemMCQOption
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            boxShadow: snapshot.isDragging
                              ? "0 0 .4rem #666"
                              : "none",
                          }}
                          mcqOptionData={option}
                          sid={mcqStepData.sid}
                          onMCQOptionDataChange={(option) => {
                            mcqStepData.options[i] = option;
                            onMCQStepDataChange(mcqStepData);
                          }}
                          onDelete={() => {
                            var confirmDelete = window.confirm(
                              "Are you sure you want to delete this option?"
                            );
                            if (confirmDelete) {
                              let currentStep = Object.assign({}, mcqStepData);
                              let newOptions = currentStep.options;
                              newOptions.splice(i, 1);
                              currentStep.options = newOptions;
                              onMCQStepDataChange({
                                ...mcqStepData,
                                options: newOptions,
                              });
                            }
                          }}
                          draggable
                          editable
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
              <ListItemTopic
                onClick={() => {
                  let newOptions = mcqStepData.options
                    ? mcqStepData.options
                    : [];
                  newOptions.push({
                    content: "",
                    correct: true,
                  });
                  mcqStepData.options = newOptions;
                  onMCQStepDataChange(mcqStepData);
                  // setSections((sections) => [...newSections]);
                }}
                title="Add Option"
              />
              <SectionHeader>Explanation</SectionHeader>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  overflow: "clip",
                  flexDirection: "row",
                }}
              >
                <div style={{ flex: 1 }}>
                  <MyTextEditor
                    placeholder="Enter any explanations for this question and how we can solve it to reach the correct answer."
                    content={mcqStepData.explanation}
                    sid={mcqStepData.sid}
                    onChangeContent={(content) => {
                      mcqStepData.explanation = content;
                      onMCQStepDataChange(mcqStepData);
                    }}
                  />
                </div>
              </div>
            </ListContainer>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
