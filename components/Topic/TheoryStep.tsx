import React from "react";
import { stepType } from "../../config/enums";
import ListItemTopic from "../ListItems/ListItemTopic";
import ListContainer from "../ListItems/ListContainer";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import SectionHeader from "../Texts/SectionHeader";
import ListItemTheorySection from "../ListItems/ListItemTheorySection";

const example = {
  title: "The big O notation",
  type: stepType.Theory,
  // timeLength: "9 minutes",
  // problemsSolved: "0 / 1 problems solved",
  sections: [
    {
      title: "Introduction",
      content:
        "No statements no testimonies! Imagine you are <b>investigating</b> a robbery and are trying to figure out what happened. You have witnesses whose testimonies are very vague, but there is no evidence. It will be very difficult to unravel such a mess. If only there were recordings from surveillance cameras to restore the chronology of the events...",
    },
    {
      title: "Find max",
      content: `
  <p> In this we need to compute like<br>
  C<sub>1</sub> = b<sup>n/2</sup> × b<sup>n/2</sup> <br>
  C<sub>1</sub> = b<sup>n/2</sup> × b<sup>n/2</sup> <br>
  C<sub>1</sub> = b<sup>n/2</sup> × b<sup>n/2</sup> <br>
  C<sub>1</sub> = b<sup>n/2</sup> × b<sup>n/2</sup> <br>
  C<sub>1</sub> = b<sup>n/2</sup> × b<sup>n/2</sup> <br>
  C<sub>1</sub> = b<sup>n/2</sup> × b<sup>n/2</sup> <br>
  C<sub>1</sub> = b<sup>n/2</sup> × b<sup>n/2</sup> <br>
  C<sub>1</sub> = b<sup>n/2</sup> × b<sup>n/2</sup> <br>
  C<sub>1</sub> = b<sup>n/2</sup> × b<sup>n/2</sup> <br>
  C<sub>1</sub> = b<sup>n/2</sup> × b<sup>n/2</sup> <br>
  C<sub>1</sub> = b<sup>n/2</sup> × b<sup>n/2</sup> <br>
  C<sub>1</sub> = b<sup>n/2</sup> × b<sup>n/2</sup> <br>
  C<sub>1</sub> = b<sup>n/2</sup> × b<sup>n/2</sup> <br>
  C<sub>1</sub> = b<sup>n/2</sup> × b<sup>n/2</sup> <br>
  C<sub>1</sub> = b<sup>n/2</sup> × b<sup>n/2</sup> <br>
  C<sub>1</sub> = b<sup>n/2</sup> × b<sup>n/2</sup> <br>
  C<sub>1</sub> = b<sup>n/2</sup> × b<sup>n/2</sup> <br>
  C<sub>1</sub> = b<sup>n/2</sup> × b<sup>n/2</sup> <br>
  C<sub>1</sub> = b<sup>n/2</sup> × b<sup>n/2</sup> <br>
  C<sub>1</sub> = b<sup>n/2</sup> × b<sup>n/2</sup> <br>
  C<sub>2</sub> = b<sup>n/4</sup> × b<sup>n/4</sup> <br>
  C<sub>3</sub> = b<sup>n/8</sup> × b<sup>n/8</sup> <br>
  ⋮ <br>
  C<sub>k</sub> = b<sup>2</sup> × b<sup>2</sup> <br>
  Recurrence relation T(n) = T(n/2) + O(1)<br>
  T(n) = O(log n)</p>
          `,
    },
    {
      title: "Log",
      content:
        "Imagine you are investigating a robbery and are trying to figure out what happened. You have witnesses whose testimonies are very vague, but there is no evidence. It will be very difficult to unravel such a mess. If only there were recordings from surveillance cameras to restore the chronology of the events...",
    },
  ],
};

export default function TheoryStep({ theoryStepData, onTheoryStepDataChange }) {
  // const [sections, setsections] = useState(example.sections)
  return (
    <DragDropContext
      onDragEnd={(param) => {
        const srcI = param.source.index;
        const desI = param.destination?.index;
        if (desI !== null) {
          let newSections = theoryStepData.sections;
          newSections.splice(desI, 0, newSections.splice(srcI, 1)[0]);
          // setSections(newSections);
          theoryStepData.sections = newSections;
          onTheoryStepDataChange(theoryStepData);
        }
      }}
    >
      <Droppable droppableId="droppable-1">
        {(provided, _) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <ListContainer style={{ flex: 1 }}>
              <ListItemTopic
                overline="THEORY"
                placeholder="Enter Theory Title"
                title={theoryStepData.title}
                onChange={(newValue) => {
                  theoryStepData.title = newValue;
                  onTheoryStepDataChange(theoryStepData);
                }}
              />

              <SectionHeader>SECTIONS</SectionHeader>
              {theoryStepData.sections.map((section, i) => {
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
                        <ListItemTheorySection
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            boxShadow: snapshot.isDragging
                              ? "0 0 .4rem #666"
                              : "none",
                          }}
                          theorySectionData={section}
                          sid={theoryStepData.sid}
                          onTheorySectionDataChange={(section) => {
                            theoryStepData.sections[i] = section;
                            onTheoryStepDataChange(theoryStepData);
                          }}
                          onDelete={() => {
                            var confirmDelete = window.confirm(
                              "Are you sure you want to delete this section?"
                            );
                            if (confirmDelete) {
                              let currentStep = Object.assign(
                                {},
                                theoryStepData
                              );
                              let newSections = currentStep.sections;
                              newSections.splice(i, 1);
                              currentStep.sections = newSections;
                              onTheoryStepDataChange({
                                ...theoryStepData,
                                sections: newSections,
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
                  let newSections = theoryStepData.sections;
                  newSections.push({
                    title: "",
                    content: "",
                  });
                  theoryStepData.sections = newSections;
                  onTheoryStepDataChange(theoryStepData);
                  // setSections((sections) => [...newSections]);
                }}
                title="Add Theory Section"
              />
            </ListContainer>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
