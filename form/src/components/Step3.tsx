export function Step3() {
  return (
    <div className="card">
      <div className="card-header">
        <span className="step-badge">STEP 3</span>
        <h2 className="card-title">ご意見・ご感想</h2>
      </div>

      <div className="field">
        <label>改善してほしい点をお選びください（複数可）</label>
        <div className="checkbox-group">
          <label className="checkbox-item">
            <input type="checkbox" /> 操作性・UI の改善
          </label>
          <label className="checkbox-item">
            <input type="checkbox" /> サポート対応の速さ
          </label>
          <label className="checkbox-item">
            <input type="checkbox" /> 価格・料金プラン
          </label>
          <label className="checkbox-item">
            <input type="checkbox" /> 機能の充実
          </label>
          <label className="checkbox-item">
            <input type="checkbox" /> ドキュメント・マニュアル
          </label>
        </div>
      </div>

      <div className="field">
        <label>ご自由にお書きください</label>
        <textarea placeholder="ご意見・ご要望などをご記入ください（任意）"></textarea>
        <p className="hint">500文字以内</p>
      </div>

      <div className="field">
        <label>
          このサービスを他の方に勧めますか？<span className="required">*</span>
        </label>
        <div className="radio-group">
          <label className="radio-item">
            <input type="radio" name="recommend" /> はい、ぜひ勧めます
          </label>
          <label className="radio-item">
            <input type="radio" name="recommend" /> 場合によっては勧めます
          </label>
          <label className="radio-item">
            <input type="radio" name="recommend" /> 勧めません
          </label>
        </div>
      </div>

      <div className="nav-buttons">
        <button className="btn btn-back">← 戻る</button>
        <button className="btn btn-next">次へ →</button>
      </div>
    </div>
  );
}
