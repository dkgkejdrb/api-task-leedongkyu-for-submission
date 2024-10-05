import { client } from "@/app/api/mongodb";
import { NextRequest, NextResponse } from 'next/server';
import { Db, Collection, Document } from 'mongodb';

interface ItemDocument extends Document {
  name: string;
  quantity: number;
  price: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { item: string } }
) {
  const item = params.item;

  await client.connect();

  const db: Db = client.db("conAi");
  const collection: Collection<ItemDocument> = db.collection("items");

  async function run() {
    try {
      const itemInformation = await collection.findOne({ name: item });
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { item: string } }
) {
  const item = params.item;
  const body = await request.json(); // 요청의 body에서 업데이트할 데이터를 가져옴
  const { quantity, price }: { quantity?: number; price?: number } = body; // 업데이트할 quantity와 price

  await client.connect();

  const db: Db = client.db("conAi");
  const collection: Collection<ItemDocument> = db.collection("items");

  try {
    // 아이템이 존재하는지 확인
    const existingItem = await collection.findOne({ name: item });

    if (!existingItem) {
      return NextResponse.json({ success: false, message: "아이템이 없습니다." }, { status: 404 });
    }

    // 업데이트할 데이터 객체 생성
    const updateData: Partial<ItemDocument> = {};
    if (quantity !== undefined) updateData.quantity = quantity;
    if (price !== undefined) updateData.price = price;

    // MongoDB의 updateOne 사용하여 quantity와 price 업데이트
    await collection.updateOne({ name: item }, { $set: updateData });

    return NextResponse.json({ success: true, message: "업데이트 성공", data: updateData }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: "Unknown error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { item: string } }
) {
  const item = params.item;

  await client.connect();

  const db: Db = client.db("conAi");
  const collection: Collection<ItemDocument> = db.collection("items");

  try {
    // 해당 아이템이 존재하는지 확인
    const existingItem = await collection.findOne({ name: item });

    if (!existingItem) {
      return NextResponse.json({ success: false, message: "아이템이 없습니다." }, { status: 404 });
    }

    // MongoDB에서 아이템 삭제
    const result = await collection.deleteOne({ name: item });

    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true, message: "아이템 삭제 성공" }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: "아이템 삭제 실패" }, { status: 400 });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: "Unknown error" }, { status: 500 });
  }
}
