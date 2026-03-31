'use client'

import { submitLucsInquiry } from '@/lib/api/lucs.api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

export default function LucsInquiryForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setStatus('submitting')
    setError(null)

    try {
      await submitLucsInquiry({
        name: String(formData.get('name') ?? ''),
        email: String(formData.get('email') ?? ''),
        message: String(formData.get('message') ?? ''),
      })
      setStatus('success')
    } catch (submitError) {
      setStatus('idle')
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Unable to send your inquiry right now.'
      )
    }
  }

  return (
    <div className="border border-slate-200 bg-white p-8 shadow-sm">
      {status === 'success' ? (
        <div className="space-y-3 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0880b9]">
            Inquiry Received
          </p>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
            Thank you for reaching out
          </h3>
          <p className="text-sm leading-relaxed text-slate-600">
            Our LUCS team will review your message and get back to you shortly.
          </p>
        </div>
      ) : (
        <form action={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500" htmlFor="lucs-name">
              Name
            </label>
            <Input id="lucs-name" name="name" required className="h-12 border-slate-200 bg-slate-50" />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500" htmlFor="lucs-email">
              Email
            </label>
            <Input id="lucs-email" name="email" type="email" required className="h-12 border-slate-200 bg-slate-50" />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500" htmlFor="lucs-message">
              Message
            </label>
            <Textarea id="lucs-message" name="message" required className="min-h-36 border-slate-200 bg-slate-50" />
          </div>
          <Button
            type="submit"
            disabled={status === 'submitting'}
            className="h-12 w-full bg-[#0880b9] text-sm font-semibold uppercase tracking-[0.18em] text-white hover:bg-[#01649c]"
          >
            {status === 'submitting' ? 'Sending...' : 'Submit Inquiry'}
          </Button>
          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
        </form>
      )}
    </div>
  )
}
