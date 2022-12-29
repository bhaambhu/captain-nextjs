import React, { FunctionComponent } from 'react'
import { twMerge } from 'tailwind-merge'

interface BaseProps {
  height?: string | number
  width?: string | number
  color?: string
  ariaLabel?: string
  wrapperStyle?: Style
  className?: string
  visible?: boolean
}

const DEFAULT_COLOR = '#4fa94d'

type Style = {
  [key: string]: string
}

const DEFAULT_WAI_ARIA_ATTRIBUTE = {
  'aria-busy': true,
  role: 'status',
}

const getDefaultStyle = (visible: boolean): Style => ({
  display: visible ? 'flex' : 'none',
})

interface BallTriangleProps extends BaseProps {
  radius?: string | number
}

const SanSpinner: FunctionComponent<BallTriangleProps> = ({
  height = 100,
  width = 100,
  radius = 5,
  ariaLabel = 'ball-triangle-loading',
  className='',
  wrapperStyle,
  visible = true,
}) => (
  <div
    style={{ ...getDefaultStyle(visible), ...wrapperStyle }}
    className={twMerge(className+' stroke-current fill-current ')}
    data-testid="ball-triangle-loading"
    aria-label={ariaLabel}
    {...DEFAULT_WAI_ARIA_ATTRIBUTE}
  >
    <svg
      height={height}
      width={width}
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      data-testid="ball-triangle-svg"
    >
      <g><circle cx="16" cy="64" r="16" fill="#000000"/><circle cx="16" cy="64" r="16" fill="#555555" transform="rotate(45,64,64)"/><circle cx="16" cy="64" r="16" fill="#949494" transform="rotate(90,64,64)"/><circle cx="16" cy="64" r="16" fill="#cccccc" transform="rotate(135,64,64)"/><circle cx="16" cy="64" r="16" fill="#e1e1e1" transform="rotate(180,64,64)"/><circle cx="16" cy="64" r="16" fill="#e1e1e1" transform="rotate(225,64,64)"/><circle cx="16" cy="64" r="16" fill="#e1e1e1" transform="rotate(270,64,64)"/><circle cx="16" cy="64" r="16" fill="#e1e1e1" transform="rotate(315,64,64)"/><animateTransform attributeName="transform" type="rotate" values="0 64 64;315 64 64;270 64 64;225 64 64;180 64 64;135 64 64;90 64 64;45 64 64" calcMode="discrete" dur="720ms" repeatCount="indefinite"></animateTransform></g>
    </svg>
  </div>
)

export default SanSpinner