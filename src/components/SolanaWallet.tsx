import { useState, useEffect } from "react";
import { Keypair, PublicKey } from "@solana/web3.js";
import { mnemonicToSeed, generateMnemonic } from "bip39";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { useNavigate } from "react-router-dom";

export function SolanaWallet() {

    const [index, setIndex] = useState(0);
    const [wallets, setWallets] = useState<
        { pub: PublicKey; priv: string; visible: boolean }[]
    >([]);
    const [mnemonic, setMnemonic] = useState<string>("");
    const [copied, setCopied] = useState(false);

    const toastStyle: React.CSSProperties = {
        position: "fixed",
        bottom: "30px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "10px 18px",
        borderRadius: "8px",
        fontSize: "14px",
        opacity: copied ? 1 : 0,
        transition: "opacity 0.4s ease",
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);

        setTimeout(() => setCopied(false), 1500); // hide after 1.5 sec
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (wallets.length === 0) {
            setMnemonic("");
        }
    }, [wallets]);

    const generateWallet = async () => {
        let finalMnemonic = mnemonic;

        if (!finalMnemonic) {
            finalMnemonic = await generateMnemonic();
            setMnemonic(finalMnemonic);
        }

        const path = `m/44'/501'/${index}'/0'`;
        const seed = await mnemonicToSeed(finalMnemonic);
        const derivedSeed = derivePath(path, seed.toString("hex")).key;

        const secretKey = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const keypair = Keypair.fromSecretKey(secretKey);

        const privateKeyBase58 = Buffer.from(secretKey).toString("base64");

        setWallets(prev => [...prev, {
            pub: keypair.publicKey,
            priv: privateKeyBase58,
            visible: false
        }]);
        setIndex((i) => i + 1);
        // setPubkeys((prev) => [...prev, keypair.publicKey]);
    };

    const deleteWallet = (pub: PublicKey) => {
        setWallets(prev =>
            prev.filter(w => w.pub.toBase58() !== pub.toBase58())
        );
    };

    return (
        <div style={pageWrapper}>
            <div style={cardStyle}>
                <button style={homeButton} onClick={() => navigate("/")}>
                    ⬅ Home
                </button>

                <h2 style={titleStyle}>Solana Wallet</h2>

                <button style={actionButton} onClick={generateWallet}>
                    {wallets.length === 0 ? "Generate Wallet" : "Add Another Wallet"}
                </button>

                {mnemonic && (
                    <div style={mnemonicBox}>
                        <strong>Mnemonic:</strong>
                        <p style={mnemonicText}>{mnemonic}</p>
                    </div>
                )}

                <div style={{ marginTop: "20px" }}>
                    {wallets.map((w, index) => (
                        <div key={w.pub.toBase58()} style={walletBox}>
                            <div>
                                {/* Public Key */}
                                <div style={{ wordBreak: "break-all", marginBottom: "8px" }}>
                                    <strong>Public Key:</strong> {w.pub.toBase58()}
                                </div>

                                {/* PRIVATE KEY SECTION */}
                                <div style={{ display: "flex", alignItems: "center", marginTop: "8px" }}>
                                    <strong>Private Key:&nbsp;</strong>

                                    {/* Hidden / Visible Private Key */}
                                    <span style={{
                                        wordBreak: "break-all",
                                        fontFamily: "monospace",
                                        letterSpacing: "1px",
                                        userSelect: w.visible ? "text" : "none"
                                    }}>
                                        {w.visible ? w.priv : "•••••••••••••••••••••••"}
                                    </span>

                                    {/* EYE BUTTON */}
                                    <button
                                        onClick={() => {
                                            setWallets(prev =>
                                                prev.map((w, i) =>
                                                    i === index ? { ...w, visible: !w.visible } : w
                                                )
                                            );
                                        }}
                                        style={iconButton}
                                    >
                                        {w.visible ? "🔒" : "🔓"}
                                    </button>

                                    {/* COPY BUTTON */}
                                    <button
                                        style={iconButton}
                                        onClick={() => handleCopy(w.priv)}
                                    >
                                        📋
                                    </button>
                                    {copied && (
                                        <div style={toastStyle}>
                                            Copied!
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* DELETE WALLET BUTTON */}
                            <button
                                style={deleteButton}
                                onClick={() => deleteWallet(w.pub)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}



// ************** INLINE CSS STYLES ************** //

const pageWrapper: React.CSSProperties = {
    width: "100vw",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0f1b, #1a1a32)",
    display: "flex",
    justifyContent: "center",
    paddingTop: "60px",
    fontFamily: "Inter, sans-serif",
    color: "white",
    paddingBottom: "60px",
};

const iconButton: React.CSSProperties = {
    marginLeft: "10px",
    padding: "6px 10px",
    borderRadius: "6px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    cursor: "pointer",
    fontSize: "16px",
};

const cardStyle: React.CSSProperties = {
    width: "650px",
    background: "rgba(255,255,255,0.06)",
    padding: "35px",
    borderRadius: "16px",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 15px 35px rgba(0,0,0,0.35)",
};

const titleStyle: React.CSSProperties = {
    fontSize: "28px",
    fontWeight: 700,
    marginBottom: "20px",
    textAlign: "center",
};


const homeButton: React.CSSProperties = {
    padding: "10px 16px",
    borderRadius: "10px",
    background: "#3c3c52",
    border: "none",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    marginBottom: "20px",
};

const actionButton: React.CSSProperties = {
    width: "100%",
    padding: "14px 20px",
    borderRadius: "12px",
    background: "#6c5ce7",
    color: "white",
    border: "none",
    fontSize: "18px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "10px",
    boxShadow: "0 8px 20px rgba(108,92,231,0.4)",
};

const mnemonicBox: React.CSSProperties = {
    marginTop: "25px",
    padding: "20px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
};

const mnemonicText: React.CSSProperties = {
    marginTop: "10px",
    fontSize: "16px",
    lineHeight: "1.4",
    wordBreak: "break-word",
};

const walletBox: React.CSSProperties = {
    marginBottom: "15px",
    padding: "16px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
};


const deleteButton: React.CSSProperties = {
    padding: "8px 14px",
    borderRadius: "8px",
    background: "#e74c3c",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
};