import { useState, useEffect } from "react";

const API_URL = "https://YOUR_PROJECT.supabase.co/rest/v1/knowledge";
const API_KEY = "YOUR_ANON_KEY";

export default function ClinicCoordinator() {
  const [knowledgeBase, setKnowledgeBase] = useState({});
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi 👋 I'm your Clinic Coordinator. Ask me anything or teach me below." }
  ]);

  const [input, setInput] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const loadKnowledge = async () => {
    try {
const res = await fetch(API_URL, {
  headers: {
    "apikey": API_KEY,
    "Authorization": `Bearer ${API_KEY}`
  }
});

const rows = await res.json();

// Convert Supabase rows → single object
const kb = {};
rows.forEach(row => {
  if (row.data) {
    Object.assign(kb, row.data);
  }
});

setKnowledgeBase(kb);
    } catch (err) {
      console.error(err);
    }
  };

  const saveKnowledge = async (kb) => {
    try {
await fetch(API_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "apikey": API_KEY,
    "Authorization": `Bearer ${API_KEY}`,
    "Prefer": "resolution=merge-duplicates"
  },
  body: JSON.stringify({
    id: 1,
    data: updatedKB
  })
});
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kb)
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadKnowledge(); }, []);

  const getResponse = (query) => {
    const words = query.toLowerCase().split(" ");
    for (let key in knowledgeBase) {
      const keyWords = key.split(" ");
      if (keyWords.some(k => words.includes(k))) return knowledgeBase[key].answer;
    }
    return "I’m not certain based on current clinic guidelines—please check with management.";
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages,{role:"user",text:input},{role:"bot",text:getResponse(input)}]);
    setInput("");
  };

  const teachBot = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    const key = newQuestion.toLowerCase();

    const updatedKB = {
      ...knowledgeBase,
      [key]: { answer: newAnswer, updatedAt: new Date().toLocaleString() }
    };

    setKnowledgeBase(updatedKB);
    await saveKnowledge(updatedKB);

    setMessages([...messages,{role:"bot",text:"✅ Saved for entire clinic"}]);
    setNewQuestion("");
    setNewAnswer("");
  };

  return (
    <div style={{padding:20,maxWidth:600,margin:'auto'}}>
      <h2>Clinic Coordinator</h2>
      <div style={{border:'1px solid #ccc',height:300,overflow:'auto',padding:10}}>
        {messages.map((m,i)=>(<div key={i} style={{textAlign:m.role==='user'?'right':'left'}}>{m.text}</div>))}
      </div>

      <div style={{display:'flex',gap:8,marginTop:10}}>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask..." style={{flex:1}} />
        <button onClick={sendMessage}>Send</button>
      </div>

      <h4>Teach the Bot</h4>
      <input value={newQuestion} onChange={e=>setNewQuestion(e.target.value)} placeholder="Trigger" />
      <textarea value={newAnswer} onChange={e=>setNewAnswer(e.target.value)} placeholder="Answer" />
      <button onClick={teachBot}>Save (All Staff)</button>
    </div>
  );
}
