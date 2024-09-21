import { useLiveQuery } from "dexie-react-hooks";
import { db, Image } from "../db";
import React from "react";

export function Images() {
  const images = useLiveQuery(() => db.images.reverse().toArray());

  return (
    <div>
      <h2>Images: {images?.length}</h2>
      <div className="gap-2 grid grid-cols-4">
        {images?.map((image) => {
          return <ImageSpot image={image} key={image.id} />;
        })}
      </div>
    </div>
  );
}

function ImageSpot({ image }: { image: Image }) {
  const imageProcessed = image.processedFile instanceof File;
  const url = URL.createObjectURL(image.file);
  const processedURL =
    imageProcessed && image.processedFile instanceof File
      ? URL.createObjectURL(image.processedFile)
      : "";

  return (
    <div>
      <div key={image.id} className="grid gap-2">
        <img
          className="rounded-lg h w-full aspect-square object-cover col-start-1 row-start-1"
          src={url}
          alt={image.name}
        />
        <img
          className={`rounded-lg h w-full bg-checkered aspect-square object-cover col-start-1 row-start-1 mask ${
            imageProcessed ? "" : "processing"
          }`}
          src={processedURL}
        />
      </div>
      <div className="controls">
        <button onClick={() => db.images.delete(image.id)}>Delete</button>
        <a
          href={processedURL}
          download={
            image.processedFile instanceof File
              ? image.processedFile.name
              : undefined
          }
        >
          Download
        </a>
      </div>
    </div>
  );
}
