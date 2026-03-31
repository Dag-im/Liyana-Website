import { useState } from 'react'
import { Link } from 'react-router-dom'

import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import PublishToggle from '@/components/shared/PublishToggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  useIrContact,
  usePublishIrContact,
  useUnpublishIrContact,
  useUpdateIrContact,
} from '../useIr'

export default function IrContactPage() {
  const contactQuery = useIrContact()
  const updateContact = useUpdateIrContact()
  const publishContact = usePublishIrContact()
  const unpublishContact = useUnpublishIrContact()

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading="IR Contact"
        text="Investor contact details now live on a dedicated page."
        items={[
          { label: 'Investor Relations', to: '/ir-admin' },
          { label: 'Contact' },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link to="/ir-admin">Back to Overview</Link>
          </Button>
        }
      />

      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <IrContactForm
            key={contactQuery.data?.updatedAt ?? 'ir-contact-form'}
            initialEmail={contactQuery.data?.email ?? ''}
            initialPhone={contactQuery.data?.phone ?? ''}
            initialAddress={contactQuery.data?.address ?? ''}
            initialDescription={contactQuery.data?.description ?? ''}
            isPublished={contactQuery.data?.isPublished ?? false}
            isSaving={updateContact.isPending}
            isToggling={publishContact.isPending || unpublishContact.isPending}
            onPublish={() => publishContact.mutate()}
            onUnpublish={() => unpublishContact.mutate()}
            onSave={(formData) =>
              updateContact.mutate({
                email: formData.email,
                phone: formData.phone || undefined,
                address: formData.address || undefined,
                description: formData.description || undefined,
              })
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}

function IrContactForm({
  initialEmail,
  initialPhone,
  initialAddress,
  initialDescription,
  isPublished,
  isSaving,
  isToggling,
  onPublish,
  onUnpublish,
  onSave,
}: {
  initialEmail: string
  initialPhone: string
  initialAddress: string
  initialDescription: string
  isPublished: boolean
  isSaving: boolean
  isToggling: boolean
  onPublish: () => void
  onUnpublish: () => void
  onSave: (value: {
    email: string
    phone: string
    address: string
    description: string
  }) => void
}) {
  const [formData, setFormData] = useState({
    email: initialEmail,
    phone: initialPhone,
    address: initialAddress,
    description: initialDescription,
  })

  return (
    <>
      <PublishToggle
        isPending={isToggling}
        isPublished={isPublished}
        label="Contact Publish Status"
        onPublish={onPublish}
        onUnpublish={onUnpublish}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ir-contact-email-page">Email</Label>
          <Input
            id="ir-contact-email-page"
            value={formData.email}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, email: event.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ir-contact-phone-page">Phone</Label>
          <Input
            id="ir-contact-phone-page"
            value={formData.phone}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, phone: event.target.value }))
            }
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="ir-contact-address-page">Address</Label>
        <Input
          id="ir-contact-address-page"
          value={formData.address}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, address: event.target.value }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ir-contact-description-page">Description</Label>
        <Textarea
          id="ir-contact-description-page"
          rows={5}
          value={formData.description}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, description: event.target.value }))
          }
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button asChild type="button" variant="outline">
          <Link to="/ir-admin">Cancel</Link>
        </Button>
        <Button disabled={isSaving} onClick={() => onSave(formData)}>
          {isSaving ? 'Saving...' : 'Save Contact'}
        </Button>
      </div>
    </>
  )
}
