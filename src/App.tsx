import {
  AutoModel,
  AutoProcessor,
  env,
  PreTrainedModel,
  Processor,
} from "@huggingface/transformers";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { db } from "./db";
import { processImages } from "./lib/process";
import React from "react";
import { Images } from "./components/Images";

export default function App() {
  const [images] = useState([]);
  const [processedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const modelRef = useRef<PreTrainedModel | null>(null);
  const processorRef = useRef<Processor | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(navigator as any).gpu) {
          throw new Error("WebGPU is not supported in this browser.");
        }
        const model_id = "Xenova/modnet";
        env.backends.onnx.wasm!.proxy = false;
        if (!modelRef.current) {
          modelRef.current = await AutoModel.from_pretrained(model_id, {
            device: "webgpu",
          });
        }
        if (!processorRef.current) {
          processorRef.current = await AutoProcessor.from_pretrained(model_id);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      }
      setIsLoading(false);
    })();
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const id = await db.images.add({ file, processedFile: "null" });
      console.log(`Added image with id ${id}`);
    }
    await processImages();
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".mp4"],
    },
  });

  const downloadImage = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl mb-2">ERROR</h2>
          <p className="text-xl max-w-[500px]">{error.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mb-4"></div>
          <p className="text-lg">Loading background removal model...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center">No More BG</h1>
        <h2 className="text-lg font-semibold mb-2 text-center">
          Client-side background removal, powered by{" "}
          <a
            className="underline"
            target="_blank"
            href="https://github.com/xenova/transformers.js"
          >
            🤗 Transformers.js
          </a>
        </h2>
        <div
          {...getRootProps()}
          className={`p-8 mb-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-300 ease-in-out
            ${isDragAccept ? "border-green-500 bg-green-900/20" : ""}
            ${isDragReject ? "border-red-500 bg-red-900/20" : ""}
            ${
              isDragActive
                ? "border-blue-500 bg-blue-900/20"
                : "border-gray-700 hover:border-blue-500 hover:bg-blue-900/10"
            }
          `}
        >
          <input {...getInputProps()} className="hidden" />
          <p className="text-lg mb-2">
            {isDragActive
              ? "Drop the images here..."
              : "Drag and drop some images here"}
          </p>
          <p className="text-sm text-gray-400">or click to select files</p>
        </div>
        <Images />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((src, index) => (
            <div key={index} className="relative group">
              <img
                src={processedImages[index] || src}
                alt={`Image ${index + 1}`}
                className="rounded-lg object-cover w-full h-48"
              />
              {processedImages[index] && (
                <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                  <button
                    onClick={() => downloadImage(processedImages[index] || src)}
                    className="mx-2 px-3 py-1 bg-white text-gray-900 rounded-md hover:bg-gray-200 transition-colors duration-200 text-sm"
                    aria-label={`Download image ${index + 1}`}
                  >
                    Download
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
