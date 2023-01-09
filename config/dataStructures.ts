import { stepType } from "./enums";

export function newTopicStepTheory(sid) {
  return {
    sid: sid,
    title: "",
    type: stepType.Theory,
    timeLength: "9 minutes",
    problemsSolved: "0 / 1 problems solved",
    data: "",
  }
}