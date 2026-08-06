"use client";

import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignaturePadProps {
  onSave: (image: string) => void;
}

export default function SignaturePad({
  onSave,
}: SignaturePadProps) {
  const sigRef = useRef<SignatureCanvas>(null);

  const clear = () => {
    sigRef.current?.clear();
  };

  const save = () => {
    if (!sigRef.current || sigRef.current.isEmpty()) {
      alert("서명을 입력해주세요.");
      return;
    }

    const image = sigRef.current
      .getTrimmedCanvas()
      .toDataURL("image/png");

    onSave(image);
  };

  return (
    <div className="p-4">
      <SignatureCanvas
        ref={sigRef}
        penColor="black"
        canvasProps={{
          width: 500,
          height: 250,
          className: "border rounded-lg w-full",
        }}
      />

      <div className="mt-4 flex gap-2">
        <button
          onClick={clear}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          지우기
        </button>

        <button
          onClick={save}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          확인
        </button>
      </div>
    </div>
  );
}