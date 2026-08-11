"use client";

import { useState } from "react";
import SignatureModal from "@/components/SignatureModal";

export default function SignPage({
  params,
}: {
  params: { id: string };
}) {
  const [step, setStep] = useState<"intro" | "contract">("intro");

  const [signature, setSignature] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded-xl shadow text-center">

          <h1 className="text-4xl font-bold text-green-600">
            서명이 완료되었습니다.
          </h1>

          <p className="mt-6">
            전자계약이 정상적으로 제출되었습니다.
          </p>

        </div>
      </div>
    );
  }

  // ===== 첫 화면 =====

  if (step === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="bg-white rounded-xl shadow p-10 max-w-xl w-full">

          <h1 className="text-4xl font-bold mb-8">
            📄 전자계약 요청
          </h1>

          <p className="leading-8 text-lg">
            안녕하세요.
            <br />
            아래 버튼을 눌러 계약 내용을 확인한 후
            전자서명을 진행해주세요.
          </p>

          <button
            onClick={() => setStep("contract")}
            className="mt-10 w-full bg-blue-600 text-white rounded-lg py-4 text-xl"
          >
            서명하기
          </button>

        </div>

      </div>
    );
  }

  // ===== 계약서 =====

  return (
    <>
      <div className="max-w-4xl mx-auto p-10">

        <h1 className="text-5xl font-bold mb-10">
          전자 계약서
        </h1>

        <p className="mb-10">
          계약번호 : {params.id}
        </p>

        <hr className="mb-10" />

        <h2 className="text-3xl font-bold mb-6">
          계약 내용
        </h2>

        <p className="leading-10 text-xl">
          본 계약은 갑과 을이 상호 합의하여 체결하는 계약입니다.
          <br />
          계약 내용은 추후 Supabase에서 불러오게 됩니다.
          <br />
          <br />
          계약 조항...
          <br />
          계약 조항...
          <br />
          계약 조항...
          <br />
          계약 조항...
        </p>

        <div className="mt-20">

          <h2 className="text-3xl font-bold mb-4">
            서명
          </h2>

          <div className="border h-52 flex items-center justify-center">

            {signature ? (
              <img
                src={signature}
                className="h-full"
                alt="서명"
              />
            ) : (
              <span className="text-gray-400">
                아직 서명되지 않았습니다.
              </span>
            )}

          </div>

        </div>

        {!signature ? (
          <button
            onClick={() => setOpen(true)}
            className="w-full mt-10 bg-blue-600 text-white rounded-lg py-4 text-2xl"
          >
            서명하기
          </button>
        ) : (
          <button
            onClick={() => setCompleted(true)}
            className="w-full mt-10 bg-green-600 text-white rounded-lg py-4 text-2xl"
          >
            제출하기
          </button>
        )}

      </div>

      <SignatureModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={(img) => {
          setSignature(img);
          setOpen(false);
        }}
      />
    </>
  );
}