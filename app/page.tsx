import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center">

        <h1 className="text-3xl font-bold mb-8">
          전자계약 서비스
        </h1>

        <div className="flex flex-col gap-4">

          <Link
            href="/admin"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg"
          >
            계약 생성
          </Link>

          <Link
            href="/sign/1"
            className="bg-green-600 text-white px-8 py-4 rounded-lg"
          >
            테스트 계약
          </Link>

        </div>

      </div>
    </main>
  );
}