import "./App.scss";
import "boxicons/css/boxicons.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";
import PageNotFound from "./pages/PageNotFound";
import Trip from "./pages/Admin/Trip";
import Account from "./pages/Admin/Account";
import SignIn from "./pages/SignIn";
import UserLayout from "./components/layout/UserLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import SignUp from "./pages/SignUp";
import SignInAgain from "./pages/SignIn/SignInAgain";
import { ToastContainer } from "react-toastify";
import { AdminProfile } from "./pages/Admin/AdminProfile";
import { Driver } from "./pages/Admin/Driver";
import { Statistic } from "./pages/Admin/Statistic";
import Bus from "./pages/Admin/Bus";
import UserDashboard from "./pages/User/UserDashboard";
import PaymentSuccess from "./pages/PaymentSuccess";
import { UserProfile } from "./pages/User/UserProfile";
import { ForgotPassword } from "./pages/ForgotPassword/ForgotPassword";
import { ChangePassword } from "./pages/ForgotPassword/ChangePassword";
import { Station } from "./pages/Admin/Station";
import { Ticket } from "./pages/User/Ticket";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<PageNotFound />} />
        <Route path="/" element={<SignIn />} />
        <Route path="/logout" element={<SignInAgain />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/change-password/:email/:password"
          element={<ChangePassword />}
        />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="/admin/trip" element={<Trip />} />
          <Route path="/admin/station" element={<Station />} />
          <Route path="/admin/bus" element={<Bus />} />
          <Route path="/admin/driver" element={<Driver />} />
          <Route path="/admin/account" element={<Account />} />
          <Route path="/admin/my-profile" element={<AdminProfile />} />
          <Route path="/admin/statistic" element={<Statistic />} />
        </Route>
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="/user/ticket" element={<Ticket />} />
          <Route path="/user/my-profile" element={<UserProfile />} />
        </Route>
      </Routes>
      <ToastContainer theme="colored" />
    </BrowserRouter>
  );
}

export default App;
