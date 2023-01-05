import { GetStaticProps } from 'next';
import React, { useEffect, useState } from 'react'
import ListItemPath from '../../components/ListItems/ListItemPath';
import SanEDDButton from '../../components/Buttons/SanEDDButton';
import Modal from '../../components/Modal';
import dimensions from '../../config/dimensions';
import { useRouter } from 'next/router';
import { pathDBHelper } from '../../lib/DBHelpers/pathDBHelper';
import APIEndpoints from '../../config/APIEndpoints';
import pathsAPIService from '../../lib/APIServices/pathsAPIService';
import useAPI from '../../lib/useAPI';
import LoadingIndicatorFullScreen from '../../components/Loading/LoadingIndicatorFullScreen';
import useAuth from '../../lib/auth/useAuth';

// export const getStaticProps: GetStaticProps = async () => {
//   const paths = await pathDBHelper.getAll();
//   return {
//     props: { paths },
//     revalidate: 10,
//   };
// }

export default function Paths() {

  const getPathsAPI = useAPI(pathsAPIService.getPaths);

  const loadPaths = async () => {
    await getPathsAPI.request();
  };

  useEffect(() => {
    loadPaths();
  }, []);

  const router = useRouter();

  if (getPathsAPI.loading) {
    return <LoadingIndicatorFullScreen visible={true} />
  }

  if (getPathsAPI.data) {
    return (
      <PathsGrid
        paths={getPathsAPI.data}
        onCreatedPath={(newPathData) => {
          getPathsAPI.setData(getPathsAPI.data, getPathsAPI.data.push(newPathData))
        }}
      />
    )
  }

}

function PathsGrid({ paths, onCreatedPath }) {

  const createPathAPI = useAPI(pathsAPIService.createPath)
  const auth = useAuth()

  async function createPath(title, about) {
    const response = await createPathAPI.request(title, about);

    if(response.ok){
      console.log('current paths data ', paths);
      console.log('recieved data ', response.data);

      onCreatedPath(response.data);
    }
  }

  if (createPathAPI.loading) {
    return <LoadingIndicatorFullScreen visible={true} />
  }

  return (
    <div className='flex p-3 flex-wrap gap-3' >
      {paths.map((item) => {
        return (
          <ListItemPath
            key={item.id}
            to={`paths/${item.id}`}
            published={item.published}
            title={item.title ? item.title : "No Title"}
            overline={item.about ? item.about : "No Description"}
          />
        );
      })}
      {auth.isStaff() &&
        <SanEDDButton
          onClick={() => {
            const title = window.prompt("Enter new path's name:");
            if (title === null) return;
            const about = window.prompt("Enter new path's description:");
            createPath(title, about);
          }}
          style={{ width: 200 }}
          title={"Add New Path"}
        />
      }
    </div>
  );
}