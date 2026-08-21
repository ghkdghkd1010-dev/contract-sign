import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Params = {
  params: Promise<{
    token: string;
  }>;
};

// 계약서 조회
export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json(
        {
          error: "계약 토큰이 없습니다.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("contract")
      .select("*")
      .eq("public_token", token)
      .maybeSingle();

    if (error) {
      console.error(
        "SUPABASE GET ERROR:",
        error
      );

      return NextResponse.json(
        {
          error:
            "계약서 조회 중 오류가 발생했습니다.",
          detail: error.message,
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          error: "계약서를 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "계약서 조회 예외:",
      error
    );

    return NextResponse.json(
      {
        error:
          "계약서 조회 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

// 계약 완료 / 전자서명 저장
export async function PATCH(
  request: Request,
  { params }: Params
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json(
        {
          error: "계약 토큰이 없습니다.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const { signature } = body;

    if (!signature) {
      return NextResponse.json(
        {
          error: "전자서명이 없습니다.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("contract")
      .update({
        signature,
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("public_token", token)
      .select("*")
      .single();

    if (error) {
      console.error(
        "SUPABASE PATCH ERROR:",
        error
      );

      return NextResponse.json(
        {
          error:
            "계약 완료 처리 중 오류가 발생했습니다.",
          detail: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "계약 완료 예외:",
      error
    );

    return NextResponse.json(
      {
        error:
          "계약 완료 처리 중 오류가 발생했습니다.",
        detail:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}