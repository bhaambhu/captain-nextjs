import React, { useEffect } from 'react'
import { confirmation } from '../../config/utils';
import topicsAPIService from '../../lib/APIServices/topicsAPIService';
import useAuth from '../../lib/auth/useAuth'
import useAPI from '../../lib/useAPI';
import LoadingIndicatorFullScreen from '../Loading/LoadingIndicatorFullScreen';
import TopicDataPreview from './TopicDataPreview';

export default function TopicPreview({ topicID, onEditButtonPress, onTopicDeleted }) {
  const auth = useAuth();

  const topicDetailsAPI = useAPI(topicsAPIService.getTopic);
  const deleteTopicAPI = useAPI(topicsAPIService.deleteTopic);

  const loadTopic = async (id) => {
    await topicDetailsAPI.request(id);
  };

  const deleteTopic = async () => {

    if (!confirmation("Are you sure you want to delete this topic?"))
      return;

    const response = await deleteTopicAPI.request(topicDetailsAPI.data.id);
    if (response.ok) {
      onTopicDeleted()
    }
  }

  useEffect(() => {
    loadTopic(topicID);
  }, [topicID]);

  if (!topicDetailsAPI.loadedOnce) return <LoadingIndicatorFullScreen visible={true} />
  return (
    <div className=''>
      <LoadingIndicatorFullScreen visible={deleteTopicAPI.loading} />
      {/* Surface */}
      <TopicDataPreview topicData={topicDetailsAPI.data} onEditButtonPress={auth.canAuthor(topicDetailsAPI.data.author) ? onEditButtonPress : null} onDeleteButtonPress={auth.canAuthor(topicDetailsAPI.data.author) ? deleteTopic : null} infoMessage={!auth.canAuthor(topicDetailsAPI.data.author) ? 'Only its author can modify this topic' : ''} />
    </div >
  )
}
