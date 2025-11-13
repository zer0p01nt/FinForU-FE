import { Route, Routes } from "react-router-dom";
import { EmptyLayout, HeaderLayout, HeaderNavLayout } from "./layouts/Layout";
import RootLayout from "./layouts/RootLayout";
import { GlobalStyle } from "./styles/GlobalStyle";
import { useTranslation } from "react-i18next";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Guide from "./pages/Guide/Guide";
import Join from "./pages/Join/Join";
import Settings from "./pages/Settings/Settings";
import EditInformation from "./pages/Settings/EditInformation/EditInformation";
import DeleteAccount from "./pages/Settings/DeleteAccount/DeleteAccount";
import Rates from "./pages/Rates/Rates";
import Wallet from "./pages/Wallet/Wallet";
import Map from "./pages/map/Map";
import Product from "./pages/product/Product";

function App() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  return (
    <RootLayout>
      <GlobalStyle currentLang={currentLang} />
      <Routes>
        {/* header와 navigation이 둘 다 없는 레이아웃 */}
        <Route element={<EmptyLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        {/* header만 있는 레이아웃 */}
        <Route element={<HeaderLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          {/* 환경설정 관련 페이지 */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/edit-information" element={<EditInformation />} />
          <Route path="/settings/delete-account" element={<DeleteAccount />} />
        </Route>
        {/* header와 navigation이 둘 다 있는 레이아웃 */}
        <Route element={<HeaderNavLayout />}>
          <Route path="/guide" element={<Guide />} />
          <Route path="/rates" element={<Rates />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/map" element={<Map />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product/:productId" element={<Product />} />
        </Route>
      </Routes>
    </RootLayout>
  );
}

export default App;
