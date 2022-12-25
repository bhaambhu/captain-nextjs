import { truncate } from 'fs';
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import JSONViewer from '../../../components/JSONViewer';
import Modal from '../../../components/Modal';
import APIEndpoints from '../../../config/APIEndpoints';
import topicsAPIService from '../../../lib/APIServices/topicsAPIService';
import { topicDBHelper } from '../../../lib/DBHelpers/topicDBHelper';
import useApi from '../../../lib/useAPI';

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

  const topicDetailsAPI = useApi(topicsAPIService.getTopic);

  const loadTopic = async (id) => {
    await topicDetailsAPI.request(id);
  };

  useEffect(() => {
    if (!router.isReady) return;
    console.log('loading now')
    loadTopic(topicId);
  }, [topicId, router.isReady]);

  if (!topicDetailsAPI.loadedOnce) return <Modal />
  return (
    <div>
      <button className='p-1 text-cclrs-light-strong px-2 bg-cclrs-secondary-light rounded m-2'
        onClick={() => {
          router.replace(router.asPath + '/edit/')
        }}>Edit</button>
      <button
        className='p-1 text-cclrs-light-strong px-2 bg-cclrs-error rounded m-2'
        onClick={() => {
          topicsAPIService.deleteTopic(router.query.id).then(response => { response.ok ? router.back() : alert("Some error occurred"); })
        }}
      >Delete</button>
      <JSONViewer heading={'Topic Data'}>{topicDetailsAPI}</JSONViewer>
    </div>
  )
}
