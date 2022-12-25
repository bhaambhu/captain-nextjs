import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import prisma from '../lib/prisma'
import JobCard from '../components/JobCard'

export default function Home() {
  const jobs = [
    {
      organization: "DSSSB",
      nameOfPost: "Post Graduate Teacher",
      advDate: new Date(2022, 6, 16),
      lastDate: new Date(2022, 8, 19),
      location: "Haryana",
      numPosts: 80
    },
    {
      organization: "HPSC",
      nameOfPost: "Assistant Professor",
      advDate: new Date(2022, 6, 16),
      lastDate: new Date(2022, 7, 19),
      location: "Haryana",
      numPosts: 80
    }
  ]
  
  return (
    <div>Welcome to SA!</div>
  )
}
