import { useRouter } from 'next/router';
import TopicPreview from '../../../components/Topic/TopicPreview';

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
