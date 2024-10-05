'use client'

import { useState, useEffect } from "react";
import axios from "axios";

interface Item {
  name: string;
  quantity: number;
  price: number;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [message, setMessage] = useState("");
  const [editItem, setEditItem] = useState<{ name: string, quantity: number, price: number } | null>(null);

  // 아이템 목록 조회
  const fetchItems = async () => {
    try {
      const response = await axios.get("/api/items");
      const data = response.data;
      if (data.success) {
        setItems(data.data);
      }
    } catch (error) {
      console.error("Error fetching items", error);
    }
  };

  // 새로운 아이템 추가
  const addItem = async () => {
    if (!name) return window.alert("상품명 입력은 필수입니다.");

    try {
      const response = await axios.post("/api/items", {
        name,
        quantity,
        price,
      });
      const data = response.data;
      setMessage(data.message);
      fetchItems(); // 업데이트 후 목록 갱신
    } catch (error) {
      console.error("Error adding item", error);
    }
  };

  // 아이템 삭제
  const deleteItem = async (itemName: string) => {
    try {
      const response = await axios.delete(`/api/item/${itemName}`);
      const data = response.data;
      setMessage(data.message);
      fetchItems(); // 삭제 후 목록 갱신
    } catch (error) {
      console.error("Error deleting item", error);
    }
  };

  // 아이템 수정
  const updateItem = async () => {
    if (!editItem) return;
    try {
      const response = await axios.put(`/api/item/${editItem.name}`, {
        quantity: editItem.quantity,
        price: editItem.price,
      });
      const data = response.data;
      setMessage(data.message);
      setEditItem(null);  // 수정 완료 후 상태 초기화
      fetchItems(); // 수정 후 목록 갱신
    } catch (error) {
      console.error("Error updating item", error);
    }
  };

  // 수정할 아이템을 설정
  const startEditing = (item: Item) => {
    setEditItem({ name: item.name, quantity: item.quantity, price: item.price });
  };

  useEffect(() => {
    fetchItems(); // 페이지 로딩 시 아이템 목록 가져오기
  }, []);

  useEffect(() => {
    if (message) {
      window.alert(message);
    }
  }, [message]);

  return (
    <main>
      <div style={{ display: "flex" }}>
        <div style={{ padding: "20px", minWidth: 720 }}>
          <h1>상품 관리 페이지</h1>

          <div>
            <h2>새로운 상품 추가</h2>
            <div className="productLabel">
              <div>상품명:</div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="productLabel">
              <div>재고:</div>
              <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>

          </div>

          <div className="productLabel">
            <div>가격:</div>
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
          <button style={{ marginTop: 20, width: "100%" }} onClick={addItem}>추가</button>

          <hr style={{ marginTop: 50 }}></hr>

          <div style={{ marginTop: 40 }}>
            <h2>전체 상품 목록</h2>
            <div style={{ display: "flex" }}>
              <h4 style={{ width: 170 }}>상품명</h4>
              <h4 style={{ marginLeft: 16, width: 170 }}>재고</h4>
              <h4 style={{ marginLeft: 16, width: 170 }}>가격</h4>
            </div>

            {items.length === 0 ? (
              <p>No items available</p>
            ) : (
              <ul style={{ padding: 0 }}>
                {items.map((item) => (
                  <li key={item.name} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                    {editItem && editItem.name === item.name ? (
                      // 수정 모드일 때
                      <div style={{ minWidth: 660, display: "flex", justifyContent: "space-between" }}>
                        <input
                          type="text"
                          value={editItem.name}
                          disabled
                        />
                        <input
                          type="number"
                          value={editItem.quantity}
                          onChange={(e) => setEditItem({ ...editItem, quantity: Number(e.target.value) })}
                        />
                        <input
                          type="number"
                          value={editItem.price}
                          onChange={(e) => setEditItem({ ...editItem, price: Number(e.target.value) })}
                        />
                        <button onClick={updateItem}>저장</button>
                        <button onClick={() => setEditItem(null)}>취소</button>
                      </div>
                    ) : (
                      // 수정 모드가 아닐 때
                      <div style={{ minWidth: 660, display: "flex" }}>
                        <div style={{ width: 170 }}>
                          {item.name}
                        </div>
                        <div style={{ width: 170, marginLeft: 16 }}>
                          {item.quantity}
                        </div>
                        <div style={{ width: 170, marginLeft: 16 }}>
                          {item.price}
                        </div>
                        <button onClick={() => startEditing(item)} style={{ marginLeft: 76 }}>수정</button>
                      </div>
                    )}
                    <button onClick={() => deleteItem(item.name)}>제거</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
        <section style={{ marginLeft: 40 }}>
          <h1>API 가이드 및 웹 UI 테스트 방법</h1>

          <h2>웹 UI 테스트 방법</h2>
          <ul>
            <li><strong>아이템 목록 조회</strong>: 페이지가 로드되면 모든 아이템이 목록에 표시됩니다.</li>
            <li><strong>아이템 추가</strong>: 상품명, 재고, 가격을 입력한 후 &quot;추가&quot; 버튼을 클릭합니다.</li>
            <li><strong>아이템 수정</strong>: &quot;수정&quot; 버튼을 클릭하여 원하는 값을 수정한 후 &quot;저장&quot; 버튼을 클릭합니다.</li>
            <li><strong>아이템 삭제</strong>: &quot;제거&quot; 버튼을 클릭하여 아이템을 삭제합니다.</li>
          </ul>

          <h2>1. GET /api/items (모든 아이템 목록 조회)</h2>
          <p>이 API는 MongoDB에 저장된 모든 아이템을 조회하여 반환합니다.</p>
          <textarea rows={5} cols={50} readOnly value="{\n    &quot;success&quot;: true,\n    &quot;data&quot;: [\n        { &quot;name&quot;: &quot;item1&quot;, &quot;quantity&quot;: 10, &quot;price&quot;: 100 },\n        { &quot;name&quot;: &quot;item2&quot;, &quot;quantity&quot;: 20, &quot;price&quot;: 200 }\n    ]\n}"></textarea>

          <h2>2. POST /api/items (아이템 추가)</h2>
          <p>새로운 아이템을 MongoDB에 추가합니다.</p>
          <textarea rows={5} cols={50} readOnly value="{\n    &quot;name&quot;: &quot;item1&quot;,\n    &quot;quantity&quot;: 10,\n    &quot;price&quot;: 100\n}"></textarea>

          <h2>{`3. GET /api/item/{item}`} (특정 아이템 조회)</h2>
          <p>MongoDB에서 특정 아이템을 조회하여 반환합니다.</p>
          <textarea rows={5} cols={50} readOnly value="{\n    &quot;success&quot;: true,\n    &quot;data&quot;: { &quot;name&quot;: &quot;item1&quot;, &quot;quantity&quot;: 10, &quot;price&quot;: 100 }\n}"></textarea>

          <h2>{`4. PUT /api/item/{item} (아이템 수정)`}</h2>
          <p>특정 아이템의 수량 또는 가격을 수정합니다.</p>
          <textarea rows={5} cols={50} readOnly value="{\n    &quot;quantity&quot;: 20,\n    &quot;price&quot;: 150\n}"></textarea>

          <h2>{`5. DELETE /api/item/{item} (아이템 삭제)`}</h2>
          <p>MongoDB에 저장된 특정 아이템을 삭제합니다.</p>
          <textarea rows={5} cols={50} readOnly value="{\n    &quot;success&quot;: true,\n    &quot;message&quot;: &quot;아이템 삭제 성공&quot;\n}"></textarea>

        </section>

      </div>
    </main >
  );
}
