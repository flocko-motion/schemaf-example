import { useState, useEffect } from "react";

export default function App() {
  const [number, setNumber] = useState(0);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetch("/api/number")
      .then((r) => r.json())
      .then((d) => {
        setNumber(d.number);
        setInput(String(d.number));
      });
  }, []);

  const save = () => {
    fetch("/api/number", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number: parseInt(input) || 0 }),
    })
      .then((r) => r.json())
      .then((d) => setNumber(d.number));
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>Schemaf Example</h1>
      <p>Current number: <strong>{number}</strong></p>
      <input
        type="number"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && save()}
      />
      <button onClick={save}>Save</button>
    </div>
  );
}
