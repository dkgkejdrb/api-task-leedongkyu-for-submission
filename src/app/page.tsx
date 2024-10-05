'use client'

// import { useRouter } from 'next/router';
import Link from 'next/link'

export default function Home() {
  // const router = useRouter();

  return (
    <main>
      <div style={{ padding: "20px", minWidth: 720 }}>
        {/* <button onClick={goToRestfulAPITest}>Task1: Restful API Test </button> */}
        <h1>RESTful API 서버 구축 및 클라우드 배포 과제</h1>
        <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
          <div><Link href={'/calculatorapi'} prefetch><h2>사칙 연산 API 테스트  👈</h2></Link></div>
          <div><Link href={'/testrestfulapi'} prefetch><h2>(추가 수행) 재고 관리 API CRUD 테스트  👈</h2></Link></div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <h3 style={{ marginBottom: 10, marginTop: 50 }}>{`⚙️ <구현에 사용한 도구>`}</h3>
          <table border={1} style={{ width: 200 }}>
            <thead>
              <tr>
                <th>항목</th>
                <th>설명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Language</td>
                <td>Typescript</td>
              </tr>
              <tr>
                <td>DB</td>
                <td>Mongo DB</td>
              </tr>
              <tr>
                <td>Framework</td>
                <td>Next.js</td>
              </tr>
              <tr>
                <td>Cloud</td>
                <td>Azure</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <h3 style={{ marginBottom: 10, marginTop: 50 }}>{`📢 <드리는 말>`}</h3>
          <p>&apos;사칙 연산 API 테스트로&apos;는 CRUD를 테스트해보실, 적절한 시나리오가 떠오르지 않았습니다.</p>
          <p>그래서, 바이트미 웹에서 사용할 재고 관리 시나리오를 떠올려 &apos;재고 관리 CURD API&apos;를 만들어보았습니다.</p> 
          <p>두 개의 API 모두 테스트해주세요!</p>
        </div>
      </div>
    </main>
  );
}
