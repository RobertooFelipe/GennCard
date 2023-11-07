"use client";

import {
  MultiFileDropzone,
  type FileState,
} from "@/app/components/MultipleImagesDropzone";
import { useEdgeStore } from "@/app/lib/edgestore";
import { useEffect, useState } from "react";

export default function ProtectUploadPage() {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const { edgestore } = useEdgeStore();

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  useEffect(() => {
    console.log("Updated URLs:", urls);
  }, [urls]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-2">
      <MultiFileDropzone
        value={fileStates}
        onChange={(files) => {
          setFileStates(files);
        }}
        onFilesAdded={async (addedFiles) => {
          setFileStates([...fileStates, ...addedFiles]);
          await Promise.all(
            addedFiles.map(async (addedFileState) => {
              try {
                const res = await edgestore.myProtectFiles.upload({
                  file: addedFileState.file,
                  options: {
                    temporary: true,
                  },
                  onProgressChange: async (progress) => {
                    updateFileProgress(addedFileState.key, progress);
                    if (progress === 100) {
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      updateFileProgress(addedFileState.key, "COMPLETE");
                    }
                  },
                });
                setUrls((prevUrls) => [...prevUrls, res.url]);
                console.log(res.url);
              } catch (err) {
                updateFileProgress(addedFileState.key, "ERROR");
              }
            })
          );
        }}
      />

      <button
        className="bg-white text-black rounded px-3 py-1 hover:opacity-80"
        onClick={async () => {
          for (const url of urls) {
            await edgestore.myProtectFiles.confirmUpload({
              url,
            });
          }
        }}
      >
        Confirm
      </button>
    </div>
  );
}
