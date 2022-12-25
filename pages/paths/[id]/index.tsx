import { truncate } from 'fs';
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import JSONViewer from '../../../components/JSONViewer';
import Modal from '../../../components/Modal';
import APIEndpoints from '../../../config/APIEndpoints';
import pathsAPIService from '../../../lib/APIServices/pathsAPIService';
import { pathDBHelper } from '../../../lib/DBHelpers/pathDBHelper';
import useApi from '../../../lib/useAPI';

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

  const pathDetailsAPI = useApi(pathsAPIService.getPathDetail);

  const loadPath = async (id) => {
    await pathDetailsAPI.request(id);
  };

  useEffect(() => {
    if (!router.isReady) return;
    console.log('loading now')
    loadPath(pathID);
  }, [pathID, router.isReady]);

  if (!pathDetailsAPI.loadedOnce) return <Modal />
  return (
    <div>
      <button className='p-1 text-cclrs-light-strong px-2 bg-cclrs-secondary-light rounded m-2'
        onClick={() => {
          router.replace(router.asPath + '/edit/')
        }}>Edit</button>
      <button
        className='p-1 text-cclrs-light-strong px-2 bg-cclrs-error rounded m-2'
        onClick={() => {
          pathsAPIService.deletePath(Number(router.query.id)).then(response => { response.ok ? router.replace('/paths') : alert("Some error occurred"); })
        }}
      >Delete</button>
      <JSONViewer heading={'Path Data'}>{pathDetailsAPI.data}</JSONViewer>
    </div>
  )
}
