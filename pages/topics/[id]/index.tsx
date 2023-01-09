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
import TopicDataPreview from '../../../components/Topic/TopicDataPreview';
import TopicPreview from '../../../components/Topic/TopicPreview';
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

  if (router.isReady) {
    return (
      <div className='p-3'>
        <TopicPreview
          topicID={topicId}
          onEditButtonPress={() => {
            router.push(router.asPath + '/edit/')
          }}
          onTopicDeleted={() => { router.back(); }}
        />
      </div>
    )
  }
}
