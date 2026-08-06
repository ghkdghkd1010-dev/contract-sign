"use client";

interface ContractViewProps {
  company: string;
  contractor: string;
  contractText: string;
  signature: string;
  completed: boolean;
  onSign: () => void;
  onComplete: () => void;
}

export default function ContractView({
  company,
  contractor,
  contractText,
  signature,
  completed,
  onSign,
  onComplete,
}: ContractViewProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-10">

      <h1 className="text-4xl font-bold mb-10">
        계약서
      </h1>

      <div className="mb-8">
        <p className="text-lg">
          <b>회사명 :</b> {company}
        </p>

        <p className="text-lg mt-2">
          <b>계약자 :</b> {contractor}
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">
        계약 내용
      </h2>

      <div className="border rounded-lg p-6 whitespace-pre-wrap leading-8 mb-16">
        {contractText}
      </div>

      <hr className="my-10" />

      <div className="flex justify-end items-center gap-6">

        <div className="text-xl font-bold">
          서명
        </div>

        <div className="w-72 h-40 border rounded-lg flex items-center justify-center bg-white overflow-hidden">

          {signature ? (
            <img
              src={signature}
              alt="서명"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <span className="text-gray-400">
              서명란
            </span>
          )}

        </div>

      </div>

      <div className="flex justify-end gap-3 mt-8">

        {completed ? (

          <button
            disabled
            className="bg-gray-400 text-white px-8 py-3 rounded-lg cursor-not-allowed"
          >
            계약 완료
          </button>

        ) : !signature ? (

          <button
            onClick={onSign}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
          >
            서명하기
          </button>

        ) : (

          <button
            onClick={onComplete}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700"
          >
            확인
          </button>

        )}

      </div>

    </div>
  );
}