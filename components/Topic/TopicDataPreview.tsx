import React from 'react'
import twColors from '../../config/twColors'
import { Button } from '../Buttons/Button'
import JSONViewer from '../JSONViewer'
import MobileTopicPreview from '../MobilePreview/MobileTopicPreview'
import InfoPill from '../Pills/InfoPill'
import H1 from '../Texts/H1'
import SectionHeader from '../Texts/SectionHeader'
import Subtitle from '../Texts/Subtitle'

export default function TopicDataPreview({ topicData, onEditButtonPress = null, onDeleteButtonPress = null, infoMessage = '' }) {
  return (
    <div className={twColors.surfaceSimple + ' p-3 border '}>
      <H1>{topicData.title || "Untitled Topic"}</H1>
      {topicData.about && <Subtitle>{topicData.about}</Subtitle>}
      {/* Action Buttons */}
      {(onEditButtonPress || onDeleteButtonPress) && <div className='flex gap-3 mt-3'>
        {onEditButtonPress &&
          <>
            <Button className={twColors.addContainer + 'max-sm:hidden'} onClick={onEditButtonPress}>Edit</Button>
            <Button className={twColors.disabledContainer + 'sm:hidden'} onClick={() => {
              alert("The user-interface for editing a topic is very comprehensive, so it has been disabled for phones. You can edit on any large-screen device.")
            }}>Edit</Button>
          </>
        }
        {onDeleteButtonPress && <Button className={twColors.deleteContainer} onClick={onDeleteButtonPress}>Delete</Button>}
      </div>}
      {infoMessage &&
        <div className='mt-3 w-fit'>
          <InfoPill message={infoMessage} />
        </div>
      }
      <SectionHeader className='flex items-center gap-3 mt-3'>PREVIEW
        <InfoPill message="Only for illustration, does not mimic the mobile app" />
      </SectionHeader>
      <MobileTopicPreview topicData={topicData} />
      {/* <JSONViewer heading={'Topic Data'}>{topicData}</JSONViewer> */}
    </div>
  )
}
