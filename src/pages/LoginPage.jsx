import { useState, useEffect } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

function LoginPage({ setIsAuth }) {
  
  const [account, setAccount] = useState({
    username: "example@test.com",
    password: "example"
  });
  
//   編輯：input變更---------------------------------------------------------
  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setAccount({
      ...account,
      [name]: value
    });
  };
  
//  登入onSubmit-------------------------------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/v2/admin/signin`, account);
      const { token, expired } = res.data;
     // Token 到 Cookies，設定過期時間
      document.cookie = `userToken=${token}; expires=${new Date(expired)}`;
      // 所有axios的header加入token(這樣可以不用每個都輸入)
      axios.defaults.headers.common["Authorization"] = token;
      setIsAuth(true);
    } catch (error) {
      alert("登入失敗");
    }
  };
  // 檢查使用者是否已登入 ----------------------------------------------
  const checkUserLogin = async () => {
    try {
      await axios.post(`${BASE_URL}/v2/api/user/check`);
      setIsAuth(true); //轉換狀態已登入
    } catch (error) {}
  };
  
  // 初始化：取得token，若cookies有則自動帶入(登入)-----------------------
  useEffect(() => {
    // 取得token到變數token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)userToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    // 代入token
    axios.defaults.headers.common["Authorization"] = token;
    checkUserLogin(); //使用者登入帶入
  }, []);
  
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h1 className="mb-5">請先登入</h1>
      <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
        <div className="form-floating mb-3">
          <input
            name="username"
            value={account.username || ""}
            onChange={handleInputChange}
            type="email"
            className="form-control"
            id="username"
            placeholder="name@example.com"
          />
          <label htmlFor="username">Email address</label>
        </div>
        <div className="form-floating">
          <input
            name="password"
            value={account.password}
            onChange={handleInputChange}
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
          />
          <label htmlFor="password">Password</label>
        </div>
        <button className="btn btn-primary">登入</button>
      </form>
    </div>
  );
}
export default LoginPage;
