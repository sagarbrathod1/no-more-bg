import React from "react";

export function Footer() {
  return (
    <footer className="mt-8 pb-4">
      <div className="flex justify-center mb-8 gap-8">
        <a
          className="underline"
          target="_blank"
          href="https://github.com/huggingface/transformers.js-examples/blob/main/LICENSE"
        >
          License (Apache 2.0)
        </a>
        <a
          className="underline"
          target="_blank"
          href="https://huggingface.co/Xenova/modnet"
        >
          Model (MODNet)
        </a>
        <a
          className="underline"
          target="_blank"
          href="https://github.com/huggingface/transformers.js-examples/tree/main/remove-background-webgpu/"
        >
          Code (GitHub)
        </a>
      </div>
    </footer>
  );
}
