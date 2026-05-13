import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../context/auth";

const firebaseErrorMessages = {
  "auth/invalid-credential": "Email o contraseña incorrectos.",
  "auth/user-not-found": "No existe un usuario con ese email.",
  "auth/wrong-password": "Contraseña incorrecta.",
  "auth/invalid-email": "El email no tiene un formato válido.",
  "auth/too-many-requests": "Demasiados intentos fallidos. Probá de nuevo más tarde.",
  "auth/network-request-failed": "No se pudo conectar. Revisá tu conexión a internet.",
};

export default function Login() {
  const { user, loading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  if (!loading && user) {
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(firebaseErrorMessages[err.code] || "No se pudo iniciar sesión. Revisá los datos e intentá nuevamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-stone-50 to-white px-4 py-8 grid place-items-center">
      <Card className="w-full max-w-md border-stone-200 shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-20 w-32 items-center justify-center rounded-2xl bg-white shadow-sm">
            <img src="/Giovanni1.png" alt="Giovanni" className="max-h-20 object-contain" />
          </div>
          <div>
            <CardTitle className="text-2xl text-stone-900">Ingresar al dashboard</CardTitle>
            <CardDescription className="mt-2 text-stone-500">
              Acceso privado para administrar ventas, gastos y costos.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Ingresá tu contraseña"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 px-3 text-stone-500 hover:text-stone-800"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={submitting}>
              <LockKeyhole className="h-4 w-4" />
              {submitting ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
