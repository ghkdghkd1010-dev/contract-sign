"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function CreateContractPage() {

  const router = useRouter();

  const [company, setCompany] = useState("");
  const [contractor, setContractor] = useState("");
  const [contractText, setContractText] = useState("");

  const createContract = async () => {

    const { data, error } = await supabase
      .from("contract")
      .insert({
        company,
        contractor,
        contract_text: contractText,
        status: "pending",
      })
      .select()
      .single();


    if(error){
      alert(error.message);
      return;
    }


    router.push(`/contract/${data.id}`);

  };


  return (

    <main className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-3xl mx-auto bg-white p-10 rounded-xl shadow">


        <h1 className="text-3xl font-bold mb-8">
          계약 생성
        </h1>


        <input
          className="border p-3 w-full mb-4"
          placeholder="회사명"
          value={company}
          onChange={(e)=>setCompany(e.target.value)}
        />


        <input
          className="border p-3 w-full mb-4"
          placeholder="계약자"
          value={contractor}
          onChange={(e)=>setContractor(e.target.value)}
        />


        <textarea
          className="border p-3 w-full h-60 mb-4"
          placeholder="계약 내용"
          value={contractText}
          onChange={(e)=>setContractText(e.target.value)}
        />


        <button
          onClick={createContract}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg"
        >
          계약 생성
        </button>


      </div>

    </main>

  );
}