"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [company, setCompany] = useState("");
  const [contractor, setContractor] = useState("");
  const [contractText, setContractText] = useState("");

  const createContract = async () => {
    if (!company || !contractor || !contractText) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const { data, error } = await supabase
      .from("contract")
      .insert([
        {
          company,
          contractor,
          contract_text: contractText,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    const url = `${window.location.origin}/contract/${data.id}`;

    alert(`계약이 생성되었습니다.\n\n${url}`);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center p-10">

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-3xl">

        <h1 className="text-3xl font-bold mb-8">
          계약 생성
        </h1>

        <input
          className="w-full border rounded-lg p-3 mb-4"
          placeholder="회사명"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <input
          className="w-full border rounded-lg p-3 mb-4"
          placeholder="계약자 이름"
          value={contractor}
          onChange={(e) => setContractor(e.target.value)}
        />

        <textarea
          className="w-full border rounded-lg p-3 h-80 mb-6"
          placeholder="계약 내용을 입력하세요."
          value={contractText}
          onChange={(e) => setContractText(e.target.value)}
        />

        <button
          onClick={createContract}
          className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg hover:bg-blue-700"
        >
          계약 생성
        </button>

      </div>

    </main>
  );
}