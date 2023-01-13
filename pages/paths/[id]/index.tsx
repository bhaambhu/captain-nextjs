import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Button } from '../../../components/Buttons/Button';
import LoadingIndicatorFullScreen from '../../../components/Loading/LoadingIndicatorFullScreen';
import MobilePathPreview from '../../../components/MobilePreview/MobilePathPreview';
import InfoPill from '../../../components/Pills/InfoPill';
import H1 from '../../../components/Texts/H1';
import SectionHeader from '../../../components/Texts/SectionHeader';
import Subtitle from '../../../components/Texts/Subtitle';
import routes from '../../../config/routes';
import twColors from '../../../config/twColors';
import { confirmation } from '../../../lib/utils';
import pathsAPIService from '../../../lib/APIServices/pathsAPIService';
import useAuth from '../../../lib/auth/useAuth';
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
          <Button className={twColors.addContainer + 'max-sm:hidden'} onClick={() => {
            router.push(router.asPath + '/edit/')
          }}>Edit</Button>
          <Button className={twColors.disabledContainer + 'sm:hidden'} onClick={() => {
            alert("The user-interface for editing a path is very comprehensive, so it has been disabled for phones. You can edit on any large-screen device.")
          }}>Edit</Button>
          <Button className={twColors.deleteContainer} onClick={deletePath}>Delete</Button>
        </div>}
        {!auth.canAuthor(pathDetailsAPI.data.author) &&
          <div className='mt-3 w-fit'>
            <InfoPill message='Only the author can modify this path' />
          </div>
        }
        <SectionHeader className='flex items-center gap-3 mt-3'>PREVIEW
          <InfoPill message="Only for illustration, does not mimic the mobile app" />
        </SectionHeader>
        <div className='flex max-sm:justify-center'>
          <MobilePathPreview data={pathDetailsAPI.data} />
        </div>
      </div>
    </div>
  )
}
