import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import TopicEditor from '../../../components/Topic/TopicEditor';
import dimensions from '../../../config/dimensions';
import routes from '../../../config/routes';
import useAuth from '../../../lib/auth/useAuth';

export default function EditTopic() {
  const router = useRouter();
  const auth = useAuth();
  const { id: topicId } = router.query;
  const [topicUnsavedChanges, setTopicUnsavedChanges] = useState(false);

  useEffect(() => {
    if (router.isReady && !auth.isStaff()) {
      router.replace(routes.HOME)
    }
  }, [router, auth])

  return (
    <div
      className='flex gap-3 p-3'
    >
      {router.isReady &&
        <TopicEditor
          topic_id={topicId}
          unsavedChanges={topicUnsavedChanges}
          setUnsavedChanges={setTopicUnsavedChanges}
          onTopicSaved={(updatedTopicData) => {
            // alert("Check if topic is saved online");
          }}
          onTopicDeletedOnline={() => {
            router.back();
          }}
        />
      }
    </div>
  )
}
