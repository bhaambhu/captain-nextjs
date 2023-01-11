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
import twColors from '../../config/twColors';
import SectionHeader from '../../components/Texts/SectionHeader';
import JSONViewer from '../../components/JSONViewer';

// export const getStaticProps: GetStaticProps = async () => {
//   const paths = await pathDBHelper.getAll();
//   return {
//     props: { paths },
//     revalidate: 10,
//   };
// }

export default function Paths() {

  const getPathsAPI = useAPI(pathsAPIService.getPaths);
  const auth = useAuth();

  const loadPaths = async () => {
    await getPathsAPI.request();
  };

  useEffect(() => {
    loadPaths();
  }, []);

  if (getPathsAPI.loading) {
    return <LoadingIndicatorFullScreen visible={true} />
  }

  if (getPathsAPI.data) {
    // Now we've got the data
    return (
      // Whole page
      <div className='p-3'>
        {auth.isStaff() ?
          auth.isSuperUser() ?
            <PathsGrid
              paths={getPathsAPI.data}
              heading="Paths you control"
              onCreatedPath={(newPathData) => {
                let newPaths = getPathsAPI.data;
                newPaths.push(newPathData);
                getPathsAPI.setData([...newPaths]);
              }}
            />
            :
            <>
              <PathsGrid
                paths={getPathsAPI.data?.filter(item => item.author == auth.user.user_id)}
                heading="Paths you control"
                onCreatedPath={(newPathData) => {
                  let newPaths = getPathsAPI.data;
                  newPaths.push(newPathData);
                  getPathsAPI.setData([...newPaths]);
                }}
              />
              <PathsGrid
                paths={getPathsAPI.data?.filter(item => item.author != auth.user.user_id)}
                heading="Other paths"
              />
            </>
          :
          <PathsGrid paths={getPathsAPI.data} heading="Available paths" />
        }
        {/* <JSONViewer>{getPathsAPI.data}</JSONViewer> */}
      </div>
    )
  }

}

function PathsGrid({ paths, onCreatedPath = null, heading = '' }) {

  const createPathAPI = useAPI(pathsAPIService.createPath)

  async function createPath(title, about) {
    const response = await createPathAPI.request(title, about);

    if (response.ok) {
      console.log('current paths data ', paths);
      console.log('recieved data ', response.data);

      onCreatedPath(response.data);
    }
  }

  if (createPathAPI.loading) {
    return <LoadingIndicatorFullScreen visible={true} />
  }

  return (
    // Surface
    <div className={' p-3 flex flex-col gap-3 '} >
      {heading && <SectionHeader bar={false} className='uppercase'>{heading}</SectionHeader>}
      {/* Paths grid */}
      <div className='flex flex-col flex-wrap sm:flex-row gap-3'>
        {paths.map((item) => {
          return (
            <ListItemPath
              key={item.id}
              to={`paths/${item.id}`}
              className='w-full sm:w-fit'
              published={item.published}
              title={item.title ? item.title : "No Title"}
              // overline={item.about ? item.about : "No Description"}
              overline={item.authorName}
            />
          );
        })}
        {onCreatedPath &&
          <SanEDDButton
            onClick={() => {
              const title = window.prompt("Enter new path's name:");
              if (title === null) return;
              const about = window.prompt("Enter new path's description:");
              createPath(title, about);
            }}
            className=' bg-san-positive-container text-san-on-positive-container dark:bg-san-dark-positive dark:text-san-dark-on-positive border-current'
            style={{ width: 200 }}
            title={"Create New Path"}
          />
        }
      </div>
    </div>
  );
}