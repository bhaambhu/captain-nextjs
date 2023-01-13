import React, { useEffect } from "react";
import SanEDDButton from "../../components/Buttons/SanEDDButton";
import topicsAPIService from "../../lib/APIServices/topicsAPIService";
import SectionHeader from "../../components/Texts/SectionHeader";
import APIEndpoints from "../../config/APIEndpoints";
import useAuth from "../../lib/auth/useAuth";
import useAPI from "../../lib/useAPI";
import LoadingIndicatorFullScreen from "../../components/Loading/LoadingIndicatorFullScreen";
import ListItemPath from "../../components/ListItems/ListItemPath";

export default function Topics() {
  const getTopicsAPI = useAPI(topicsAPIService.getTopics);
  const auth = useAuth();

  const loadTopics = async () => {
    await getTopicsAPI.request();
  };

  useEffect(() => {
    loadTopics();
  }, []);

  if (getTopicsAPI.loading) {
    return <LoadingIndicatorFullScreen visible={true} />
  }

  if (getTopicsAPI.data) {
    // Now we've got the data
    return (
      // Whole page
      <div className='p-3'>
        {auth.isStaff() ?
          auth.isSuperUser() ?
            <TopicsGrid
              topics={getTopicsAPI.data}
              heading="Topics you control"
              onCreatedTopic={(newTopicData) => {
                let newTopics = getTopicsAPI.data;
                newTopics.push(newTopicData);
                getTopicsAPI.setData([...newTopics]);
              }}
            />
            :
            <>
              <TopicsGrid
                topics={getTopicsAPI.data?.filter(item => item.author == auth.user.user_id)}
                heading="Topics you control"
                onCreatedTopic={(newTopicData) => {
                  let newTopics = getTopicsAPI.data;
                  newTopics.push(newTopicData);
                  getTopicsAPI.setData([...newTopics]);
                }}
              />
              <TopicsGrid
                topics={getTopicsAPI.data?.filter(item => item.author != auth.user.user_id)}
                heading="Other topics"
              />
            </>
          :
          <TopicsGrid topics={getTopicsAPI.data} heading="Available topics" />
        }
        {/* <JSONViewer>{getTopicsAPI.data}</JSONViewer> */}
      </div>
    )
  }

}

function TopicsGrid({ topics, onCreatedTopic = null, heading = '' }) {

  const createTopicAPI = useAPI(topicsAPIService.createTopic)

  async function createTopic(title) {
    const response = await createTopicAPI.request(title, null);

    if (response.ok) {
      console.log('current topcis data ', topics);
      console.log('recieved data ', response.data);

      onCreatedTopic(response.data);
    }
  }

  if (createTopicAPI.loading) {
    return <LoadingIndicatorFullScreen visible={true} />
  }

  return (
    // Surface
    <div className={' p-3 flex flex-col gap-3 '} >
      {heading && <SectionHeader bar={false} className='uppercase'>{heading}</SectionHeader>}
      {/* Topics grid */}
      <div className='flex flex-col flex-wrap sm:flex-row gap-3'>
        {topics.map((item) => {
          return (
            <ListItemPath
              key={item.id}
              to={APIEndpoints.TOPICS + item.id}
              className='w-full sm:w-fit'
              published={false}
              showBadge={false}
              title={item.title ? item.title : "No Title"}
              // overline={item.about ? item.about : "No Description"}
              overline={item.authorName}
            />
            // <SanEDDButton
            //   key={item.id}
            //   className='border-cclrs-dark-strong bg-san-surface text-san-on-surface dark:text-san-dark-on-surface dark:bg-san-dark-surface w-full'
            //   to={APIEndpoints.TOPICS + item.id}
            //   style={{ width: 200 }}
            //   title={item.title}
            //   overline={item.authorName}
            //   // overline={item.about}
            // />
          );
        })}
        {onCreatedTopic &&
          <SanEDDButton
            onClick={() => {
              const title = window.prompt("Enter new topic's name:");
              if (title === null) return;
              createTopic(title);
            }}
            className=' bg-san-positive-container text-san-on-positive-container dark:bg-san-dark-positive dark:text-san-dark-on-positive border-current'
            style={{ width: 200 }}
            title={"Create New Topic"}
          />
        }
      </div>
    </div>
  );
}

// export default function Topics() {
//   const [orphanTopics, setOrphanTopics] = useState(null);

//   const loadOrphanTopics = async () => {
//     console.log("fetching orphan topics...");
//     // await new Promise((r) => setTimeout(r, 2000));
//     const result = await topicsAPIService.getOrphanTopics();
//     if (!result.ok) return "Error: " + result.problem;
//     console.log(result.data);
//     setOrphanTopics(result.data);
//     return result.data;
//   };

//   useEffect(() => {
//     loadOrphanTopics();
//   }, []);
//   if (orphanTopics) {
//     return (
//       <div
//         style={{
//           padding: dimensions.contentDistance,
//           display: "flex",
//           flexWrap: "wrap",
//           flexDirection: "row",
//           gap: dimensions.contentDistance,
//         }}
//       >
//         <SectionHeader>
//           Topics that don&apos;t have any subject assigned:
//         </SectionHeader>
//         {orphanTopics.map((item) => {
//           return (
//             <SanEDDButton
//               key={item.id}
//               to={APIEndpoints.TOPICS + item.id}
//               style={{ width: 200 }}
//               title={item.title}
//               overline={item.about}
//             />
//           );
//         })}
//       </div>
//     );
//   } else {
//     return (
//       <div>
//         <Modal />
//       </div>
//     );
//   }
// }
