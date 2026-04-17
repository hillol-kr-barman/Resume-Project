import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ClipboardDocumentIcon, LinkIcon } from '@heroicons/react/24/outline'

export default function ShareDocumentModal({ open, onClose, shareUrl = '' }) {
  const [copyNotice, setCopyNotice] = useState('')

  const handleClose = () => {
    setCopyNotice('')
    onClose()
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopyNotice('Link copied to clipboard.')
    } catch {
      setCopyNotice('Could not copy automatically. You can still copy the link below.')
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-60">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-card/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-60 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative w-full max-w-xl transform overflow-hidden rounded-2xl bg-card p-5 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <LinkIcon aria-hidden="true" className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle as="h3" className="text-base font-semibold text-white">
                  Share This Snippet
                </DialogTitle>
                <p className="mt-2 text-sm/7 text-body">
                  Anyone with this link can open the snippet in the playground.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-3">
              <label htmlFor="share-link" className="block text-xs font-medium uppercase tracking-[0.18em] text-body">
                Share link
              </label>
              <input
                id="share-link"
                readOnly
                value={shareUrl}
                className="mt-2 block w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white outline-1 -outline-offset-1 outline-white/10"
              />
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex justify-center rounded-md bg-white/10 px-4 py-2.5 text-sm font-semibold text-white inset-ring-1 inset-ring-white/5 hover:bg-white/20"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-black shadow-none transition-shadow duration-300 hover:shadow-[0_0_22px_rgba(158,255,31,0.55)]"
              >
                <ClipboardDocumentIcon aria-hidden="true" className="size-4" />
                Copy link
              </button>
            </div>

            {copyNotice ? (
              <p className="mt-3 text-sm text-body">{copyNotice}</p>
            ) : null}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
