import { useCallback, useEffect, useRef } from 'react'

import { deleteTempUpload } from '@/api/uploads.api'
import { showErrorToast } from '@/lib/error-utils'
import type { UploadedAsset } from '@/types/uploads.types'

type ReleaseOptions = {
  silent?: boolean
}

export function useTempUploadSession() {
  const uploadsRef = useRef(new Map<string, UploadedAsset>())

  const registerUpload = useCallback((asset: UploadedAsset) => {
    uploadsRef.current.set(asset.id, asset)
  }, [])

  const forgetUpload = useCallback((id: string) => {
    uploadsRef.current.delete(id)
  }, [])

  const releaseUpload = useCallback(
    async (assetOrId: UploadedAsset | string | null | undefined, options?: ReleaseOptions) => {
      if (!assetOrId) return

      const asset =
        typeof assetOrId === 'string'
          ? uploadsRef.current.get(assetOrId)
          : assetOrId

      const assetId = typeof assetOrId === 'string' ? assetOrId : assetOrId.id
      uploadsRef.current.delete(assetId)

      if (!asset) {
        return
      }

      try {
        await deleteTempUpload(asset.id)
      } catch (error) {
        if (!options?.silent) {
          showErrorToast(error, 'Failed to delete temporary upload')
        }
      }
    },
    [],
  )

  const releaseUploadByPath = useCallback(
    async (path: string | null | undefined, options?: ReleaseOptions) => {
      if (!path) return

      const asset = [...uploadsRef.current.values()].find((item) => item.path === path)
      if (!asset) {
        return
      }

      await releaseUpload(asset, options)
    },
    [releaseUpload],
  )

  const releaseAll = useCallback(
    async (options?: ReleaseOptions) => {
      const assets = [...uploadsRef.current.values()]
      uploadsRef.current.clear()

      await Promise.allSettled(
        assets.map(async (asset) => {
          try {
            await deleteTempUpload(asset.id)
          } catch (error) {
            if (!options?.silent) {
              showErrorToast(error, 'Failed to delete temporary upload')
            }
          }
        }),
      )
    },
    [],
  )

  const clear = useCallback(() => {
    uploadsRef.current.clear()
  }, [])

  useEffect(() => {
    return () => {
      const assets = [...uploadsRef.current.values()]
      uploadsRef.current.clear()

      assets.forEach((asset) => {
        void deleteTempUpload(asset.id).catch(() => undefined)
      })
    }
  }, [])

  return {
    registerUpload,
    forgetUpload,
    releaseUpload,
    releaseUploadByPath,
    releaseAll,
    clear,
  }
}
