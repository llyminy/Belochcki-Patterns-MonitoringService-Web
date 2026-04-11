import { Routes, Route,  Navigate } from "react-router-dom";
import  MainLayout  from "../shared/ui/layout/mainLayout.tsx";


import { MainPage } from "../pages/mainPage/mainPage.tsx";
import { Error500Page } from "../pages/error500/error500.tsx";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/main" element={<MainPage />} />
      <Route path="/" element={<Navigate to="/main" replace />} />
 
      <Route element={<MainLayout />}>
        <Route path="*" element={<h1>Страница не найдена</h1>} />
        <Route path="/error-500" element={<Error500Page />} />
      </Route>
    </Routes>
  );
};