import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FileIcon, Loader2, Upload, X } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

type FileUploadProps = {
  onUpload: (file: File) => Promise<{ url: string }>;
  onSuccess: (path: string) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  currentPath?: string;
  multiple?: false;
};

export function FileUpload({
  onUpload,
  onSuccess,
  accept = 'image/*',
  maxSizeMB = 5,
  label = 'Click to upload or drag and drop',
  currentPath,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentPath || null);
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
        onSuccess(result.url);

        if (file.type.startsWith('image/')) {
          setPreview(URL.createObjectURL(file));
        } else {
          setPreview(null);
        }

        toast.success('File uploaded successfully');
      } catch (error: any) {
        toast.error(error.message || 'Upload failed');
      } finally {
        setIsUploading(false);
      }
    },
    [maxSizeMB, onUpload, onSuccess]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const removeFile = () => {
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
        ) : preview ? (
          <div className="relative w-full h-full p-4 flex flex-col items-center justify-center">
            {preview.startsWith('http') ||
            preview.startsWith('/') ||
            preview.startsWith('blob:') ? (
              <img
                src={preview}
                alt="Preview"
                className="max-h-30 rounded object-contain mb-2"
              />
            ) : (
              <FileIcon className="w-12 h-12 text-muted-foreground mb-2" />
            )}
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7"
              onClick={removeFile}
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
