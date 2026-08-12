import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      company,
      companyBusinessNumber,
      contractor,
      contractorBusinessNumber,
      productName,
      productSpec,
      quantity,
      unitPrice,
      deliveryDate,
      deliveryAddress,
      contract_text,
      status,
    } = body;

    if (!company || !contractor || !productName) {
      return NextResponse.json(
        {
          error: "회사명, 계약 상대방, 품목명은 필수입니다.",
        },
        { status: 400 }
      );
    }

    const totalPrice =
      Number(quantity || 0) * Number(unitPrice || 0);

    const { data, error } = await supabase
      .from("contract")
      .insert({
        company,

        company_business_number:
          companyBusinessNumber || null,

        contractor,

        contractor_business_number:
          contractorBusinessNumber || null,

        product_name: productName,

        product_spec:
          productSpec || null,

        quantity:
          quantity !== ""
            ? Number(quantity)
            : null,

        unit_price:
          unitPrice !== ""
            ? Number(unitPrice)
            : null,

        total_price: totalPrice,

        delivery_date:
          deliveryDate || null,

        delivery_address:
          deliveryAddress || null,

        contract_text:
          contract_text || "",

        status:
          status || "pending",
      })
      .select("*")
      .single();

    if (error) {
      console.error("SUPABASE INSERT ERROR:", error);

      return NextResponse.json(
        {
          error: "계약 생성 중 오류가 발생했습니다.",
          detail: error.message,
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          error: "계약 생성 결과를 확인할 수 없습니다.",
        },
        { status: 500 }
      );
    }

    if (!data.public_token) {
      return NextResponse.json(
        {
          error: "계약 토큰이 생성되지 않았습니다.",
          detail:
            "public_token 컬럼의 기본값 또는 생성 설정을 확인해주세요.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        id: data.id,
        public_token: data.public_token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("계약 생성 예외:", error);

    return NextResponse.json(
      {
        error: "계약 생성 중 오류가 발생했습니다.",
        detail:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}