import { useRouter } from 'next/router';
import React, { useState } from 'react'
import TopicEditor from '../../../components/Topic/TopicEditor';
import dimensions from '../../../config/dimensions';

export default function EditTopic() {
  const router = useRouter();
  const { id: topicId } = router.query;
  const [topicUnsavedChanges, setTopicUnsavedChanges] = useState(false);
  return (
    <div
      style={{
        padding: dimensions.contentDistance,
        display: "flex",
        gap: 10,
      }}
    >
      <TopicEditor
        topic_id={topicId}
        unsavedChanges={topicUnsavedChanges}
        setUnsavedChanges={setTopicUnsavedChanges}
        onTopicSaved={(updatedTopicData) => {
          alert("Check if topic is saved online");
        }}
        onTopicDeletedOnline={() => {
          router.back();
        }}
      />
    </div>
  )
}
