import React from 'react'
import twColors from '../../config/twColors'
import { Button } from '../Buttons/Button'
import JSONViewer from '../JSONViewer'
import MobileTopicPreview from '../MobilePreview/MobileTopicPreview'
import InfoPill from '../Pills/InfoPill'
import H1 from '../Texts/H1'
import SectionHeader from '../Texts/SectionHeader'
import Subtitle from '../Texts/Subtitle'

export default function TopicDataPreview({topicData, onEditButtonPress = null, onDeleteButtonPress = null, infoMessage=''}) {
  return (
    <div className={twColors.surfaceSimple + ' p-3 border '}>
      <H1>{topicData.title || "Untitled Topic"}</H1>
      {topicData.about && <Subtitle>{topicData.about}</Subtitle>}
      {/* Action Buttons */}
      {(onEditButtonPress || onDeleteButtonPress) && <div className='flex gap-3 mt-3'>
        {onEditButtonPress && <Button className={twColors.addContainer} onClick={onEditButtonPress}>Edit</Button>}
        {onDeleteButtonPress && <Button className={twColors.deleteContainer} onClick={onDeleteButtonPress}>Delete</Button>}
      </div>}
      {infoMessage && 
      <div className='mt-3 w-fit'>
        <InfoPill message={infoMessage} />
      </div>
      }
      <SectionHeader>PREVIEW</SectionHeader>
      <MobileTopicPreview topicData={topicData} />
      {/* <JSONViewer heading={'Topic Data'}>{topicData}</JSONViewer> */}
    </div>
  )
}
