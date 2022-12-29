import Link from 'next/link'
import React from 'react'

const Header = () => {
    return (
        <header className="sticky z-10 top-0 bg-san-surface text-san-on-surface dark:bg-san-dark-surface dark:text-san-dark-on-surface border-b-2">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <Link href={'/'} legacyBehavior><a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-purple-500 rounded-full" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                    <span className="ml-3 text-xl font-light">Sarkari</span>
                    <span className="ml-1 text-xl font-extrabold">Academy</span>
                </a></Link>
                <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400	flex flex-wrap items-center text-base justify-center">
                    <Link href={'/jobs'} legacyBehavior><a className="mr-5 hover:text-gray-900">Jobs</a></Link>
                    <Link href={'/prepare'} legacyBehavior><a className="mr-5 hover:text-gray-900">Computer Science</a></Link>
                    {/* <Link href={'/jobs/add'} legacyBehavior><a className="mr-5 hover:text-gray-900">Add Job</a></Link> */}
                    {/* <Link href={'/advertisements'} legacyBehavior><a className="mr-5 hover:text-gray-900">Advertisements</a></Link> */}
                    {/* <Link href={'/advertisements/add'} legacyBehavior><a className="mr-5 hover:text-gray-900">Add Advertisement</a></Link> */}
                </nav>
                <div>
                <Link href={'/signup'}>
                    <button className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Sign Up
                    </button>
                </Link>
                <Link href={'/login'}>
                    <button className="inline-flex items-center bg-purple-500 border-0 ml-3 py-1 px-3 focus:outline-none hover:bg-purple-600 rounded text-white mt-4 md:mt-0">Login
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg></button>
                </Link>
                </div>
            </div>
        </header>
    )
}

export default Header