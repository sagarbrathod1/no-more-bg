import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function App() {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setImages((prevImages) => [
      ...prevImages,
      ...acceptedFiles.map((file) => URL.createObjectURL(file)),
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <h1>Remove Background WebGPU</h1>
      {error && <p>Error: {error.message}</p>}
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the images here ...</p>
        ) : (
          <p>Drag 'n' drop some images here, or click to select files</p>
        )}
      </div>
    </div>
  );
}
