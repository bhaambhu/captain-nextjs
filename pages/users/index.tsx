import React, { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge';
import { Button } from '../../components/Buttons/Button';
import JSONViewer from '../../components/JSONViewer';
import LoadingIndicatorFullScreen from '../../components/Loading/LoadingIndicatorFullScreen';
import twColors from '../../config/twColors';
import { viewableDateTime } from '../../lib/utils';
import usersAPIService from '../../lib/APIServices/usersAPIService';
import useAPI from '../../lib/useAPI';

export default function Users() {
  const [users, setUsers] = useState()

  const updateStaffRoleAPI = useAPI(usersAPIService.updateUserStaffRole)

  const loadUsersData = async () => {
    console.log("fetching data stats...");
    // await new Promise((r) => setTimeout(r, 2000));
    const result = await usersAPIService.getAllUsers();
    if (!result.ok) return "Error: " + result.problem;
    console.log(result.data);
    setUsers(result.data);
    return result.data;
  };

  function replaceUserInUserData(userData) {
    let id = userData.id;
    setUsers(users.map(item => {
      if (item.id == userData.id) {
        item.is_staff = userData.is_staff
      }
      return item;
    }));
  }

  const changeStaffRole = async (userId, isStaff) => {
    const result = await updateStaffRoleAPI.request(userId, isStaff)

    if (result.ok) {
      replaceUserInUserData(result.data)
    }
  }

  useEffect(() => {
    loadUsersData();
  }, []);

  if (!users || updateStaffRoleAPI.loading) {
    return <LoadingIndicatorFullScreen visible={true} />
  }
  return (
    <div className="p-3 gap-3 flex flex-wrap justify-center grow">
      <div className={twMerge(twColors.surface1 + 'border p-3 rounded-sm h-fit')}>
        {/* <JSONViewer>{users}</JSONViewer> */}
        <table className='table-auto'>
          <thead>
            <tr className=''>
              <th className='p-3 border border-current bg-san-surface'>E-Mail</th>
              <th className='p-3 border border-current bg-san-surface'>Display Name</th>
              <th className='p-3 border border-current bg-san-surface'>Created</th>
              <th className='p-3 border border-current bg-san-surface'>Last Login</th>
              <th className='p-3 border border-current bg-san-surface'>Staff</th>
              <th className='p-3 border border-current bg-san-surface'>Activated</th>
              <th className='p-3 border border-current bg-san-surface'>SuperUser</th>
            </tr>
          </thead>
          <tbody>
            {users.map(entry => {
              return (
                <tr key={entry.email}>
                  <td className='p-3 border border-current bg-san-surface-variant'>{entry.email}</td>
                  <td className='p-3 border border-current bg-san-surface-variant'>{entry.display_name}</td>
                  <td className='p-2 text-sm border border-current bg-san-surface-variant uppercase text-right font-mono'>{viewableDateTime(entry.start_date)}</td>
                  <td className='p-2 text-sm border border-current bg-san-surface-variant uppercase text-right font-mono'>{viewableDateTime(entry.last_login)}</td>
                  {entry.is_superuser ? <td className='p-3 border border-current bg-san-surface-variant text-center' colSpan={3}>Yes</td> : <>
                    <td className='p-3 border border-current bg-san-surface-variant text-center'><div className='flex gap-3 items-center'>{entry.is_staff ? "Yes" : "No"}{entry.is_staff ? <Button onClick={() => changeStaffRole(entry.id, false)} className={twColors.removeContainer}>Demote</Button> : <Button onClick={() => changeStaffRole(entry.id, true)}className={twColors.addContainer}>Promote</Button>}</div></td>
                    <td className='p-3 border border-current bg-san-surface-variant text-center'>{entry.is_active ? "Yes" : "No"}</td>
                    <td className='p-3 border border-current bg-san-surface-variant text-center'>{entry.is_superuser ? "Yes" : "No"}</td></>
                  }
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
