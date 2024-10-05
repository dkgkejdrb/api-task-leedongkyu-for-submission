'use client'

import { useState, useEffect } from "react";
import axios from "axios";

interface CalculationResult {
    num1: number;
    num2: number;
    operation: string;
    result: number;
}

export default function Home() {
    const [num1, setNum1] = useState<number | string>('');
    const [num2, setNum2] = useState<number | string>('');
    const [operation, setOperation] = useState<string>('더하기');
    const [result, setResult] = useState<number | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    // 서버에 저장된 계산 결과를 불러오기 위한 함수
    const fetchResult = async () => {
        try {
            const response = await axios.get('/api/calculator');
            const data = response.data;
            if (data.success) {
                const calculation: CalculationResult = data.data;
                setNum1(calculation.num1);
                setNum2(calculation.num2);
                setOperation(calculation.operation);
                setResult(calculation.result);
            }
        } catch (error) {
            console.error("Error fetching calculation result", error);
            setMessage("결과를 가져오지 못했습니다.");
        }
    };

    // 서버로 계산 요청을 보내기 위한 함수
    const handleCalculate = async () => {
        try {
            const response = await axios.put('/api/calculator', {
                num1: Number(num1),
                num2: Number(num2),
                operation
            });
            const data = response.data;
            if (data.success) {
                setResult(data.data.result);
                setMessage(null);
            } else {
                setMessage(data.message);
                setResult(null);
            }
        } catch (error) {
            console.error("Error calculating", error);
            setMessage("서버 오류가 발생했습니다.");
            setResult(null);
        }
    };

    // 페이지 로드 시 기존 계산 결과를 불러옴
    useEffect(() => {
        fetchResult();
    }, []);

    return (
        <main>
            <div style={{ display: "flex" }}>
                <div style={{ minWidth: 360 }}>
                    <h1>사칙연산 API 테스트</h1>

                    <div className="productLabel">
                        <div>첫 번째 숫자: </div>
                        <input
                            type="number"
                            placeholder="첫 번째 숫자"
                            value={num1}
                            onChange={(e) => setNum1(e.target.value)}
                        />
                    </div>

                    <div className="productLabel">
                        <div>두 번째 숫자: </div>
                        <input
                            type="number"
                            placeholder="두 번째 숫자"
                            value={num2}
                            onChange={(e) => setNum2(e.target.value)}
                        />
                    </div>

                    <div className="productLabel">
                        <div>사칙 연산자: </div>
                        <select style={{ width: 170 }} value={operation} onChange={(e) => setOperation(e.target.value)}>
                            <option value="더하기">더하기</option>
                            <option value="빼기">빼기</option>
                            <option value="곱하기">곱하기</option>
                            <option value="나누기">나누기</option>
                        </select>
                    </div>

                    <button onClick={handleCalculate} style={{ width: "100%", marginTop: 20 }}>계산</button>

                    {result !== null && <h2 style={{ textAlign: "center" }}>결과: {result}</h2>}
                    {message && <h3 style={{ color: 'red' }}>{message}</h3>}
                </div>

                <section style={{ marginLeft: 40, maxWidth: 600, height: 300 }}>
                    <div>
                        <h1>API 가이드 및 웹 UI 테스트 방법</h1>
                        <h2>웹 UI 테스트 방법</h2>

                        <h2>1. 첫 번째 숫자 입력</h2>
                        <p>&quot;첫 번째 숫자&quot; 입력 필드에 계산하고자 하는 첫 번째 숫자를 입력합니다.</p>
                        <p><strong>예:</strong> 10</p>

                        <h2>2. 두 번째 숫자 입력</h2>
                        <p>&quot;두 번째 숫자&quot; 입력 필드에 계산하고자 하는 두 번째 숫자를 입력합니다.</p>
                        <p><strong>예:</strong> 5</p>

                        <h2>3. 사칙연산자 선택</h2>
                        <p>드롭다운 메뉴에서 수행할 사칙연산을 선택합니다.</p>
                        <ul>
                            <li><strong>더하기</strong>: 두 숫자를 더합니다.</li>
                            <li><strong>빼기</strong>: 첫 번째 숫자에서 두 번째 숫자를 뺍니다.</li>
                            <li><strong>곱하기</strong>: 두 숫자를 곱합니다.</li>
                            <li><strong>나누기</strong>: 첫 번째 숫자를 두 번째 숫자로 나눕니다.</li>
                        </ul>

                        <h2>4. &quot;계산&quot; 버튼 클릭</h2>
                        <p>입력된 두 숫자와 선택된 연산자를 바탕으로 계산을 수행합니다.</p>
                        <p>버튼을 누르면 서버에 요청이 전송되며, 결과는 페이지 중앙에 표시됩니다.</p>

                        <h2>5. 결과 확인</h2>
                        <p>계산된 결과는 &quot;결과&quot; 섹션에 표시됩니다.</p>
                        <p><strong>예:</strong> 결과: 15</p>

                        <h2>6. 기존 계산 결과 불러오기</h2>
                        <p>페이지가 로드될 때, 서버에 저장된 기존 계산 결과가 자동으로 불러와집니다. 페이지에 처음 들어왔을 때 표시된 값이 그 결과입니다.</p>

                        <div style={{ height: 50 }}></div>
                        <h1>사칙연산 API 호출 설명</h1>

                        <h2>GET <code>/api/calculator</code></h2>
                        <p>페이지 로드 시 서버에 저장된 계산 결과를 불러오는 API입니다.</p>
                        <p>결과로 반환된 <code>num1</code>, <code>num2</code>, <code>operation</code>, <code>result</code>를 사용해 페이지에 계산 기록을 표시합니다.</p>

                        <h2>PUT <code>/api/calculator</code></h2>
                        <p>사용자가 두 숫자와 연산자를 입력한 후 &quot;계산&quot; 버튼을 클릭하면 호출됩니다.</p>
                        <p>입력된 숫자와 선택된 연산을 서버로 전송하여, 그에 맞는 사칙연산을 수행하고 결과를 서버에 업데이트합니다.</p>
                        <p>서버는 연산 결과를 반환하며, 그 결과는 페이지에 표시됩니다.</p>

                        <h2>예시 Request Body</h2>
                        <textarea rows={5} cols={50} readOnly value={"{\n    \"num1\": 10,\n    \"num2\": 5,\n    \"operation\": \"더하기\"\n}"}>
                        </textarea>
                        <h2>예시 Response</h2>
                        <textarea rows={10} cols={50} readOnly value={"{\n    \"success\": true,\n    \"data\": {\n        \"num1\": 10,\n        \"num2\": 5,\n        \"operation\": \"더하기\",\n        \"result\": 15\n    },\n    \"message\": \"업데이트 성공\"\n}"}>
                        </textarea>

                        <div style={{ height: 50 }}></div>
                    </div>
                </section>
            </div>
        </main>
    );
}
