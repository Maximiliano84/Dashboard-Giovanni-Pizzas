import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { PageLoader } from "./components/LoadingStates";
import { AuthProvider } from "./context/AuthContext";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Ventas = lazy(() => import("./pages/Ventas"));
const Variedades = lazy(() => import("./pages/Variedades"));
const Gastos = lazy(() => import("./pages/Gastos"));
const Categorias = lazy(() => import("./pages/Categorias"));
const Historial = lazy(() => import("./pages/Historial"));
const Costos = lazy(() => import("./pages/Costos"));
const Login = lazy(() => import("./pages/Login"));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader title="Cargando aplicación" description="Abriendo el panel de Giovanni..." />}>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="ventas" element={<Ventas />} />
                <Route path="variedades" element={<Variedades />} />
                <Route path="gastos" element={<Gastos />} />
                <Route path="categorias" element={<Categorias />} />
                <Route path="historial" element={<Historial />} />
                <Route path="costos" element={<Costos />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
