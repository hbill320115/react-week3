import {  useState } from "react";
import LoginPage from "./pages/LoginPage";
import ProductPage from "./pages/ProductPage";

function App() {
  const [isAuth, setIsAuth] = useState(false);

  return (
    <>
      {/* 產品表格(判斷顯示"登入畫面"or"商品列表(後台)") */}
      {isAuth ? <ProductPage setIsAuth={setIsAuth}/> 
              : <LoginPage setIsAuth={setIsAuth}/>}
    </>
  );
}

export default App;
