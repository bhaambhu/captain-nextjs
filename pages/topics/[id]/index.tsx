import { truncate } from 'fs';
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { Button } from '../../../components/Buttons/Button';
import JSONViewer from '../../../components/JSONViewer';
import LoadingIndicatorFullScreen from '../../../components/Loading/LoadingIndicatorFullScreen';
import Modal from '../../../components/Modal';
import H1 from '../../../components/Texts/H1';
import Subtitle from '../../../components/Texts/Subtitle';
import APIEndpoints from '../../../config/APIEndpoints';
import routes from '../../../config/routes';
import twColors from '../../../config/twColors';
import { confirmation } from '../../../config/utils';
import topicsAPIService from '../../../lib/APIServices/topicsAPIService';
import useAuth from '../../../lib/auth/useAuth';
import { topicDBHelper } from '../../../lib/DBHelpers/topicDBHelper';
import useAPI from '../../../lib/useAPI';

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   try {
//     const result = await topicDBHelper.getTopic(+String(params?.id));
//     return {
//       props: result,
//     }
//   } catch (e) {
//     return {
//       notFound: true,
//     }
//   }
// };

export default function Topic() {
  const router = useRouter();
  const { id: topicId } = router.query;
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
      router.back()
    }
  }

  useEffect(() => {
    if (!router.isReady) return;
    console.log('loading now')
    loadTopic(topicId);
  }, [topicId, router.isReady]);

  if (!topicDetailsAPI.loadedOnce) return <LoadingIndicatorFullScreen visible={true} />
  return (
    <div className='p-3'>
      <LoadingIndicatorFullScreen visible={deleteTopicAPI.loading} />
      {/* Surface */}
      <div className={twColors.surfaceSimple + ' p-3 border '}>
        <H1>{topicDetailsAPI.data.title || "Untitled Topic"}</H1>
        {topicDetailsAPI.data.about && <Subtitle>{topicDetailsAPI.data.about}</Subtitle>}
        {/* Action Buttons */}
        {auth.isStaff() && <div className='flex gap-3 mt-3'>
          <Button className={twColors.addContainer} onClick={() => {
            router.replace(router.asPath + '/edit/')
          }}>Edit</Button>
          <Button className={twColors.deleteContainer} onClick={deleteTopic}>Delete</Button>
        </div>}
      <JSONViewer heading={'Topic Data'}>{topicDetailsAPI}</JSONViewer>
    </div>
    </div >
  )
}
