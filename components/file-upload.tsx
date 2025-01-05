"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import toast from "react-hot-toast";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({
  onChange,
  endpoint,
}: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (res) {
          onChange(res[0]?.url);
          toast.success("File uploaded successfully!");
        }
      }}
      onUploadError={(error: Error) => {
        toast.error(`Upload failed: ${error?.message}`);
      }}
    />
  );
};
