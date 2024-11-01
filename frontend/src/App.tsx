import { useEffect } from "react";
import { useAuth } from "./store/useAuth";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import LoginPage from "./page/loginPage";
import HomePage from "./page/HomePage";
import SignupPage from "./page/SignupPage";

function App() {
const {checkAuth} = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth])

  return (
    <div className="bg-gray-100 min-h-screen">
      <HomePage />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </div>
  );
}

export default App;
