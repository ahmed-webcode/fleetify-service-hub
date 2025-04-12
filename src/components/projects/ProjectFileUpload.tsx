
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUp, X, File as FileIcon } from "lucide-react";

interface ProjectFileUploadProps {
  onFilesChange: (files: File[]) => void;
}

export function ProjectFileUpload({ onFilesChange }: ProjectFileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => {
        const updated = [...prev, ...newFiles];
        onFilesChange(updated);
        return updated;
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => {
        const updated = [...prev, ...newFiles];
        onFilesChange(updated);
        return updated;
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const updated = prev.filter((_, i) => i !== index);
      onFilesChange(updated);
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer
          ${dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FileUp className="h-10 w-10 text-muted-foreground mb-4" />
        <p className="text-sm text-center mb-2">
          <span className="font-medium">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-muted-foreground text-center">
          PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG or ZIP (max 10MB)
        </p>
        <Input 
          id="file-upload" 
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <Button 
          variant="outline" 
          onClick={() => document.getElementById('file-upload')?.click()}
          className="mt-4"
        >
          Select Files
        </Button>
      </div>

      {files.length > 0 && (
        <div className="border rounded-md p-4">
          <h4 className="text-sm font-medium mb-2">Attached Files</h4>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-muted/50 rounded-md p-2 text-sm">
                <div className="flex items-center gap-2 truncate">
                  <FileIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round(file.size / 1024)} KB)
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
