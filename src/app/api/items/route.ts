import { client } from "@/app/api/mongodb";
import { NextResponse } from 'next/server';

export async function GET() {
    await client.connect();

    const db = client.db("conAi");
    const collection = db.collection("items");

    async function run() {
        try {
            const items = await collection.find({}).toArray();
            return NextResponse.json({ success: true, data: items }, { status: 200 });
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

export async function POST(request: Request) {
    const content = await request.json();
    await client.connect();

    const db = client.db("conAi");
    const collection = db.collection("items");

    async function run() {
        try {
            const createdDate = new Date();

            // data.id로 collection에서 해당 id가 있는지 확인
            // console.log({ id: _content.id })
            const existingItem = await collection.findOne({ name: content.name });
            if (existingItem) {
                return NextResponse.json({ success: false, message: '이미 등록된 아이템입니다.' }, { status: 200 });
            }

            // 데이터를 MongoDB에 추가하는 부분
            collection.insertOne({ ...content, createdDate });

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