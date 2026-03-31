import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function AlertDialogBox({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmButtonClassName = 'bg-red-500 hover:bg-red-400',
  icon: Icon = ExclamationTriangleIcon,
  iconWrapperClassName = 'bg-red-500/10',
  iconClassName = 'text-red-400',
}) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-60">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-card/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-60 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-card px-4 pt-5 pb-4 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="sm:flex sm:items-start">
              <div className={`mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10 ${iconWrapperClassName}`}>
                <Icon aria-hidden="true" className={`size-6 ${iconClassName}`} />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <DialogTitle as="h3" className="text-base font-semibold text-white">
                  {title}
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-400">{description}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={onConfirm}
                className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white sm:ml-3 sm:w-auto ${confirmButtonClassName}`}
              >
                {confirmLabel}
              </button>
              <button
                type="button"
                data-autofocus
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring-1 inset-ring-white/5 hover:bg-white/20 sm:mt-0 sm:w-auto"
              >
                {cancelLabel}
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
