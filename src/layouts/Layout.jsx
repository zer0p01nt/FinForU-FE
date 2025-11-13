import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import Navigation from "../components/Navigation/Navigation";

/**
 * header와 navigation이 둘 다 없는 레이아웃
 */
export function EmptyLayout() {
  return <Outlet />;
}

/**
 * header만 있는 레이아웃
 */
export function HeaderLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

/**
 * header와 navigation이 둘 다 있는 레이아웃
 */
export function HeaderNavLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Navigation />
    </>
  );
}
