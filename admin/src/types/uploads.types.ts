export type UploadedAssetStatus = 'TEMP' | 'ATTACHED' | 'DELETED'

export type UploadedAsset = {
  id: string
  path: string
  status: UploadedAssetStatus
  expiresAt: string | null
  createdAt?: string
  updatedAt?: string
}
