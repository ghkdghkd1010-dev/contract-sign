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
      items,
      deliveryDate,
      deliveryAddress,
      contract_text,
      status,
    } = body;

    if (!company || !contractor || !items?.length) {
      return NextResponse.json(
        {
          error: "회사명, 계약 상대방, 품목은 필수입니다.",
        },
        { status: 400 }
      );
    }

    // 품목별 금액 계산
    const processedItems = items.map((item: any) => {
      const quantity = Number(item.quantity || 0);
      const unitPrice = Number(item.unitPrice || 0);

      return {
        product_name: item.productName || "",
        product_spec: item.productSpec || null,
        quantity,
        unit_price: unitPrice,
        total_price: quantity * unitPrice,
      };
    });

    // 전체 계약금액
    const totalPrice = processedItems.reduce(
      (sum: number, item: any) =>
        sum + Number(item.total_price || 0),
      0
    );

    // 계약 기본정보 저장
    const { data: contract, error: contractError } =
      await supabase
        .from("contract")
        .insert({
          company,

          company_business_number:
            companyBusinessNumber || null,

          contractor,

          contractor_business_number:
            contractorBusinessNumber || null,

          // 기존 컬럼은 첫 번째 품목 기준으로 유지
          product_name:
            processedItems[0]?.product_name || null,

          product_spec:
            processedItems[0]?.product_spec || null,

          quantity:
            processedItems[0]?.quantity || null,

          unit_price:
            processedItems[0]?.unit_price || null,

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

    if (contractError) {
      console.error(
        "CONTRACT INSERT ERROR:",
        contractError
      );

      return NextResponse.json(
        {
          error: "계약 생성 중 오류가 발생했습니다.",
          detail: contractError.message,
        },
        { status: 500 }
      );
    }

    if (!contract) {
      return NextResponse.json(
        {
          error: "계약 생성 결과를 확인할 수 없습니다.",
        },
        { status: 500 }
      );
    }

    // 여러 품목 저장
    const itemRows = processedItems.map(
      (item: any) => ({
        contract_id: contract.id,
        product_name: item.product_name,
        product_spec: item.product_spec,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
      })
    );

    const { error: itemsError } =
      await supabase
        .from("contract_items")
        .insert(itemRows);

    if (itemsError) {
      console.error(
        "CONTRACT ITEMS INSERT ERROR:",
        itemsError
      );

      // 품목 저장 실패 시 계약도 삭제
      await supabase
        .from("contract")
        .delete()
        .eq("id", contract.id);

      return NextResponse.json(
        {
          error: "계약 품목 저장 중 오류가 발생했습니다.",
          detail: itemsError.message,
        },
        { status: 500 }
      );
    }

    if (!contract.public_token) {
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
        id: contract.id,
        public_token: contract.public_token,
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