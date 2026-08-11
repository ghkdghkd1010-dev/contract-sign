"use client";

import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

type SignaturePadProps = {
  onSave: (image: string) => void;
};

export default function SignaturePad({
  onSave,
}: SignaturePadProps) {
  const signatureRef = useRef<SignatureCanvas | null>(null);

  const handleClear = () => {
    signatureRef.current?.clear();
  };

  const handleSave = () => {
    if (!signatureRef.current) return;

    if (signatureRef.current.isEmpty()) {
      alert("서명을 입력해주세요.");
      return;
    }

    const image = signatureRef.current
      .getTrimmedCanvas()
      .toDataURL("image/png");

    onSave(image);
  };

  return (
    <div>

      {/* 서명 영역 */}
      <div className="overflow-hidden rounded-lg border border-[#cbd5e1] bg-white">

        <div className="border-b border-[#e2e8f0] bg-[#f8fafc] px-4 py-3">
          <span className="text-[12px] font-medium text-[#64748b]">
            서명 입력
          </span>
        </div>

        <div className="p-3">

          <div className="overflow-hidden border border-dashed border-[#94a3b8] bg-white">

            <SignatureCanvas
              ref={signatureRef}
              penColor="#111827"
              canvasProps={{
                width: 500,
                height: 230,
                className: "w-full h-[230px]",
              }}
            />

          </div>

        </div>

      </div>


      {/* 버튼 */}
      <div className="mt-4 flex justify-between gap-3">

        <button
          type="button"
          onClick={handleClear}
          className="rounded-md border border-[#cbd5e1] px-5 py-3 text-[13px] font-medium text-[#475569] hover:bg-[#f8fafc]"
        >
          다시 작성
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="flex-1 rounded-md bg-[#18283f] px-5 py-3 text-[13px] font-semibold text-white hover:bg-[#263a57]"
        >
          서명 저장
        </button>

      </div>

    </div>
  );
}