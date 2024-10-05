import { client } from "@/app/api/mongodb";
import { NextRequest, NextResponse } from 'next/server';
import { Db, Collection, Document } from 'mongodb';

interface ItemDocument extends Document {
    name: string;
    num1: number;
    num2: number;
    operation: string;
    result: number;
}

export async function GET() {
    await client.connect();

    const db: Db = client.db("conAi");
    const collection: Collection<ItemDocument> = db.collection("calculator");

    async function run() {
        try {
            const itemInformation = await collection.findOne({ name: "result" });
            if (itemInformation) {
                return NextResponse.json({ success: true, data: itemInformation }, { status: 200 });
            } else {
                return NextResponse.json({ success: false, message: "아이템이 없습니다." }, { status: 200 });
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                return NextResponse.json({ success: false, message: error.message }, { status: 500 });
            }
            return NextResponse.json({ success: false, message: "Unknown error" }, { status: 500 });
        }
    }
    return await run();
}

export async function POST(request: Request) {
    const content = await request.json();
    await client.connect();

    const db = client.db("conAi");
    const collection = db.collection("items");

    async function run() {
        try {
            const createdDate = new Date();
            const existingItem = await collection.findOne({ name: content.name });
            if (existingItem) {
                return NextResponse.json({ success: false, message: '이미 등록된 아이템입니다.' }, { status: 200 });
            }

            return NextResponse.json({ success: true, data: { ...content, createdDate: createdDate }, message: "등록 성공" }, { status: 200 });
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                return NextResponse.json({ success: false, message: error.message }, { status: 500 });
            }
            return NextResponse.json({ success: false, message: "Unknown error" }, { status: 500 });
        }
    }
    return await run()
}

export async function PUT(
    request: NextRequest
) {
    const body = await request.json(); // 요청의 body에서 업데이트할 데이터를 가져옴
    const { num1, num2, operation }: { num1?: number; num2?: number, operation?: string } = body; // 업데이트할 quantity와 price
    let result: number | undefined; // result는 이후에 재할당되므로 let 사용

    await client.connect();

    const db: Db = client.db("conAi");
    const collection: Collection<ItemDocument> = db.collection("calculator");

    try {
        // 아이템이 존재하는지 확인
        const existingItem = await collection.findOne({ name: "result" });

        if (!existingItem) {
            return NextResponse.json({ success: false, message: "아이템이 없습니다." }, { status: 404 });
        }

        // 업데이트할 데이터 객체 생성
        const updateData: Partial<ItemDocument> = {};
        if (num1 !== undefined) updateData.num1 = num1; else return;
        if (num2 !== undefined) updateData.num2 = num2; else return;
        if (operation !== undefined) updateData.operation = operation;

        // 사칙연산 수행
        switch (operation) {
            case '더하기':
                result = num1 + num2;
                break;
            case '빼기':
                result = num1 - num2;
                break;
            case '곱하기':
                result = num1 * num2;
                break;
            case '나누기':
                result = num1 / num2;
                break;
            default:
                return NextResponse.json({ success: false, message: "유효하지 않은 연산자입니다." }, { status: 400 });
        }

        if (result !== undefined) updateData.result = result;

        // MongoDB의 updateOne 사용하여 quantity와 price 업데이트
        await collection.updateOne({ name: "result" }, { $set: updateData });

        return NextResponse.json({ success: true, message: "업데이트 성공", data: updateData }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: false, message: "Unknown error" }, { status: 500 });
    }
}
