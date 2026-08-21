"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import ContractView from "@/components/ContractView";
import SignatureModal from "@/components/SignatureModal";

type ContractData = {
  id: number;

  company: string;
  contractor: string;

  contract_text: string;

  signature: string | null;
  status: string;

  company_business_number?: string | null;
  contractor_business_number?: string | null;

  product_name?: string | null;
  product_spec?: string | null;

  quantity?: number | null;
  unit_price?: number | null;
  total_price?: number | null;

  delivery_date?: string | null;
  delivery_address?: string | null;
};

export default function ContractTokenPage() {
  const params = useParams();

  const token = params.token as string;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [company, setCompany] = useState("");
  const [contractor, setContractor] = useState("");

  const [companyBusinessNumber, setCompanyBusinessNumber] =
    useState("");

  const [contractorBusinessNumber, setContractorBusinessNumber] =
    useState("");

  const [contractText, setContractText] = useState("");

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");

  const [quantity, setQuantity] = useState<number | null>(null);
  const [unitPrice, setUnitPrice] = useState<number | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);

  const [deliveryDate, setDeliveryDate] =
    useState<string | null>(null);

  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [signature, setSignature] = useState("");
  const [completed, setCompleted] = useState(false);

  const [agreementChecked, setAgreementChecked] =
    useState(false);

  const [specialChecked, setSpecialChecked] =
    useState(false);

  useEffect(() => {
    if (!token) return;

    loadContract();
  }, [token]);

  const loadContract = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/contract/${token}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "계약서를 불러오지 못했습니다."
        );
      }

      const data: ContractData = result;

      setCompany(data.company || "");
      setContractor(data.contractor || "");

      setCompanyBusinessNumber(
        data.company_business_number || ""
      );

      setContractorBusinessNumber(
        data.contractor_business_number || ""
      );

      setContractText(
        data.contract_text || ""
      );

      setProductName(
        data.product_name || ""
      );

      setProductDescription(
        data.product_spec || ""
      );

      setQuantity(
        data.quantity ?? null
      );

      setUnitPrice(
        data.unit_price ?? null
      );

      setTotalPrice(
        data.total_price ?? null
      );

      setDeliveryDate(
        data.delivery_date ?? null
      );

      setDeliveryAddress(
        data.delivery_address || ""
      );

      setSignature(
        data.signature || ""
      );

      setCompleted(
        data.status === "completed"
      );
    } catch (error) {
      console.error(
        "계약서 불러오기 오류:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "계약서를 불러오지 못했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  // 전자서명 저장
  const handleSave = (image: string) => {
    setSignature(image);
    setOpen(false);
  };

  // 계약 완료
  const handleComplete = async () => {
    if (!agreementChecked || !specialChecked) {
      alert(
        "계약내용과 계약조건 및 특약사항을 모두 확인해주세요."
      );
      return;
    }

    if (!signature) {
      alert("먼저 전자서명을 해주세요.");
      return;
    }

    if (completed) {
      alert("이미 완료된 계약입니다.");
      return;
    }

    try {
      const response = await fetch(
        `/api/contract/${token}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            signature,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "계약 완료 처리 중 오류가 발생했습니다."
        );
      }

      await loadContract();

      alert("전자계약이 완료되었습니다.");
    } catch (error) {
      console.error(
        "계약 완료 처리 오류:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "계약 완료 처리 중 오류가 발생했습니다."
      );
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f3f5f8] px-5">
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
    <main className="min-h-screen bg-[#f3f5f8] px-3 py-5 sm:px-4 sm:py-8">
      <ContractView
        company={company}
        companyBusinessNumber={
          companyBusinessNumber
        }
        contractor={contractor}
        contractorBusinessNumber={
          contractorBusinessNumber
        }
        contractText={contractText}
        productName={productName}
        productDescription={
          productDescription
        }
        quantity={quantity}
        unitPrice={unitPrice}
        totalPrice={totalPrice}
        deliveryDate={deliveryDate}
        deliveryAddress={deliveryAddress}
        signature={signature}
        completed={completed}
        agreementChecked={agreementChecked}
        specialChecked={specialChecked}
        onAgreementChange={
          setAgreementChecked
        }
        onSpecialChange={
          setSpecialChecked
        }
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