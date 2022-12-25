const activityType = Object.freeze({
  Personalization: 1,
  Stage_Preview: 2,
  Learn_Topic: 3,
  Reflect: 4, // Think about what you've learned
  MCQ: 5,
});

const stepType = Object.freeze({
  Theory: 1,
  MCQ: 2,
  Info: 3,
  Topic: 4,
  Track: 5,
  AssessQ: 6,
});

const stepTypeString = (stepTypeIndex) => {
  switch (stepTypeIndex) {
    case stepType.Theory:
      return "Theory";
    case stepType.MCQ:
      return "MCQ";
    case stepType.Info:
      return "Info";
    case stepType.Topic:
      return "Topic";
    case stepType.Track:
      return "Track";
    default:
      break;
  }
};

// Difficulty is based on the ratio of correct attempts vs all attempts made by the learners.
// Eg. 58% correct solutions, 42% wrong solutions => Medium difficulty
// Also, Predicted time = the average time it takes other learners to solve this problem
const difficulty = Object.freeze({
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
});

const activityState = Object.freeze({
  Locked: 1,
  Unlocked: 2,
  Completed: 3,
  CurrentActivity: 4,
});

export { activityState, activityType, difficulty, stepType, stepTypeString };
