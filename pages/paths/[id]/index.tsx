import { truncate } from 'fs';
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { Button } from '../../../components/Buttons/Button';
import JSONViewer from '../../../components/JSONViewer';
import LoadingIndicatorFullScreen from '../../../components/Loading/LoadingIndicatorFullScreen';
import Modal from '../../../components/Modal';
import H1 from '../../../components/Texts/H1';
import H2 from '../../../components/Texts/H2';
import H3 from '../../../components/Texts/H3';
import Subtitle from '../../../components/Texts/Subtitle';
import APIEndpoints from '../../../config/APIEndpoints';
import routes from '../../../config/routes';
import twColors from '../../../config/twColors';
import { confirmation } from '../../../config/utils';
import pathsAPIService from '../../../lib/APIServices/pathsAPIService';
import useAuth from '../../../lib/auth/useAuth';
import { pathDBHelper } from '../../../lib/DBHelpers/pathDBHelper';
import useAPI from '../../../lib/useAPI';

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   try {
//     const result = await pathDBHelper.getById(+String(params?.id));
//     return {
//       props: result,
//     }
//   } catch (e) {
//     return {
//       notFound: true,
//     }
//   }
// };

export default function Path() {
  const router = useRouter();
  const { id: pathID } = router.query;
  const auth = useAuth();

  const pathDetailsAPI = useAPI(pathsAPIService.getPathDetail);
  const deletePathAPI = useAPI(pathsAPIService.deletePath);

  const loadPath = async (id) => {
    await pathDetailsAPI.request(id);
  };

  const deletePath = async () => {

    if (!confirmation("Are you sure you want to delete this path?"))
      return;

    const response = await deletePathAPI.request(pathDetailsAPI.data.id);
    if (response.ok) {
      router.replace(routes.PATHS);
    }
  }

  useEffect(() => {
    if (!router.isReady) return;
    console.log('loading now')
    loadPath(pathID);
  }, [pathID, router.isReady]);

  if (!pathDetailsAPI.loadedOnce) {
    return <LoadingIndicatorFullScreen visible={true} />
  }
  return (
    <div className='p-3'>
      <LoadingIndicatorFullScreen visible={deletePathAPI.loading} />
      {/* Surface */}
      <div className={twColors.surfaceSimple + ' p-3 border '}>
        <H1>{pathDetailsAPI.data.title || "Untitled Path"}</H1>
        {pathDetailsAPI.data.about && <Subtitle>{pathDetailsAPI.data.about}</Subtitle>}
        {/* Action Buttons */}
        {auth.canAuthor(pathDetailsAPI.data.author) && <div className='flex gap-3 mt-3'>
          <Button className={twColors.addContainer} onClick={() => {
            router.replace(router.asPath + '/edit/')
          }}>Edit</Button>
          <Button className={twColors.deleteContainer} onClick={deletePath}>Delete</Button>
        </div>}
        <JSONViewer heading={'PREVIEW'} className='mt-3'>{pathDetailsAPI.data}</JSONViewer>
      </div>
    </div>
  )
}
