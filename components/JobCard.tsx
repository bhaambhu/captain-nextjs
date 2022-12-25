import Router from 'next/router';
import React from 'react'
import { MdDateRange, MdWarningAmber, MdLocationCity, MdInfoOutline, MdShare, MdArrowForward, MdOutlineArrowForwardIos } from 'react-icons/md'

const JobCard = ({ jobDisplayData }) => {
    const today = new Date().setHours(0,0,0,0);
    let lastDate = new Date(jobDisplayData.lastDate.date).setHours(0,0,0,0);
    lastDate = lastDate === today;
    return (
        <div className={"h-full p-6 rounded-lg border-2 flex flex-1 flex-col relative overflow-hidden" + (lastDate ? " border-red-500 " : " border-purple-500 ")}>
            {lastDate && <span className="bg-red-500 text-white px-3 py-1 tracking-widest text-xs absolute right-0 top-0 rounded-bl">LAST DATE</span>}
            <h2 className="text-sm tracking-widest title-font mb-1 font-medium">{jobDisplayData.organization}</h2>
            <h1 className="text-5xl text-gray-900 pb-4 mb-4 border-b border-gray-200 leading-none">{jobDisplayData.nameOfPost}</h1>
            {jobDisplayData.numPosts && <p className="flex items-center text-gray-600 mb-2">
                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center flex-shrink-0 text-gray-500">
                    <MdInfoOutline />
                </span>{jobDisplayData.numPosts} Posts
            </p>}
            {jobDisplayData.location && <p className="flex items-center text-gray-600 mb-2">
                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center flex-shrink-0 text-gray-500">
                    <MdLocationCity />
                </span>{jobDisplayData.location}
            </p>}

            {/* Important Dates */}
            {jobDisplayData.impDates?.map(impDate => {
                return (
                    <p key={impDate._id} className="flex items-center text-gray-600 mb-2">
                        <span className="w-4 h-4 mr-2 inline-flex items-center justify-center flex-shrink-0 text-gray-500">
                            <MdDateRange />
                        </span>
                        {impDate.label} :<i className='ml-1'>
                        {new Date(impDate.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </i>
                    </p>)
            })}
            {jobDisplayData.lastDate.date && <p className="flex items-center text-gray-600 mb-6">
                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center flex-shrink-0 text-gray-500">
                    <MdWarningAmber />
                </span>{new Date(jobDisplayData.lastDate.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                {jobDisplayData.lastDate.label && " ("+jobDisplayData.lastDate.label+")"}
            </p>}

            {/* Buttons */}
            <div className='flex gap-3 mt-auto'>
                <button onClick={()=>{Router.push({
                    pathname: '/jobs/add',
                    query: { data: JSON.stringify(jobDisplayData)}
                })}} className="flex  items-center mt-auto text-purple-500 outline outline-2 py-2 px-4 w-full hover:text-purple-600 rounded">Edit
                    <MdShare className="w-4 h-4 ml-auto" />
                </button>
                <button className="flex items-center mt-auto text-white bg-purple-500 outline outline-purple-500 outline-2 py-2 px-4 w-full hover:outline-purple-600 hover:bg-purple-600 rounded">Read More
                    <MdOutlineArrowForwardIos className="w-4 h-4 ml-auto" />
                </button>
            </div>
        </div>
    )
}

export default JobCard