"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

import ContractView from "@/components/ContractView";
import SignatureModal from "@/components/SignatureModal";

type ContractData = {
  id: number;
  company: string;
  contractor: string;
  contract_text: string;
  signature: string | null;
  status: string;
};

export default function ContractTokenPage() {
  const params = useParams();

  const token = params.token as string;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [company, setCompany] = useState("");
  const [contractor, setContractor] = useState("");
  const [contractText, setContractText] = useState("");

  const [signature, setSignature] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!token) return;

    loadContract();
  }, [token]);

  const loadContract = async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/contract/${token}`, {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "계약서를 불러오지 못했습니다."
        );
      }

      const data: ContractData = result;

      setCompany(data.company || "");
      setContractor(data.contractor || "");
      setContractText(data.contract_text || "");
      setSignature(data.signature || "");
      setCompleted(data.status === "completed");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "계약서를 불러오지 못했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (image: string) => {
    setSignature(image);
    setOpen(false);
  };

  const handleComplete = async () => {
    if (!signature) {
      alert("먼저 서명해주세요.");
      return;
    }

    if (completed) {
      alert("이미 완료된 계약입니다.");
      return;
    }

    const { error } = await supabase
      .from("contract")
      .update({
        signature,
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", Number((await getContractId())));

    if (error) {
      alert(error.message);
      return;
    }

    await loadContract();

    alert("전자계약이 완료되었습니다.");
  };

  const getContractId = async () => {
    const response = await fetch(`/api/contract/${token}`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok || !data?.id) {
      throw new Error("계약 정보를 확인할 수 없습니다.");
    }

    return data.id;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f3f5f8] flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-800">
            계약서를 불러오는 중입니다.
          </div>

          <div className="mt-2 text-sm text-gray-500">
            잠시만 기다려주세요.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f5f8] py-8 px-4">
      <ContractView
        company={company}
        contractor={contractor}
        contractText={contractText}
        signature={signature}
        completed={completed}
        onSign={() => setOpen(true)}
        onComplete={handleComplete}
      />

      {!completed && (
        <SignatureModal
          open={open}
          onClose={() => setOpen(false)}
          onSave={handleSave}
        />
      )}
    </main>
  );
}