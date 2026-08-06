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

    if (data.signature) {
      setSignature(data.signature);
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

    alert("계약이 완료되었습니다.");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <ContractView
        company={company}
        contractor={contractor}
        contractText={contractText}
        signature={signature}
        onSign={() => setOpen(true)}
        onComplete={handleComplete}
      />

      <SignatureModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />
    </main>
  );
}