"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ContractView from "@/components/ContractView";
import SignatureModal from "@/components/SignatureModal";

export default function ContractPage() {
  const { id } = useParams();

  const [open, setOpen] = useState(false);

  const [company, setCompany] = useState("");
  const [contractor, setContractor] = useState("");
  const [contractText, setContractText] = useState("");

  const [signature, setSignature] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    loadContract();
  }, []);

  const loadContract = async () => {
    const { data, error } = await supabase
      .from("contract")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setCompany(data.company);
    setContractor(data.contractor);
    setContractText(data.contract_text);
    setSignature(data.signature ?? "");
    setCompleted(data.status === "completed");
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

    const { error } = await supabase
      .from("contract")
      .update({
        signature,
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadContract();
    alert("전자계약이 완료되었습니다.");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-10">

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