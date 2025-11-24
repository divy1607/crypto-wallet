import { SolanaWallet } from "./components/SolanaWallet";
import { EthWallet } from "./components/EthWallet";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

function Navigation() {
  const navigate = useNavigate();

  return (
    <div style={fullScreenCenter}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Choose Your Wallet</h1>

        <button
          style={{ ...buttonStyle, background: "#6c5ce7" }}
          onClick={() => navigate("/solana")}
        >
          Solana Wallet
        </button>

        <button
          style={{ ...buttonStyle, background: "#0984e3" }}
          onClick={() => navigate("/eth")}
        >
          Ethereum Wallet
        </button>
      </div>
    </div>
  );
}

// ********** INLINE STYLES **********

const fullScreenCenter: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #0f0f1b, #1a1a32)",
  fontFamily: "Inter, sans-serif",
};

const cardStyle: React.CSSProperties = {
  width: "400px",
  padding: "40px",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(12px)",
  boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  textAlign: "center",
  border: "1px solid rgba(255,255,255,0.1)",
};

const titleStyle: React.CSSProperties = {
  fontSize: "26px",
  fontWeight: 700,
  color: "#ffffff",
  marginBottom: "10px",
};

const buttonStyle: React.CSSProperties = {
  padding: "15px",
  borderRadius: "12px",
  border: "none",
  color: "white",
  fontSize: "18px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
};

const walletPageWrapper: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  paddingTop: "60px",
  background: "linear-gradient(135deg, #0f0f1b, #1a1a32)",
  color: "white",
  fontFamily: "Inter, sans-serif",
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigation />} />
        <Route
          path="/solana"
          element={
            <div style={walletPageWrapper}>
              <SolanaWallet />
            </div>
          }
        />
        <Route
          path="/eth"
          element={
            <div style={walletPageWrapper}>
              <EthWallet />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;