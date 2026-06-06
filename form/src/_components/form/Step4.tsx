export function Step4() {
  return (
    <div className="card">
      <div className="card-header">
        <span className="step-badge">STEP 4</span>
        <h2 className="card-title">確認・送信</h2>
      </div>

      <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "20px" }}>
        入力内容をご確認のうえ、「送信する」を押してください。
      </p>

      <table className="confirm-table">
        <tr>
          <th>お名前</th>
          <td>山田 太郎</td>
        </tr>
        <tr>
          <th>メールアドレス</th>
          <td>example@example.com</td>
        </tr>
        <tr>
          <th>年齢</th>
          <td>30〜39歳</td>
        </tr>
        <tr>
          <th>性別</th>
          <td>男性</td>
        </tr>
        <tr>
          <th>サービスの品質</th>
          <td>★★★★☆（4）</td>
        </tr>
        <tr>
          <th>使いやすさ</th>
          <td>★★★★★（5）</td>
        </tr>
        <tr>
          <th>サポート対応</th>
          <td>★★★☆☆（3）</td>
        </tr>
        <tr>
          <th>総合満足度</th>
          <td>★★★★☆（4）</td>
        </tr>
        <tr>
          <th>改善してほしい点</th>
          <td>操作性・UI の改善、機能の充実</td>
        </tr>
        <tr>
          <th>ご意見・ご感想</th>
          <td style={{ color: "#6b7280", fontStyle: "italic" }}>（未記入）</td>
        </tr>
        <tr>
          <th>他者への推奨</th>
          <td>はい、ぜひ勧めます</td>
        </tr>
      </table>

      <div className="nav-buttons">
        <button className="btn btn-back">← 戻る</button>
        <button className="btn btn-submit">送信する ✓</button>
      </div>
    </div>
  );
}
