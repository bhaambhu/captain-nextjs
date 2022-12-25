import React, { useState } from 'react'
import { Switch } from '@headlessui/react'

export default function Toggle({ enabled, onChange }) {

  return (
    <Switch
      checked={enabled}
      onChange={onChange}
      className={`${enabled ? 'bg-cclrs-green-strong' : 'bg-cclrs-dark-medium'}
          relative inline-flex h-full w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
    >
      <span className="sr-only">Use Toggle</span>
      <span
        aria-hidden="true"
        className={`${enabled ? 'translate-x-full' : 'translate-x-0'}
            pointer-events-none inline-block h-full w-[50%] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
      />
    </Switch>
  )
}
