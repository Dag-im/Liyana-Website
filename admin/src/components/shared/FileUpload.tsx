import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { showErrorToast } from '@/lib/error-utils';
import { FileIcon, Loader2, Upload, X } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import { FileImage } from '@/components/shared/FileImage';
import { deleteTempUpload } from '@/api/uploads.api';
import type { UploadedAsset } from '@/types/uploads.types';

type FileUploadProps = {
  onUpload: (file: File) => Promise<UploadedAsset>;
  onSuccess: (path: string) => void;
  onUploadedAsset?: (asset: UploadedAsset) => void;
  onAssetRemoved?: (asset: UploadedAsset) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  currentPath?: string;
  multiple?: boolean;
  /**
   * Whether to show an inline preview inside the dropzone.
   * For gallery-style multi uploads, you can hide this and
   * render previews from the parent list instead.
   */
  showPreview?: boolean;
};

export function FileUpload({
  onUpload,
  onSuccess,
  onUploadedAsset,
  onAssetRemoved,
  accept = 'image/*',
  maxSizeMB = 5,
  label = 'Click to upload or drag and drop',
  currentPath,
  multiple = false,
  showPreview,
}: FileUploadProps) {
  const shouldShowPreview = showPreview ?? !multiple;
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    shouldShowPreview && currentPath ? currentPath : null
  );
  const [currentUpload, setCurrentUpload] = useState<UploadedAsset | null>(null);
  const uploadedAssetsRef = useRef(new Map<string, UploadedAsset>());

  React.useEffect(() => {
    if (!shouldShowPreview) return;
    setPreview(currentPath || null);
  }, [currentPath, shouldShowPreview]);

  React.useEffect(() => {
    if (!currentPath) {
      setCurrentUpload(null);
    }
  }, [currentPath]);

  React.useEffect(() => {
    return () => {
      const assets = [...uploadedAssetsRef.current.values()];
      uploadedAssetsRef.current.clear();

      assets.forEach((asset) => {
        void deleteTempUpload(asset.id).catch(() => undefined);
      });
    };
  }, []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`File size exceeds ${maxSizeMB}MB limit`);
        return;
      }

      setIsUploading(true);
      try {
        const result = await onUpload(file);
        const previousUpload = currentUpload;

        onSuccess(result.path);
        onUploadedAsset?.(result);
        uploadedAssetsRef.current.set(result.id, result);
        if (shouldShowPreview) {
          setCurrentUpload(result);
        }

        if (file.type.startsWith('image/')) {
          if (shouldShowPreview) {
            setPreview(result.path);
          }
        } else {
          setPreview(null);
        }

        if (previousUpload && previousUpload.id !== result.id) {
          try {
            await deleteTempUpload(previousUpload.id);
            uploadedAssetsRef.current.delete(previousUpload.id);
            onAssetRemoved?.(previousUpload);
          } catch {
            // Ignore cleanup failures here; expiry-based cleanup is the fallback.
          }
        }

        toast.success('File uploaded successfully');
      } catch (error) {
        showErrorToast(error, 'Upload failed');
      } finally {
        setIsUploading(false);
      }
    },
    [
      currentUpload,
      maxSizeMB,
      onAssetRemoved,
      onUpload,
      onSuccess,
      onUploadedAsset,
      shouldShowPreview,
    ]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files || []);
      if (!files.length) return;
      if (multiple) {
        files.forEach((file) => handleFile(file));
      } else {
        handleFile(files[0]);
      }
    },
    [handleFile, multiple]
  );

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (multiple) {
      files.forEach((file) => handleFile(file));
    } else {
      handleFile(files[0]);
    }
  };

  const removeFile = async () => {
    const uploadToRemove = currentUpload;

    if (uploadToRemove) {
      try {
        await deleteTempUpload(uploadToRemove.id);
        uploadedAssetsRef.current.delete(uploadToRemove.id);
        onAssetRemoved?.(uploadToRemove);
      } catch {
        // The file may already be attached or already gone. Clear the field anyway.
      }
    }

    setCurrentUpload(null);
    setPreview(null);
    onSuccess('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className={cn(
          'relative flex flex-col items-center justify-center w-full min-h-37.5 border-2 border-dashed rounded-lg transition-colors',
          isUploading
            ? 'bg-muted/50 border-muted'
            : 'bg-background hover:bg-muted/30 border-muted-foreground/30',
          preview ? 'border-primary/50' : ''
        )}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-sm font-medium">Uploading...</span>
          </div>
        ) : shouldShowPreview && preview ? (
          <div className="relative w-full h-full p-4 flex flex-col items-center justify-center">
            {preview ? (
              <FileImage
                path={preview}
                alt="Preview"
                className="max-h-30 rounded object-contain mb-2"
                fallback={<FileIcon className="w-12 h-12 text-muted-foreground mb-2" />}
              />
            ) : (
              <FileIcon className="w-12 h-12 text-muted-foreground mb-2" />
            )}
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7"
              onClick={() => {
                void removeFile();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground truncate max-w-50">
              {preview.split('/').pop()}
            </span>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-2 p-6 cursor-pointer w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="p-3 rounded-full bg-primary/10">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Max size {maxSizeMB}MB
              </p>
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onFileSelect}
        />
      </div>
    </div>
  );
}
