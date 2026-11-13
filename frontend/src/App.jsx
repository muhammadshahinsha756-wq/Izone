
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/common/Navbar.jsx";
import HeroSection from "./components/common/HeroSection.jsx";
import FeaturedProducts from "./components/common/FeaturedProducts.jsx";
import WhyChoose from "./components/common/WhyChoose.jsx";
import Footer from "./components/common/Footer.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import GuestRoute from "./components/common/GuestRoute.jsx";
import Login from "./pages/user/Login.jsx";
import Signup from "./pages/user/Signup.jsx";
import ForgotPassword from "./pages/user/ForgotPassword.jsx";
import ResetOTP from "./pages/user/ResetOTP.jsx";
import SetNewPassword from "./pages/user/SetNewPassword.jsx";
import Home from "./pages/user/Home.jsx";
import Profile from "./pages/user/Profile.jsx";
import EditProfile from "./pages/user/EditProfile.jsx";
import ChangeEmail from "./pages/user/ChangeEmail";
import Addresses from "./pages/user/Addresses";
import AddAddress from "./pages/user/AddAddress";
import EditAddress from "./pages/user/EditAddress";
import ChangePassword from "./pages/user/ChangePassword";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { AlertProvider } from "./context/AlertContext";
function LandingPage() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FeaturedProducts />
      <WhyChoose />
      <Footer />
    </div>
  );
}

function AdminLoginRoute() {
  const adminToken = localStorage.getItem("adminToken");

  if (adminToken) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <AdminLogin />;
}

function App() {
  return (
    <AlertProvider>
      <BrowserRouter>
        <Routes>

          {/* Guest Routes */}
          <Route element={<GuestRoute />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* Forgot Password Routes - Guest and Logged-in Users */}
          <Route path="/forgot-password"  element={<ForgotPassword />} />

          <Route path="/verify-otp"element={<ResetOTP />}/>

          <Route path="/set-new-password"element={<SetNewPassword />}/>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/change-email" element={<ChangeEmail />} />
            <Route path="/addresses" element={<Addresses />} />
            <Route path="/add-address" element={<AddAddress />} />
            <Route path="/edit-address/:id" element={<EditAddress />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin/login"  element={<AdminLoginRoute />}  />
          <Route path="/admin/dashboard"element={<AdminDashboard />}/>

        </Routes>
      </BrowserRouter>
    </AlertProvider>
  );
}

export default App;
