import React, { useState } from 'react'
import * as Yup from "yup";
import { twMerge } from 'tailwind-merge';
import { Button } from '../components/Buttons/Button';
import SectionHeader from '../components/Texts/SectionHeader';
import routes from '../config/routes';
import twColors from '../config/twColors';
import usersAPIService from '../lib/APIServices/usersAPIService';
import useAuth from '../lib/auth/useAuth';
import useAPI from '../lib/useAPI';
import LoadingIndicatorFullScreen from '../components/Loading/LoadingIndicatorFullScreen';
import Form from '../components/Form/Form';
import ErrorPill from '../components/Pills/ErrorPill';
import FormField from '../components/Form/FormField';
import SubmitButtonAutoHide from '../components/Form/SubmitButtonAutoHide';

export default function Profile() {
  const auth = useAuth();

  const [error, setError] = useState("");

  const updateAPI = useAPI(usersAPIService.updateUserInfo)
  const deleteAPI = useAPI(usersAPIService.deleteUser)

  const handleSubmit = async (data) => {

    const result = await updateAPI.request(auth.user.user_id, data);

    // If result is not ok, we exit this function
    if (!result.ok) {
      setError("An unexpected error occurred.");
      console.log(result);
      return;
    }

    auth.setUser({...auth.user, display_name:result.data.display_name, about:result.data.about})
  };

  const handleDelete = async () => {

    const result = await deleteAPI.request(auth.user.user_id);
    // const result = await updateAPI.request(auth.user.user_id, data);

    // If result is not ok, we exit this function
    if (!result.ok) {
      setError("An unexpected error occurred.");
      console.log(result);
      return;
    }

    auth.logOut()
    window.location.href = routes.LOGIN;
  };

  const validationSchema = Yup.object().shape({
    display_name: Yup.string().required().label("Your name"),
    about: Yup.string().label("About you"),
  });

  if(!auth.isAuthenticated()){
    window.location.href = routes.HOME;
    return;
  }
  
  return (
    <div className='flex items-center justify-center'>
      <div className={twMerge(twColors.surface1 + ' w-fit m-3 border p-3 ')}>
        <SectionHeader className='mb-3 mt-0' bar={false}>UPDATE DETAILS</SectionHeader>
        <LoadingIndicatorFullScreen visible={updateAPI.loading || deleteAPI.loading} />
        {console.log(auth.user)}
        <table className='table-fixed'>
          <tbody>
            <Form
              initialValues={{
                display_name: auth.user.display_name,
                about: auth.user.about,
                email: auth.user.email,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {/* Form Container */}
              <ErrorPill
                message={error}
                visible={error}
              />
              <tr>
                <td className='p-3 font-overline'>
                  Display Name
                </td>
                <td className='p-3'>
                  <FormField
                    autoCapitalize="words"
                    autoCorrect={false}
                    name="display_name"
                    id="display_name"
                    placeholder="Your Name"
                    textContentType="name"
                  />
                </td>
              </tr>
              <tr>
                <td className='p-3 font-overline'>
                  About
                </td>
                <td className='p-3'>
                  <FormField
                    autoCapitalize="none"
                    autoCorrect={false}
                    id="about"
                    name="about"
                    placeholder="Something about you..."
                    textContentType="about"
                  />
                </td>
              </tr>
              <tr>
                <td className='p-3 font-overline'>
                  Email
                </td>
                <td className='p-3'>
                  <input
                    className={twMerge(twColors.disabledContainer + "border resize-y p-2 font-overline ")}
                    value={auth.user.email}
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td>
                </td>
                <td className='p-3'>
                  <div className="flex justify-end">
                    <SubmitButtonAutoHide>Update</SubmitButtonAutoHide>
                  </div>
                </td>
              </tr>
            </Form>
          </tbody>
        </table>

        <SectionHeader className='mt-3'>ACTIONS</SectionHeader>
        <div className='flex justify-between mt-3'>
          <Button
            className={twColors.deleteContainer}
            onClick={handleDelete}
          >
            Delete Account
          </Button>
          <Button
            className={twColors.removeContainer}
            onClick={() => {
              auth.logOut();
              window.location.href = routes.HOME;
            }}
          >
            Logout
          </Button>
        </div>
        {/* <JSONViewer className='w-fit mb-3'>{auth}</JSONViewer> */}
      </div>
    </div >
  );
}
