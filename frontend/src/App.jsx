import { Routes, Route, useParams } from "react-router-dom";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import EventosListPage from "./pages/publico/EventosListPage";
import EventoDetailPage from "./pages/publico/EventoDetailPage";

import MapaAssentosPage from "./pages/reserva/MapaAssentosPage";
import SelecaoQuantidadePage from "./pages/reserva/SelecaoQuantidadePage";
import CheckoutPage from "./pages/reserva/CheckoutPage";

import MeusIngressosPage from "./pages/cliente/MeusIngressosPage";
import IngressoDetailPage from "./pages/cliente/IngressoDetailPage";

import MeusEventosPage from "./pages/organizador/MeusEventosPage";
import EventoFormPage from "./pages/organizador/EventoFormPage";

import PortariaPage from "./pages/portaria/PortariaPage";

import LoginPage from "./pages/auth/LoginPage";
import CadastroPage from "./pages/auth/CadastroPage";

// Por padrão, o React Router reaproveita a mesma instância do
// componente quando só o parâmetro da rota muda (ex: navegar de
// /eventos/1 para /eventos/2 continua sendo a mesma rota "eventos/:id").
// Isso obrigaria a página a resetar seu próprio estado de carregamento
// manualmente dentro de um efeito toda vez que o :id mudasse — o
// padrão de setState síncrono que vínhamos corrigindo nas outras
// páginas.
//
// Em vez disso, passamos key={id}: com uma key diferente, o React
// entende que é um componente novo e o remonta do zero, então o
// useState(true) de "carregando" volta a ser um valor inicial
// genuíno, sem precisar de nenhum setState dentro do efeito.
function RemontarPorParametro({ Componente, parametro = "id" }) {
  const params = useParams();
  return <Componente key={params[parametro]} />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Navegação e busca pública */}
        <Route index element={<EventosListPage />} />
        <Route
          path="eventos/:id"
          element={<RemontarPorParametro Componente={EventoDetailPage} />}
        />

        {/* Autenticação */}
        <Route path="entrar" element={<LoginPage />} />
        <Route path="cadastro" element={<CadastroPage />} />

        {/* Fluxo de reserva (cliente) */}
        <Route
          path="eventos/:id/assentos"
          element={
            <ProtectedRoute roles={["cliente"]}>
              <RemontarPorParametro Componente={MapaAssentosPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="eventos/:id/quantidade"
          element={
            <ProtectedRoute roles={["cliente"]}>
              <RemontarPorParametro Componente={SelecaoQuantidadePage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="checkout"
          element={
            <ProtectedRoute roles={["cliente"]}>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        {/* Meus ingressos (cliente) */}
        <Route
          path="meus-ingressos"
          element={
            <ProtectedRoute roles={["cliente"]}>
              <MeusIngressosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="meus-ingressos/:id"
          element={
            <ProtectedRoute roles={["cliente"]}>
              <RemontarPorParametro Componente={IngressoDetailPage} />
            </ProtectedRoute>
          }
        />

        {/* Organizador */}
        <Route
          path="organizador/eventos"
          element={
            <ProtectedRoute roles={["organizador"]}>
              <MeusEventosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="organizador/eventos/novo"
          element={
            <ProtectedRoute roles={["organizador"]}>
              <EventoFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="organizador/eventos/:id"
          element={
            <ProtectedRoute roles={["organizador"]}>
              <RemontarPorParametro Componente={EventoFormPage} />
            </ProtectedRoute>
          }
        />

        {/* Portaria */}
        <Route
          path="portaria"
          element={
            <ProtectedRoute roles={["portaria"]}>
              <PortariaPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
