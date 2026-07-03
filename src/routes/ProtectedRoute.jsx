import RoleGate from "../components/routes/RoleGate";

export default function ProtectedRoute({ children }) {
  return <RoleGate>{children}</RoleGate>;
}
