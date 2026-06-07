import { useFormContext } from "../contexts/FormContext";
import type { Form1Data } from "../schemas/formSchema";

export function Step1() {
  const { formData, updateForm1 } = useFormContext();
  const form: Form1Data = formData.form1;

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateForm1({ ...form, name: e.target.value });

  const handleChangeMail = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateForm1({ ...form, mail: e.target.value });

  const handleChangeAge = (e: React.ChangeEvent<HTMLSelectElement>) =>
    updateForm1({ ...form, age: Number(e.target.value) });

  const handleChangeSex = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateForm1({ ...form, sex: Number(e.target.value) });

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
        <input
          type="text"
          placeholder="山田 太郎"
          defaultValue={form.name}
          onChange={handleChangeName}
        />
      </div>

      <div className="field">
        <label>
          メールアドレス<span className="required">*</span>
        </label>
        <input
          type="email"
          placeholder="example@example.com"
          defaultValue={form.mail}
          onChange={handleChangeMail}
        />
        <p className="hint">回答結果の送付先として使用します</p>
      </div>

      <div className="field">
        <label>
          年齢<span className="required">*</span>
        </label>
        <select onChange={handleChangeAge} defaultValue={String(form.age)}>
          <option value="" disabled>
            選択してください
          </option>
          <option value="1">19歳以下</option>
          <option value="2">20〜29歳</option>
          <option value="3">30〜39歳</option>
          <option value="4">40〜49歳</option>
          <option value="5">50〜59歳</option>
          <option value="6">60歳以上</option>
        </select>
      </div>

      <div className="field">
        <label>性別</label>
        <div className="radio-group">
          <label className="radio-item">
            <input
              type="radio"
              name="gender"
              value="1"
              onChange={handleChangeSex}
              checked={form.sex === 1}
            />{" "}
            男性
          </label>
          <label className="radio-item">
            <input
              type="radio"
              name="gender"
              value="2"
              onChange={handleChangeSex}
              checked={form.sex === 2}
            />{" "}
            女性
          </label>
          <label className="radio-item">
            <input
              type="radio"
              name="gender"
              value="3"
              onChange={handleChangeSex}
              checked={form.sex === 3}
            />{" "}
            回答しない
          </label>
        </div>
      </div>

      <div className="nav-buttons">
        <button className="btn btn-next">次へ →</button>
      </div>
    </div>
  );
}
