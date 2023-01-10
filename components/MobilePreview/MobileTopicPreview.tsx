import React, { useEffect, useRef, useState } from 'react'
import { stepType } from '../../config/enums'
import { breadString } from '../../lib/utils'
import JSONViewer from '../JSONViewer'
import MarkdownPreview from '../Markdown/MarkdownPreview'
import MobileScreenContainer from './MobileScreenContainer'
import { SlBookOpen, SlQuestion } from 'react-icons/sl'
import ScrollContainer from 'react-indiana-drag-scroll'
import { RiTimerFill } from 'react-icons/ri'
import { FaChild, FaHandPointDown } from 'react-icons/fa'
import { MdCheck, MdOutlineArrowBackIos, MdOutlineCheckCircle, MdRadioButtonUnchecked } from 'react-icons/md'
import { ImCheckmark, ImCross } from 'react-icons/im'
import LottiePlayer from '../LottiePlayer'

export default function MobileTopicPreview({ topicData, showJSON = false }) {

  return (
    <div className='flex ml-3'>
      <MobileScreenContainer>
        <TopicPreview topicData={topicData} />
      </MobileScreenContainer>
      {showJSON && <JSONViewer>{topicData}</JSONViewer>}
    </div>
  )
}

export function TopicPreview({ topicData, onBackButton, onProceedToNextTopicButton, proceedToNextTopicButtonText = 'Continue to Next Topic' }) {
  const [selectedStepIndex, setSelectedStepIndex] = useState(0)
  let maxStepIndex = topicData.steps.length - 1;

  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    setSelectedStepIndex(0)
  }, [topicData])

  return (
    <>
      {selectedStepIndex <= maxStepIndex ?
        <ScrollContainer ref={ref} className='p-3 w-0 min-w-full h-0 min-h-full overflow-auto cursor-pointer'>

          {/* <div className='p-3 w-full h-0 min-h-full overflow-auto'> */}
          {/* Breadcrumbs & Back Button */}
          <div className='font-mono font-bold flex flex-wrap text-cclrs-light-disabled text-xs gap-1 items-center'>
            {onBackButton && <div onClick={onBackButton} className='flex uppercase border p-[1px] px-[2px] text-[10px] border-current items-center rounded-sm'><MdOutlineArrowBackIos size={8} /><span className='ml-0.5 mt-[1px]'>Back to path</span></div>}
            <div className='mt-1 uppercase'>
              {breadString(topicData.breadcrumbs, true) + ' > '}
            </div>
          </div>
          <div className='font-h1_headline text-2xl mt-1'>{topicData.title}</div>
          <StepsTabsNavbar stepsData={topicData.steps} selectedStepID={selectedStepIndex} setSelectedStepID={setSelectedStepIndex} />
          {/* Show selected step's data */}
          {topicData.steps[selectedStepIndex]?.type == stepType.Theory ?
            <TheoryStepPreview stepData={topicData.steps[selectedStepIndex]} onProceedButtonClick={selectedStepIndex <= maxStepIndex ?
              () => {
                setSelectedStepIndex(selectedStepIndex + 1);
                ref.current?.scrollTo({ top: 0 })
              }
              : null
            } />
            : <MCQStepPreview stepData={topicData.steps[selectedStepIndex]}
              onProceedButtonClick={selectedStepIndex <= maxStepIndex ?
                () => {
                  setSelectedStepIndex(selectedStepIndex + 1);
                  ref.current?.scrollTo({ top: 0 })
                }
                : null
              }
            />

          }
          {/* </div> */}
        </ScrollContainer>
        : <TopicCompletedScreen
          onProceedButtonClick={onProceedToNextTopicButton ? onProceedToNextTopicButton : () => {
            setSelectedStepIndex(0);
            ref.current?.scrollTo({ top: 0 });
          }}
          proceedButtonText={onProceedToNextTopicButton ? proceedToNextTopicButtonText : 'Restart'}
        />
      }
    </>
  )
}

function MCQStepPreview({ stepData, onProceedButtonClick }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSelectedOption(null);
    setSubmitted(false);
  }, [stepData])


  const isCorrect = () => {
    if (selectedOption != null) return stepData.options[selectedOption].correct;
    else return null;
  };

  return (
    <div className='flex flex-col'>
      {/* MCQ Title */}
      <div className='mt-3 font-mono font-bold flex flex-wrap text-cclrs-light-disabled text-xs items-center'>
        {stepData.title}
      </div>
      {/* Time & Difficulty */}
      <div className='flex gap-3 text-[11px] mt-1 text-cclrs-light-disabled '>
        <div className='flex items-center gap-0.5 px-0.5 border border-current font-overline uppercase rounded'>
          <RiTimerFill />{stepData.timeLength}
        </div>
        <div className='flex items-center gap-0.5 px-0.5 border border-current  font-overline uppercase rounded'>
          <FaChild />{stepData.difficulty}
        </div>
      </div>
      {/* Question Content */}
      <div className='font-h6_headline text-lg mt-2'>{stepData.content}</div>
      {/* Options */}
      <RadioGroup
        selectedIndex={selectedOption}
        allowInput={!submitted}
        onSelect={(index) => {
          setSelectedOption(index);
        }}
        options={stepData.options.map((item) => item.content)}
      />
      {/* Correct or Not Section */}
      {submitted ? (
        isCorrect() ? (
          <>
            <div className='flex items-center gap-1 mt-2 text-cclrs-green-type3 uppercase text-xs font-extrabold'>
              <ImCheckmark />
              Correct
            </div>
            {/* Explanation */}
            <div className='text-xs'>
              {stepData.explanation}
            </div>
            <div onClick={onProceedButtonClick} className='cursor-pointer border border-current w-fit self-end mt-3 bg-cclrs-bg-yellow px-1 py-0.5 rounded-sm font-overline'>
              Proceed
            </div>
          </>
        )
          : (
            <>
              <div className='flex items-center gap-1 mt-2 text-san-error uppercase text-xs font-extrabold'>
                <ImCross />
                Wrong
              </div>
              <div onClick={() => { setSelectedOption(null); setSubmitted(false); }} className='cursor-pointer border border-current w-fit self-end mt-3 px-1 py-0.5 rounded-sm font-overline'>
                Retry
              </div>
            </>
          )
      )
        : (
          <div onClick={() => setSubmitted(true)} className='cursor-pointer border border-current w-fit self-start mt-3 px-1 py-0.5 rounded-sm font-overline'>
            Submit
          </div>
        )
      }
    </div>
  )
}

function RadioGroup({ selectedIndex, allowInput = true, onSelect, options }) {
  return (
    <>
      {/* UX Info */}
      <div className='flex items-center gap-1 text-cclrs-light-disabled text-[10px] mt-1 ml-2 font-subtitle_1 uppercase'>
        <FaHandPointDown />
        Select one option
      </div>
      {options.map((item, index) => {
        return (
          <div
            onClick={() => {
              if (allowInput) onSelect(index);
            }}
            key={index}
            className={`flex text-xs gap-1 mt-2 border p-0.5 px-1 rounded ${index === selectedIndex ? 'border-san-primary text-san-primary' : ''}`}
          >
            {/* Radio Button Icon */}
            <div className='pt-0.5'>
              {index === selectedIndex ?
                <MdOutlineCheckCircle />
                : <MdRadioButtonUnchecked />
              }
            </div>
            <div>
              {item}
            </div>
          </div>
        )
      })}
    </>
  )
}

function TheoryStepPreview({ stepData, onProceedButtonClick }) {
  return (
    <div className='flex flex-col'>
      {/* Markdown previewer */}
      <div className='prose prose-sm mt-3 text-xs'>
        <MarkdownPreview>{stepData.data}</MarkdownPreview>
      </div>
      {/*  */}
      {onProceedButtonClick &&
        <div onClick={onProceedButtonClick} className='cursor-pointer border border-current w-fit self-end mt-3 bg-cclrs-bg-yellow px-1 py-0.5 rounded-sm font-overline'>
          Proceed
        </div>
      }
    </div>
  )
}

function StepsTabsNavbar({ stepsData, selectedStepID, setSelectedStepID }) {
  return (
    <div className='flex flex-wrap gap-3 mt-3'>
      {stepsData.map((item, index) => {
        return (
          <div
            key={index}
            onClick={() => { setSelectedStepID(index) }}
            className={`p-1.5 cursor-pointer rounded-sm border border-current ${selectedStepID == index ? ' bg-san-surface ' : ' bg-san-surface-variant '}`}
          >
            {/* Icon based on step type */}
            {item.type == stepType.Theory ? <SlBookOpen /> : <SlQuestion />}
          </div>
        )
      })}
    </div>
  )
}

function TopicCompletedScreen({ onProceedButtonClick, proceedButtonText = 'Continue to Next Topic' }) {
  const [animCompleted, setAnimCompleted] = useState(false)
  return (
    <div className='flex h-full flex-col items-center justify-around duration-1000 transition-all'>
      <LottiePlayer className='h-fit'
        onComplete={() => {
          setAnimCompleted(true);
        }}
        src={'https://assets5.lottiefiles.com/packages/lf20_4qldwfx4.json'}
      />
      {onProceedButtonClick &&
        <div onClick={onProceedButtonClick} className={`cursor-pointer border border-current w-fit mt-3 px-1 py-0.5 rounded-sm font-overline transition-opacity duration-1000 ${animCompleted ? 'opacity-100' : 'opacity-0'}`}>
          {proceedButtonText}
        </div>
      }
    </div>
  )
}