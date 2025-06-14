
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface VehicleFileUploadsProps {
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleLibreUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    imageFile: File | null;
    libreFile: File | null;
}

export function VehicleFileUploads({
    handleImageUpload,
    handleLibreUpload,
    imageFile,
    libreFile,
}: VehicleFileUploadsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
                <FormLabel>Vehicle Image</FormLabel>
                <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                />
                {imageFile && (
                    <p className="text-sm text-muted-foreground">
                        Selected: {imageFile.name}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <FormLabel className="flex items-center">
                    Libre Document <span className="text-destructive ml-1">*</span>
                </FormLabel>
                <Input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleLibreUpload}
                    className="cursor-pointer"
                    required
                />
                {libreFile && (
                    <p className="text-sm text-muted-foreground">
                        Selected: {libreFile.name}
                    </p>
                )}
                {!libreFile && (
                    <p className="text-sm text-destructive">This field is required</p>
                )}
            </div>
        </div>
    );
}
