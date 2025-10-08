import { useState } from 'react';
import UsersList from '../../../constants/data/usersData';
import UserListItem from './UserListItem';
import Pagination from '../../../components/Pagination';
import { ICONS } from '../../../constants/assets';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteDialogBox';
import EditUserModal from './EditUserModal';
import ConfirmationModal from '../../../components/ConfirmationModal';

const UserList = ({ userDetails, setUserDetails }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dependentDetails, setDependentDetails] = useState(false);
  const [deleteModal,setDeleteModal]=useState(false)
  const [confirmModal,setConfirmModal]=useState(false)

  const [editModal,setEditModal]=useState(false)

  const pageSize = 5;
  const totalPages = Math.ceil(UsersList.length / pageSize);
  const [activeTab, setActiveTab] = useState('Completed');
  const tabs = ['Completed', 'Upcoming', 'Due Soon', 'Overdue'];

  const vaccines = [
    {
      vaccine: 'Influenza',
      hospital: 'Fortis Hospital, Delhi',
      dose: '3 / 3',
      date: '12 Jan 2025',
      time: '09:30 AM',
      certificate: 'Uploaded',
      status: true,
    },
    {
      vaccine: 'Hepatitis B',
      hospital: 'Lotus Medical Institute, Delhi',
      dose: '2 / 3',
      date: '20 Mar 2025',
      time: '10:00 AM',
      certificate: 'Not Uploaded',
      status: false,
    },
  ];

  const dependents = [
    {
      name: 'Muhammad Musa',
      relation: 'Son',
      img: 'https://i.pravatar.cc/100?img=1',
    },
    {
      name: 'Sarah Imran',
      relation: 'Daughter',
      img: 'https://i.pravatar.cc/100?img=2',
    },
    {
      name: 'Ahmad Malik',
      relation: 'Husband',
      img: 'https://i.pravatar.cc/100?img=3',
    },
  ];

  const handleUserDetails = idx => {
    setUserDetails(true);
  };

  const handleDependentDetails = i => {
    setDependentDetails(true);
  };
  const formatDate = dateStr => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = UsersList.slice(startIndex, startIndex + pageSize);

  return (
    <div className='w-full h-full flex flex-col'>
      {!userDetails && (
        <>
          <div className='flex w-full items-center justify-between mb-4 px-2'>
            <h2 className='text-lg font-semibold text-gray-700'>
              Total Users:
            </h2>
            <span className='text-sm text-gray-500'>{UsersList.length}</span>
          </div>

          <div className='flex h-[50px] bg-blue-500 text-white font-semibold rounded-lg'>
            <div className='flex items-center justify-center w-[14%]'>
              Photo
            </div>
            <div className='flex items-center justify-center w-[18%]'>User</div>
            <div className='flex items-center justify-center w-[26%]'>
              Login
            </div>
            <div className='flex items-center justify-center w-[14%]'>Date</div>
            <div className='flex items-center justify-center w-[14%]'>
              Status
            </div>
            <div className='flex items-center justify-center w-[14%]'>
              Actions
            </div>
          </div>

          <div className='flex flex-col gap-2 mt-2 flex-1 overflow-y-auto pr-2'>
            {paginatedUsers.map((user, idx) => (
              <UserListItem
                key={idx}
                user={user}
                formatDate={formatDate}
                handleFunction={() => handleUserDetails(idx)}
              />
            ))}
          </div>

          <div className='flex justify-end mt-4'>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}

      {userDetails && (
        <>
          <div className='w-full h-[280px] flex flex-col md:flex-row  justify-center gap-6 '>
            {/* profilef card */}
            <div
              className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-5 ${
                !dependentDetails
                  ? 'w-auto md:w-[50%] flex flex-col justify-between'
                  : 'w-full'
              }`}
            >
              <div>
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center gap-4'>
                    <img
                      src='https://i.pravatar.cc/100?img=4'
                      alt='Profile'
                      className='w-14 h-14 rounded-full object-cover'
                    />
                    <div>
                      <h2 className='text-lg font-semibold text-gray-800'>
                        Sara Malik
                      </h2>
                      <p className='text-sm text-gray-500'>
                        saramalik@gmail.com
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <button className='p-2 rounded-full bg-blue-50 hover:bg-blue-200 transition' onClick={()=>setEditModal(true)}>
                      <img src={ICONS.edituser} />
                    </button>
                    <button className='p-2 rounded-full bg-blue-50 hover:bg-blue-200 transition' onClick={()=>setDeleteModal(true)}>
                      <img src={ICONS.delete} />
                    </button>
                  </div>
                </div>

                <hr className='border-gray-200 mb-4' />

                {/* Info Grid */}
                <div className='grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-700'>
                  <div>
                    <p className='font-semibold text-gray-600'>Date of Birth</p>
                    <p>25 August 1985</p>
                  </div>
                  <div>
                    <p className='font-semibold text-gray-600'>Gender</p>
                    <p>Female</p>
                  </div>
                  <div>
                    <p className='font-semibold text-gray-600'>Country</p>
                    <p>India</p>
                  </div>
                  <div>
                    <p className='font-semibold text-gray-600'>Address</p>
                    <p>abc street xyz City.</p>
                  </div>
                  <div>
                    <p className='font-semibold text-gray-600'>Phone Number</p>
                    <p>+914987941461</p>
                  </div>
                  <div>
                    <p className='font-semibold text-gray-600'>
                      Marital Status
                    </p>
                    <p>Married</p>
                  </div>
                  <div>
                    <p className='font-semibold text-gray-600'>Children</p>
                    <p>2</p>
                  </div>
                  <div>
                    <p className='font-semibold text-gray-600'>Pregnancy</p>
                    <p>Yes</p>
                  </div>
                  <div>
                    <p className='font-semibold text-gray-600'>Trimester</p>
                    <p>1</p>
                  </div>
                </div>
              </div>
            </div>

            {/* dependent card */}
            {!dependentDetails && (
              <div className='flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 w-auto md:w-[50%] p-5 '>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='font-semibold text-gray-700'>Dependents</h3>
                  <span className='text-sm text-gray-500'>
                    ({dependents.length})
                  </span>
                </div>

                <hr className='border-gray-200 mb-3' />

                {/* dependent list */}
                <div className='flex flex-col gap-3 overflow-y-auto'>
                  {dependents.map((dep, i) => (
                    <div
                      key={i}
                      className='flex items-center gap-2 bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition cursor-pointer'
                      onClick={() => handleDependentDetails(i)}
                    >
                      <img
                        src={dep.img}
                        alt={dep.name}
                        className='w-10 h-10 rounded-full object-cover'
                      />
                      <div>
                        <p className='font-medium text-gray-800'>{dep.name}</p>
                        <p className='text-sm text-gray-500'>{dep.relation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className='bg-white border border-gray-200 rounded-2xl shadow-sm p-5 w-full mx-auto mt-6'>
            <h2 className='text-lg font-semibold text-gray-800 mb-3'>
              Logged Vaccine:
            </h2>

            {/* tabs */}
  <div className="flex flex-wrap gap-2 mb-5">
  {(dependentDetails ? tabs.filter(tab => tab === 'Completed' || tab === 'Overdue') : tabs).map(tab => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 rounded-lg font-medium transition ${
        activeTab === tab
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
      }`}
    >
      {tab}
    </button>
  ))}
</div>


            {/* completed section */}
            {activeTab === 'Completed' && (
              <>
                <h3 className='text-lg font-semibold text-gray-600 mb-2'>
                  Completed:
                </h3>

                <div className='overflow-x-auto'>
                  <table className='w-full border-collapse'>
                    <thead>
                      <tr className='bg-blue-600 text-white text-md'>
                        <th className='text-left py-2 px-3 rounded-l-lg'>
                          Vaccine
                        </th>
                        <th className='text-left py-2 px-3'>Hospital</th>
                        <th className='text-left py-2 px-3'>Dose</th>
                        <th className='text-left py-2 px-3'>Date</th>
                        <th className='text-left py-2 px-3'>Time</th>
                        <th className='text-left py-2 px-3'>Certificate</th>
                        <th className='text-left py-2 px-3'>Status</th>
                        <th className='text-left py-2 px-3 rounded-r-lg'>
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {vaccines.map((v, i) => (
                        <tr
                          key={i}
                          className='border-b border-gray-200 bg-gray-50 hover:bg-gray-100 transition'
                        >
                          <td className='py-3 px-3 font-medium text-gray-800'>
                            {v.vaccine}
                          </td>
                          <td className='py-3 px-3 text-gray-600'>
                            {v.hospital}
                          </td>
                          <td className='py-3 px-3 text-gray-600'>{v.dose}</td>
                          <td className='py-3 px-3 text-gray-600'>{v.date}</td>
                          <td className='py-3 px-3 text-gray-600'>{v.time}</td>
                          <td className='py-3 px-3 text-gray-600'>
                            {v.certificate}
                          </td>
                          <td className='py-3 px-3'>
                            {v.status ? (
                               <img src= {ICONS?.status} />
                            ) : (
                                <img src= {ICONS?.inactiveStatus} />
                            )}
                          </td>
                          <td className='py-3 px-3'>
                            <button className='text-blue-600 hover:text-blue-800 text-lg'>
                              <img src={ICONS.delete} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {/* upcoming section */}
      {!dependentDetails && (
        <>
          {activeTab === 'Upcoming' && (
              <>
                <h3 className='text-lg font-semibold text-gray-600 mb-2'>
                  Upcoming:
                </h3>

                <div className='overflow-x-auto'>
                  <table className='w-full border-collapse'>
                    <thead>
                      <tr className='bg-blue-600 text-white text-md'>
                        <th className='text-left py-2 px-3 rounded-l-lg'>
                          Vaccine
                        </th>
                        <th className='text-left py-2 px-3'>Hospital</th>
                        <th className='text-left py-2 px-3'>Dose</th>
                        <th className='text-left py-2 px-3'>Date</th>
                        <th className='text-left py-2 px-3'>Time</th>
                        <th className='text-left py-2 px-3'>Status</th>
                        <th className='text-left py-2 px-3 rounded-r-lg'>
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {vaccines.map((v, i) => (
                        <tr
                          key={i}
                          className='border-b border-gray-200 bg-gray-50 hover:bg-gray-100 transition'
                        >
                          <td className='py-3 px-3 font-medium text-gray-800'>
                            {v.vaccine}
                          </td>
                          <td className='py-3 px-3 text-gray-600'>
                            {v.hospital}
                          </td>
                          <td className='py-3 px-3 text-gray-600'>{v.dose}</td>
                          <td className='py-3 px-3 text-gray-600'>{v.date}</td>
                          <td className='py-3 px-3 text-gray-600'>{v.time}</td>

                          <td className='py-3 px-3'>
                            {v.status ? (
                              <span className='bg-green-500 text-white px-2 py-1 rounded text-xs'>
                                ✔
                              </span>
                            ) : (
                              <span className='bg-gray-600 text-white px-2 py-1 rounded text-xs'>
                                ✖
                              </span>
                            )}
                          </td>
                          <td className='py-3 px-3'>
                            <button className='text-blue-600 hover:text-blue-800 text-lg'>
                              <img src={ICONS.delete} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {/* due soon section */}

            {activeTab === 'Due Soon' && (
              <>
                <h3 className='text-lg font-semibold text-gray-600 mb-2'>
                  Due Soon:
                </h3>

                <div className='overflow-x-auto'>
                  <table className='w-full border-collapse'>
                    <thead>
                      <tr className='bg-blue-600 text-white text-md'>
                        <th className='text-left py-2 px-3 rounded-l-lg'>
                          Vaccine
                        </th>
                        <th className='text-left py-2 px-3'>Hospital</th>
                        <th className='text-left py-2 px-3'>Dose</th>
                        <th className='text-left py-2 px-3'>Date</th>
                        <th className='text-left py-2 px-3'>Time</th>
                        <th className='text-left py-2 px-3'>Status</th>
                        <th className='text-left py-2 px-3 rounded-r-lg'>
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {vaccines.map((v, i) => (
                        <tr
                          key={i}
                          className='border-b border-gray-200 bg-gray-50 hover:bg-gray-100 transition'
                        >
                          <td className='py-3 px-3 font-medium text-gray-800'>
                            {v.vaccine}
                          </td>
                          <td className='py-3 px-3 text-gray-600'>
                            {v.hospital}
                          </td>
                          <td className='py-3 px-3 text-gray-600'>{v.dose}</td>
                          <td className='py-3 px-3 text-gray-600'>{v.date}</td>
                          <td className='py-3 px-3 text-gray-600'>{v.time}</td>

                          <td className='py-3 px-3'>
                            {v.status ? (
                              <span className='bg-green-500 text-white px-2 py-1 rounded text-xs'>
                                ✔
                              </span>
                            ) : (
                              <span className='bg-gray-600 text-white px-2 py-1 rounded text-xs'>
                                ✖
                              </span>
                            )}
                          </td>
                          <td className='py-3 px-3'>
                            <button className='text-blue-600 hover:text-blue-800 text-lg'>
                              <img src={ICONS.delete} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            </>
      )}
            
            {/* over due section */}

            {activeTab === 'Overdue' && (
              <>
                <h3 className='text-lg font-semibold text-gray-600 mb-2'>
                  Overdue:
                </h3>

                <div className='overflow-x-auto'>
                  <table className='w-full border-collapse'>
                    <thead>
                      <tr className='bg-blue-600 text-white text-md'>
                        <th className='text-left py-2 px-3 rounded-l-lg'>
                          Vaccine
                        </th>
                        <th className='text-left py-2 px-3'>Hospital</th>
                        <th className='text-left py-2 px-3'>Dose</th>
                        <th className='text-left py-2 px-3'>Date</th>
                        <th className='text-left py-2 px-3'>Time</th>
                        <th className='text-left py-2 px-3'>Status</th>
                        <th className='text-left py-2 px-3 rounded-r-lg'>
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {vaccines.map((v, i) => (
                        <tr
                          key={i}
                          className='border-b border-gray-200 bg-gray-50 hover:bg-gray-100 transition'
                        >
                          <td className='py-3 px-3 font-medium text-gray-800'>
                            {v.vaccine}
                          </td>
                          <td className='py-3 px-3 text-gray-600'>
                            {v.hospital}
                          </td>
                          <td className='py-3 px-3 text-gray-600'>{v.dose}</td>
                          <td className='py-3 px-3 text-gray-600'>{v.date}</td>
                          <td className='py-3 px-3 text-gray-600'>{v.time}</td>

                          <td className='py-3 px-3'>
                            {v.status ? (
                              <span className='bg-green-500 text-white px-2 py-1 rounded text-xs'>
                                ✔
                              </span>
                            ) : (
                              <span className='bg-gray-600 text-white px-2 py-1 rounded text-xs'>
                                ✖
                              </span>
                            )}
                          </td>
                          <td className='py-3 px-3'>
                            <button className='text-blue-600 hover:text-blue-800 text-lg'>
                              <img src={ICONS.delete} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </>
      )}
<ConfirmDeleteModal  title='Delete User' description='Are you sure you want to delete the user. This action cannot be undone.' onConfirm={()=>{setDeleteModal(false); setConfirmModal(true)}} onClose={()=>setDeleteModal(false)} open={deleteModal}/>
<EditUserModal open={editModal} onClose={()=>setEditModal(false) }/>
<ConfirmationModal open={confirmModal} onClose={()=>setConfirmModal(false) } title='Confirm Deletion' onConfirm={()=>setConfirmModal(false)} description='The user has been successfully deleted.'/>

    </div>
  );
};

export default UserList;
