'use client'

import { useState, useRef } from 'react'
import { Card, CardBody, Button } from '@/components/ui'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PhotoUploadProps {
  onUploadSuccess?: () => void
}

export function PhotoUpload({ onUploadSuccess }: PhotoUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [location, setLocation] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setSelectedFile(file)
    setError(null)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      const input = fileInputRef.current
      if (input) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        input.files = dataTransfer.files
        handleFileSelect({ target: input } as any)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('caption', caption)
      formData.append('location', location)

      const response = await fetch('/api/gallery/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      // Success!
      setIsOpen(false)
      resetForm()
      onUploadSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setPreview(null)
    setCaption('')
    setLocation('')
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    resetForm()
  }

  return (
    <>
      {/* Upload Button */}
      <Button
        variant="primary"
        size="lg"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <Upload className="w-5 h-5" />
        Share Your Memory
      </Button>

      {/* Upload Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <div
            className="max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-aspen-copper to-aspen-gold p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="heading-sm text-white">
                  Share Your Favorite Memory
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-white/90 mt-2 text-sm">
                Upload a photo of a special moment with Emily & Tyler
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* File Upload Area */}
              {!selectedFile ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className={cn(
                    'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                    'hover:border-aspen-copper hover:bg-aspen-cream/50',
                    'border-aspen-stone/30'
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="w-16 h-16 text-aspen-stone/40 mx-auto mb-4" />
                  <p className="body-text text-aspen-forest font-medium mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="body-sm text-aspen-stone">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Preview */}
                  <div className="relative rounded-lg overflow-hidden bg-aspen-stone/10">
                    <img
                      src={preview!}
                      alt="Preview"
                      className="w-full h-64 object-cover"
                    />
                    <button
                      onClick={resetForm}
                      className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Caption */}
                  <div>
                    <label className="block text-sm font-medium text-aspen-forest mb-2">
                      Caption (Optional)
                    </label>
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Tell us about this memory..."
                      maxLength={500}
                      rows={3}
                      className="w-full px-4 py-3 border border-aspen-stone/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-aspen-copper resize-none"
                    />
                    <p className="text-xs text-aspen-stone mt-1">
                      {caption.length}/500 characters
                    </p>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-aspen-forest mb-2">
                      Location (Optional)
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Where was this photo taken?"
                      maxLength={100}
                      className="w-full px-4 py-3 border border-aspen-stone/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-aspen-copper"
                    />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Info Message */}
              <div className="p-4 bg-aspen-sage/10 border border-aspen-sage/30 rounded-lg">
                <p className="text-sm text-aspen-forest">
                  <strong>Note:</strong> Your photo will be reviewed before appearing in the gallery.
                  Thank you for sharing your memories with us!
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className="gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Photo
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
