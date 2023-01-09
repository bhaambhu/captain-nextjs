import Image from 'next/image'
import React, { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { activityState } from '../../config/enums'
import topicsAPIService from '../../lib/APIServices/topicsAPIService'
import useAPI from '../../lib/useAPI'
import ListItemStudyPlan from '../ListItems/ListItemStudyPlan'
import LottiePlayer from '../LottiePlayer'
import MobileScreenContainer from './MobileScreenContainer'
import { TopicPreview } from './MobileTopicPreview'

export default function MobilePathPreview({ data }) {
  return (
    <MobileScreenContainer>
      <PathPreview pathData={data} />
    </MobileScreenContainer>
  )
}

function PathPreview({ pathData }) {

  const useLoadTopicAPI = useAPI(topicsAPIService.getTopic)
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0)
  async function loadTopicData(topicIndex) {
    let result = await useLoadTopicAPI.request(pathData.topic_sequence[topicIndex].topic.id)
    setCurrentTopicIndex(topicIndex);
  }
  let maxTopicIndex = pathData.topic_sequence.length - 1;
  async function loadNextTopicData() {
    if (currentTopicIndex < maxTopicIndex) {
      return await loadTopicData(currentTopicIndex+1);
    }else {
      useLoadTopicAPI.setLoadedOnce(false)
    }
  }

  return (
    <div className='relative w-full h-full'>
      <div className=' w-full h-full absolute'>
        {useLoadTopicAPI.loadedOnce ?
          <TopicPreview
            topicData={useLoadTopicAPI.data}
            onBackButton={() => { useLoadTopicAPI.setLoadedOnce(false) }}
            onProceedToNextTopicButton={loadNextTopicData}
            proceedToNextTopicButtonText={currentTopicIndex < maxTopicIndex ? 'Continue to Next Topic' : 'Return To Path'}
          />
          : <AboutPathScreen pathData={pathData} onClickTopicButton={loadTopicData} />}
      </div>
      {useLoadTopicAPI.loading &&
        <div className='absolute w-full h-full '>
          <LottiePlayer
            loop
            className='opacity-90 bg-white'
            src={'https://assets9.lottiefiles.com/packages/lf20_GzIQOnSaf8.json'} />
          <div>ABC</div>
        </div>
      }
    </div>
  )
}

function AboutPathScreen({ pathData, onClickTopicButton }) {
  return (
    <div className='px-3 mt-3'>
      {/* Title Section */}
      <div className='flex flex-row flex-wrap items-end'>
        <PageHeading>Study Path</PageHeading>
        <span className='font-subtitle_1 text-xs'>for {pathData.title}</span>
      </div>

      {/* About */}
      <span className='font-subtitle_1 text-xs'>{pathData.about}</span>

      {/* Topics */}
      {pathData.topic_sequence.map((object, i) => {
        return (
          <ListItemStudyPlan
            key={object.order}
            title={object.topic.title}
            subtitle={object.topic.about}
            currentTopic={i == 0}
            className='mt-3 w-full'
            onClick={() => { onClickTopicButton(i) }}
          />
        )
      })}
    </div>
  )
}

function PageHeading({ children, className = '' }) {
  return (
    <div
      className={twMerge('font-overline text-3xl ' + className)}
    >{children}</div>
  )
}
