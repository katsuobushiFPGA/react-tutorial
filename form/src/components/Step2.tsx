export function Step2() {
  return (
    <div className="card">
      <div className="card-header">
        <span className="step-badge">STEP 2</span>
        <h2 className="card-title">満足度調査</h2>
      </div>

      <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "16px" }}>
        各項目について、あてはまる評価を選んでください。
        <br />1 = とても不満 &nbsp;/&nbsp; 5 = とても満足
      </p>

      <table className="rating-table">
        <thead>
          <tr>
            <th>項目</th>
            <th>1</th>
            <th>2</th>
            <th>3</th>
            <th>4</th>
            <th>5</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>サービスの品質</td>
            <td>
              <input type="radio" name="q1" />
            </td>
            <td>
              <input type="radio" name="q1" />
            </td>
            <td>
              <input type="radio" name="q1" />
            </td>
            <td>
              <input type="radio" name="q1" />
            </td>
            <td>
              <input type="radio" name="q1" />
            </td>
          </tr>
          <tr>
            <td>使いやすさ</td>
            <td>
              <input type="radio" name="q2" />
            </td>
            <td>
              <input type="radio" name="q2" />
            </td>
            <td>
              <input type="radio" name="q2" />
            </td>
            <td>
              <input type="radio" name="q2" />
            </td>
            <td>
              <input type="radio" name="q2" />
            </td>
          </tr>
          <tr>
            <td>サポート対応</td>
            <td>
              <input type="radio" name="q3" />
            </td>
            <td>
              <input type="radio" name="q3" />
            </td>
            <td>
              <input type="radio" name="q3" />
            </td>
            <td>
              <input type="radio" name="q3" />
            </td>
            <td>
              <input type="radio" name="q3" />
            </td>
          </tr>
          <tr>
            <td>総合満足度</td>
            <td>
              <input type="radio" name="q4" />
            </td>
            <td>
              <input type="radio" name="q4" />
            </td>
            <td>
              <input type="radio" name="q4" />
            </td>
            <td>
              <input type="radio" name="q4" />
            </td>
            <td>
              <input type="radio" name="q4" />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="nav-buttons">
        <button className="btn btn-back">← 戻る</button>
        <button className="btn btn-next">次へ →</button>
      </div>
    </div>
  );
}
