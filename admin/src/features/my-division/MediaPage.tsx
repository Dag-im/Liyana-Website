import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'

import { divisionsApi } from '@/api/divisions.api'
import { FileImage } from '@/components/shared/FileImage'
import { FileUpload } from '@/components/shared/FileUpload'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMyDivision, useUpdateMyDivision } from '@/features/my-division/useMyDivision'
import { showErrorToast } from '@/lib/error-utils'
import { useTempUploadSession } from '@/lib/temp-upload-session'

const MAX_GALLERY_IMAGES = 10

export default function MediaPage() {
  const { data: division, isLoading } = useMyDivision()
  const updateMutation = useUpdateMyDivision()
  const tempUploads = useTempUploadSession()

  const [logo, setLogo] = useState('')
  const [groupPhoto, setGroupPhoto] = useState('')
  const [gallery, setGallery] = useState<string[]>([])

  useEffect(() => {
    if (!division) return
    setLogo(division.logo ?? '')
    setGroupPhoto(division.groupPhoto ?? '')
    setGallery(division.images.map((image) => image.path))
  }, [division])

  if (isLoading) return <LoadingSpinner fullPage />

  const saveLogo = () => {
    updateMutation.mutate(
      { logo: logo || '' },
      {
        onSuccess: () => {
          tempUploads.clear()
          toast.success('Logo updated')
        },
        onError: (error) => showErrorToast(error, 'Failed to update logo'),
      },
    )
  }

  const saveGroupPhoto = () => {
    updateMutation.mutate(
      { groupPhoto: groupPhoto || '' },
      {
        onSuccess: () => {
          tempUploads.clear()
          toast.success('Group photo updated')
        },
        onError: (error) => showErrorToast(error, 'Failed to update group photo'),
      },
    )
  }

  const saveGallery = () => {
    updateMutation.mutate(
      {
        images: gallery.filter(Boolean).map((path) => ({ path })),
      },
      {
        onSuccess: () => {
          tempUploads.clear()
          toast.success('Gallery updated')
        },
        onError: (error) => showErrorToast(error, 'Failed to update gallery'),
      },
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Division Media"
        text="Manage logo, group photo, and gallery assets."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Logo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUpload
            onUpload={divisionsApi.uploadDivisionFile}
            onSuccess={setLogo}
            onUploadedAsset={tempUploads.registerUpload}
            currentPath={logo}
            label="Upload logo"
          />
          <div className="flex justify-end">
            <Button onClick={saveLogo} disabled={updateMutation.isPending}>
              Save Logo
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Group Photo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUpload
            onUpload={divisionsApi.uploadDivisionFile}
            onSuccess={setGroupPhoto}
            onUploadedAsset={tempUploads.registerUpload}
            currentPath={groupPhoto}
            label="Upload group photo"
          />
          <div className="flex justify-end">
            <Button onClick={saveGroupPhoto} disabled={updateMutation.isPending}>
              Save Group Photo
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gallery Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((path, index) => (
              <div key={`${path}-${index}`} className="space-y-2 rounded-lg border border-border/70 p-3">
                <div className="h-32 overflow-hidden rounded-md bg-muted">
                  <FileImage
                    path={path}
                    alt={`Gallery ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Image {index + 1}</span>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      void tempUploads.releaseUploadByPath(path, { silent: true })
                      setGallery((prev) => prev.filter((_, i) => i !== index))
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {gallery.length < MAX_GALLERY_IMAGES ? (
            <FileUpload
              onUpload={divisionsApi.uploadDivisionFile}
              onUploadedAsset={tempUploads.registerUpload}
              onSuccess={(path) => {
                setGallery((prev) => {
                  if (prev.length >= MAX_GALLERY_IMAGES) return prev
                  return [...prev, path]
                })
              }}
              label="Upload gallery image"
              showPreview={false}
            />
          ) : null}

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {gallery.length}/{MAX_GALLERY_IMAGES} images
            </p>
            <Button onClick={saveGallery} disabled={updateMutation.isPending}>
              Save Gallery
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
