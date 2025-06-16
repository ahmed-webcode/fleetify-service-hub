import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

// A simple file icon SVG to use inline without adding dependencies.
const FileIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
    </svg>
);

interface VehicleFileUploadsProps {
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleLibreUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    imageFile: File | null;
    libreFile: File | null;
    // Add props for existing file URLs
    initialImageUrl?: string | null;
    initialLibreUrl?: string | null;
}

export function VehicleFileUploads({
    handleImageUpload,
    handleLibreUpload,
    imageFile,
    libreFile,
    initialImageUrl,
    initialLibreUrl,
}: VehicleFileUploadsProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [librePreview, setLibrePreview] = useState<string | null>(null);

    // Effect to manage image preview URL.
    // It prioritizes the newly selected file, otherwise falls back to the initial URL.
    useEffect(() => {
        if (imageFile) {
            const objectUrl = URL.createObjectURL(imageFile);
            setImagePreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
        // If no new file, use the initial URL from the vehicle data
        setImagePreview(initialImageUrl || null);
    }, [imageFile, initialImageUrl]);

    // Effect to manage libre document preview URL.
    // It prioritizes the newly selected file, otherwise falls back to the initial URL.
    useEffect(() => {
        if (libreFile) {
            const objectUrl = URL.createObjectURL(libreFile);
            setLibrePreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
        // If no new file, use the initial URL from the vehicle data
        setLibrePreview(initialLibreUrl || null);
    }, [libreFile, initialLibreUrl]);

    const getFileName = (file: File | null, url: string | null): string => {
        if (file) {
            return file.name;
        }
        if (url) {
            // Extract filename from URL
            return url.substring(url.lastIndexOf('/') + 1);
        }
        return 'File';
    };
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            {/* Vehicle Image Upload */}
            <div className="space-y-2">
                <FormLabel htmlFor="vehicle-image">Vehicle Image</FormLabel>
                <Input
                    id="vehicle-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file:text-sm file:font-medium file:text-foreground hover:file:text-primary"
                />
                {imagePreview && (
                    <div className="mt-4">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Preview</p>
                        <img
                            src={imagePreview}
                            alt={getFileName(imageFile, initialImageUrl)}
                            className="h-24 w-42 rounded-lg border object-cover"
                        />
                    </div>
                )}
            </div>

            {/* Libre Document Upload */}
            <div className="space-y-2">
                <FormLabel htmlFor="libre-document" className="flex items-center">
                    Libre Document <span className="text-destructive ml-1">*</span>
                </FormLabel>
                <Input
                    id="libre-document"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleLibreUpload}
                    className="file:text-sm file:font-medium file:text-foreground hover:file:text-primary"
                    required={!librePreview} // Make it required only if no file exists
                />
                {librePreview && (
                    <div className="mt-4">
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                            {libreFile ? 'Selected File' : 'Current Document'}
                        </p>
                        <a
                            href={librePreview}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-lg border bg-background p-3 hover:bg-muted/50 transition-colors"
                        >
                            <FileIcon className="h-6 w-6 flex-shrink-0 text-muted-foreground" />
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-medium">
                                    {getFileName(libreFile, initialLibreUrl)}
                                </p>
                                {libreFile && ( // Only show size for new files, as we don't know it for existing URLs
                                    <p className="text-xs text-muted-foreground">
                                        {(libreFile.size / 1024).toFixed(1)} KB
                                    </p>
                                )}
                            </div>
                        </a>
                    </div>
                )}
                {!librePreview && ( // Show error if no initial file and no new file selected
                    <p className="text-sm text-destructive pt-1">This field is required.</p>
                )}
            </div>
        </div>
    );
}