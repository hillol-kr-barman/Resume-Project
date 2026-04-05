import { Transition } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/20/solid'

export default function ConfirmationMessage({ open = false, message = 'Document saved successfully.' }) {
  return (
    <Transition
      show={open}
      appear
      as="div"
      className="pointer-events-none fixed inset-x-4 top-24 z-70 flex justify-center sm:inset-x-auto sm:right-6 sm:top-24"
      enter="transform transition duration-300 ease-out"
      enterFrom="translate-y-3 opacity-0 sm:translate-y-0 sm:translate-x-4"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transform transition duration-200 ease-in"
      leaveFrom="translate-y-0 opacity-100 sm:translate-x-0"
      leaveTo="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
    >
      <div className="w-full max-w-sm rounded-2xl border border-accent/20 bg-accent/10 p-4 shadow-[0_20px_45px_rgba(0,0,0,0.35)] outline -outline-offset-1 outline-green-400/15 backdrop-blur-sm">
        <div className="flex items-start">
          <div className="shrink-0">
            <CheckCircleIcon aria-hidden="true" className="size-5 text-accent" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-accent">{message}</p>
          </div>
        </div>
      </div>
    </Transition>
  )
}
