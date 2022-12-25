import { GetStaticProps } from 'next';
import React, { useEffect, useState } from 'react'
import ListItemPath from '../../components/ListItems/ListItemPath';
import ListItemTopic from '../../components/ListItems/ListItemTopic';
import Modal from '../../components/Modal';
import dimensions from '../../config/dimensions';
import { useRouter } from 'next/router';
import { pathDBHelper } from '../../lib/DBHelpers/pathDBHelper';
import APIEndpoints from '../../config/APIEndpoints';
import pathsAPIService from '../../lib/APIServices/pathsAPIService';
import useApi from '../../lib/useAPI';

// export const getStaticProps: GetStaticProps = async () => {
//   const paths = await pathDBHelper.getAll();
//   return {
//     props: { paths },
//     revalidate: 10,
//   };
// }

export default function Paths() {

  const pathsApiHook = useApi(pathsAPIService.getPaths);

  const loadPaths = async () => {
    await pathsApiHook.request();
  };

  useEffect(() => {
    loadPaths();
  }, []);

  const router = useRouter();

  if (pathsApiHook.data) {
    return (
      <PathsGrid
        paths={pathsApiHook.data}
        onCreatedPath={() => {
          // Add code to refresh page, so newly created path is displayed in the grid
          router.reload();
        }}
      />
    )
  } else
    return (
      <div>
        <Modal />
      </div>
    );

}

function PathsGrid({ paths, onCreatedPath }) {

  function createPath() {
    pathsAPIService.createPath().then(response => {
      alert(response.ok);
      onCreatedPath()
    });
  }

  return (
    <div
      style={{
        padding: dimensions.contentDistance,
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        gap: dimensions.contentDistance,
      }}
    >
      {paths.map((item) => {
        return (
          <ListItemPath
            key={item.id}
            to={`paths/${item.id}`}
            style={{ width: 200 }}
            published={item.published}
            title={item.title ? item.title : "No Title"}
            overline={item.about ? item.about : "No Description"}
          />
        );
      })}
      <ListItemTopic
        onClick={() => {
          createPath();
        }}
        style={{ width: 200 }}
        title={"Add New Path"}
      />
    </div>
  );
}