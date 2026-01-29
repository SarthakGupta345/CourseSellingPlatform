"use client";

import { PlusCircle } from "lucide-react";
import React, { useRef, useState } from "react";

const FileUpload = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  return (
    <div className="mt-10 flex justify-center">
      <div
        onClick={() => fileRef.current?.click()}
        className="cursor-pointer border border-neutral-300 px-20 py-8 text-center hover:border-neutral-500 transition"
      >
        {selectedFile ? (
          <p className="text-base font-semibold text-neutral-800">
            {selectedFile.name}
          </p>
        ) : (
          <>
            <PlusCircle className="mx-auto mb-4 h-16 w-16 text-neutral-600" />

            <p className="text-base font-medium text-neutral-800">
              Upload file or drag and drop
            </p>

            <p className="mt-1 text-sm text-neutral-500">
              PDF, DOC, or image files
            </p>
          </>
        )}

        {/* Hidden input */}
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default FileUpload;
