export function Step1() {
  return (
    <div className="card">
      <div className="card-header">
        <span className="step-badge current">STEP 1</span>
        <h2 className="card-title">基本情報</h2>
      </div>

      <div className="field">
        <label>
          お名前<span className="required">*</span>
        </label>
        <input type="text" placeholder="山田 太郎" />
      </div>

      <div className="field">
        <label>
          メールアドレス<span className="required">*</span>
        </label>
        <input type="email" placeholder="example@example.com" />
        <p className="hint">回答結果の送付先として使用します</p>
      </div>

      <div className="field">
        <label>
          年齢<span className="required">*</span>
        </label>
        <select>
          <option value="" disabled selected>
            選択してください
          </option>
          <option>19歳以下</option>
          <option>20〜29歳</option>
          <option>30〜39歳</option>
          <option>40〜49歳</option>
          <option>50〜59歳</option>
          <option>60歳以上</option>
        </select>
      </div>

      <div className="field">
        <label>性別</label>
        <div className="radio-group">
          <label className="radio-item">
            <input type="radio" name="gender" /> 男性
          </label>
          <label className="radio-item">
            <input type="radio" name="gender" /> 女性
          </label>
          <label className="radio-item">
            <input type="radio" name="gender" /> 回答しない
          </label>
        </div>
      </div>

      <div className="nav-buttons">
        <button className="btn btn-next">次へ →</button>
      </div>
    </div>
  );
}
