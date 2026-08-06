"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function SignPage() {
  const { id } = useParams();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-lg w-full text-center">

        <h1 className="text-3xl font-bold mb-6">
          전자계약서
        </h1>

        <p className="text-lg mb-3">
          전자계약서가 도착했습니다.
        </p>

        <p className="text-gray-500 mb-10">
          계약 내용을 확인한 후 서명을 진행해주세요.
        </p>

        <Link
          href={`/contract/${id}`}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg text-lg font-semibold"
        >
          서명하기
        </Link>

      </div>
    </main>
  );
}