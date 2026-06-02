"use client";
import { useState, useEffect, useCallback } from "react";
type Unit = { id: number; number: string; block?: string; ownerName: string; ownerPhone?: string };
type Charge = { id: number; type: string; amount: number; dueDate: string; status: string; unit: Unit };
type Notice = { id: number; title: string; body: string; priority: string; createdAt: string };
const C = { bg:"#f0f9ff", sb:"#0c4a6e", card:"#fff", border:"#bae6fd", acc:"#0284c7", muted:"#9ca3af", text:"#0c4a6e", warn:"#dc2626", ok:"#16a34a", yellow:"#d97706" };
const SC: Record<string,string> = { pending:"#d97706", paid:"#16a34a", overdue:"#dc2626" };
export default function App() {
  const [tab, setTab] = useState<"dash"|"units"|"charges"|"notices">("dash");
  const [units, setUnits] = useState<Unit[]>([]);
  const [charges, setCharges] = useState<Charge[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [uf, setUf] = useState({ number:"", block:"", ownerName:"", ownerPhone:"", ownerEmail:"" });
  const [chf, setChf] = useState({ unitId:"", type:"Condomínio", amount:"", dueDate:"" });
  const [nf, setNf] = useState({ title:"", body:"", priority:"normal" });
  const [msg, setMsg] = useState("");
  const load = useCallback(async () => { const [u,c,n] = await Promise.all([fetch("/api/units").then(r=>r.json()),fetch("/api/charges").then(r=>r.json()),fetch("/api/notices").then(r=>r.json())]); setUnits(u); setCharges(c); setNotices(n); },[]);
  useEffect(()=>{ load(); },[load]);
  const toast=(m:string)=>{ setMsg(m); setTimeout(()=>setMsg(""),3000); };
  async function addUnit(e: React.FormEvent) { e.preventDefault(); await fetch("/api/units",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({number:uf.number,block:uf.block||undefined,ownerName:uf.ownerName,ownerPhone:uf.ownerPhone||undefined,ownerEmail:uf.ownerEmail||undefined})}); setUf({number:"",block:"",ownerName:"",ownerPhone:"",ownerEmail:""}); toast("Unidade cadastrada!"); load(); }
  async function addCharge(e: React.FormEvent) { e.preventDefault(); await fetch("/api/charges",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({unitId:Number(chf.unitId),type:chf.type,amount:Number(chf.amount),dueDate:new Date(chf.dueDate).toISOString()})}); setChf({unitId:"",type:"Condomínio",amount:"",dueDate:""}); toast("Cobrança criada!"); load(); }
  async function addNotice(e: React.FormEvent) { e.preventDefault(); await fetch("/api/notices",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(nf)}); setNf({title:"",body:"",priority:"normal"}); toast("Publicado!"); load(); }
  async function markPaid(id: number) { await fetch(`/api/charges/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:"paid",paidAt:new Date().toISOString()})}); load(); }
  const pending = charges.filter(c=>c.status==="pending");
  const totalPending = pending.reduce((s,c)=>s+c.amount,0);
  const paid = charges.filter(c=>c.status==="paid").reduce((s,c)=>s+c.amount,0);
  const S: Record<string,React.CSSProperties> = {
    shell:{display:"flex",minHeight:"100vh",fontFamily:"'Segoe UI',sans-serif",background:C.bg},
    sb:{width:230,background:C.sb,color:"#fff",display:"flex",flexDirection:"column"},
    logo:{padding:"1.5rem",borderBottom:"1px solid #075985"},
    main:{flex:1,padding:"2rem",color:C.text},
    card:{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"1.25rem"},
    sec:{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"1.25rem",marginBottom:"1rem"},
    sh:{fontSize:"0.9rem",fontWeight:600,marginBottom:"0.75rem",paddingBottom:"0.5rem",borderBottom:`1px solid ${C.border}`},
    form:{display:"flex",flexDirection:"column",gap:"0.6rem"},
    lbl:{fontSize:"0.77rem",fontWeight:600,color:C.muted,display:"block",marginBottom:"0.15rem"},
    inp:{width:"100%",padding:"0.5rem 0.7rem",background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,color:C.text,fontSize:"0.875rem",boxSizing:"border-box"},
    btn:{padding:"0.6rem 1.25rem",background:C.acc,color:"#fff",border:"none",borderRadius:7,fontWeight:700,cursor:"pointer"},
    table:{width:"100%",borderCollapse:"collapse",fontSize:"0.83rem"},
    th:{textAlign:"left",padding:"0.5rem",color:C.muted,fontSize:"0.72rem",textTransform:"uppercase",borderBottom:`1px solid ${C.border}`},
    td:{padding:"0.6rem 0.5rem",borderBottom:"1px solid #f0f9ff",color:C.text},
    badge:(col:string)=>({background:col+"22",color:col,fontSize:"0.7rem",fontWeight:600,padding:"2px 8px",borderRadius:20}),
    sbtn:(col:string)=>({padding:"3px 9px",background:col+"22",color:col,border:`1px solid ${col}44`,borderRadius:5,fontSize:"0.72rem",cursor:"pointer",fontWeight:600}),
    gr2:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem"},
    ta:{width:"100%",padding:"0.5rem 0.7rem",background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,color:C.text,fontSize:"0.875rem",boxSizing:"border-box",resize:"vertical",minHeight:"80px"},
  };
  const nb=(a:boolean):React.CSSProperties=>({display:"block",width:"100%",textAlign:"left",padding:"0.75rem 1.5rem",background:a?"#075985":"transparent",color:a?"#bae6fd":"#7dd3fc",border:"none",cursor:"pointer",fontSize:"0.875rem",borderLeft:a?"3px solid #38bdf8":"3px solid transparent"});
  const uLabel=(u:Unit)=>`Apt ${u.number}${u.block?" B"+u.block:""} — ${u.ownerName}`;
  return (
    <div style={S.shell}>
      <aside style={S.sb}>
        <div style={S.logo}><div style={{fontSize:"1.1rem",fontWeight:700,color:"#bae6fd"}}>🏢 Condomínio</div><div style={{fontSize:"0.72rem",color:"#7dd3fc",marginTop:"0.2rem"}}>Manager</div></div>
        <nav style={{flex:1}}>{([["dash","📊 Dashboard"],["units","🏠 Unidades"],["charges","💰 Cobranças"],["notices","📢 Comunicados"]] as const).map(([t,l])=>(<button key={t} style={nb(tab===t)} onClick={()=>setTab(t)}>{l}</button>))}</nav>
        <div style={{padding:"1rem 1.5rem",borderTop:"1px solid #075985",fontSize:"0.72rem",color:"#7dd3fc"}}>{units.length} unidades · {pending.length} pendentes</div>
      </aside>
      <main style={S.main}>
        {tab==="dash" && <>
          <h1 style={{fontSize:"1.4rem",fontWeight:700,marginBottom:"1.5rem"}}>Dashboard</h1>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1rem",marginBottom:"1.5rem"}}>
            {[[String(units.length),"Unidades"],[String(pending.length),"Cobranças pendentes"],["R$ "+totalPending.toFixed(0),"Valor em aberto"],["R$ "+paid.toFixed(0),"Arrecadado"]].map(([n,l])=>(
              <div key={l} style={S.card}><div style={{fontSize:"2rem",fontWeight:700,color:l.includes("aberto")&&totalPending>0?C.warn:C.acc}}>{n}</div><div style={{color:C.muted,fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"0.05em"}}>{l}</div></div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
            <div style={S.sec}><div style={S.sh}>Cobranças pendentes</div>{pending.slice(0,6).map(c=>(<div key={c.id} style={{display:"flex",justifyContent:"space-between",padding:"0.4rem 0",borderBottom:"1px solid #f0f9ff",fontSize:"0.875rem"}}><span><strong>Apt {c.unit.number}{c.unit.block?" B"+c.unit.block:""}</strong> — {c.type}</span><span style={{color:C.warn,fontWeight:700}}>R$ {c.amount.toFixed(2)}</span></div>))}{pending.length===0&&<p style={{color:C.muted,fontSize:"0.83rem"}}>Todas em dia.</p>}</div>
            <div style={S.sec}><div style={S.sh}>Comunicados recentes</div>{notices.slice(0,4).map(n=>(<div key={n.id} style={{padding:"0.5rem 0",borderBottom:"1px solid #f0f9ff"}}><div style={{fontWeight:600,fontSize:"0.875rem"}}>{n.title}</div><div style={{color:C.muted,fontSize:"0.78rem",marginTop:"0.1rem"}}>{n.body.slice(0,80)}{n.body.length>80?"...":""}</div></div>))}{notices.length===0&&<p style={{color:C.muted,fontSize:"0.83rem"}}>Nenhum comunicado.</p>}</div>
          </div>
        </>}
        {tab==="units" && <>
          <h1 style={{fontSize:"1.4rem",fontWeight:700,marginBottom:"1.5rem"}}>Unidades</h1>
          <div style={{display:"grid",gridTemplateColumns:"360px 1fr",gap:"1.5rem"}}>
            <div style={S.sec}><div style={S.sh}>Nova unidade</div>
              <form style={S.form} onSubmit={addUnit}>
                <div style={S.gr2}><div><label style={S.lbl}>Número</label><input style={S.inp} value={uf.number} onChange={e=>setUf(f=>({...f,number:e.target.value}))} placeholder="ex: 101" required/></div><div><label style={S.lbl}>Bloco</label><input style={S.inp} value={uf.block} onChange={e=>setUf(f=>({...f,block:e.target.value}))} placeholder="A, B (opcional)"/></div></div>
                <div><label style={S.lbl}>Proprietário</label><input style={S.inp} value={uf.ownerName} onChange={e=>setUf(f=>({...f,ownerName:e.target.value}))} required/></div>
                <div style={S.gr2}><div><label style={S.lbl}>Telefone</label><input style={S.inp} value={uf.ownerPhone} onChange={e=>setUf(f=>({...f,ownerPhone:e.target.value}))}/></div><div><label style={S.lbl}>E-mail</label><input style={S.inp} value={uf.ownerEmail} onChange={e=>setUf(f=>({...f,ownerEmail:e.target.value}))}/></div></div>
                <button style={S.btn}>Cadastrar</button>{msg&&<span style={{color:C.acc,fontWeight:600,fontSize:"0.83rem"}}>✓ {msg}</span>}
              </form>
            </div>
            <div style={S.sec}><div style={S.sh}>Unidades ({units.length})</div>
              <table style={S.table}><thead><tr><th style={S.th}>Apt</th><th style={S.th}>Bloco</th><th style={S.th}>Proprietário</th><th style={S.th}>Telefone</th></tr></thead>
              <tbody>{units.map(u=>(<tr key={u.id}><td style={S.td}><strong>{u.number}</strong></td><td style={S.td}>{u.block??"-"}</td><td style={S.td}>{u.ownerName}</td><td style={S.td}>{u.ownerPhone??"-"}</td></tr>))}</tbody></table>
            </div>
          </div>
        </>}
        {tab==="charges" && <>
          <h1 style={{fontSize:"1.4rem",fontWeight:700,marginBottom:"1.5rem"}}>Cobranças</h1>
          <div style={{display:"grid",gridTemplateColumns:"340px 1fr",gap:"1.5rem"}}>
            <div style={S.sec}><div style={S.sh}>Nova cobrança</div>
              <form style={S.form} onSubmit={addCharge}>
                <div><label style={S.lbl}>Unidade</label><select style={S.inp} value={chf.unitId} onChange={e=>setChf(f=>({...f,unitId:e.target.value}))} required><option value="">Selecione...</option>{units.map(u=><option key={u.id} value={u.id}>{uLabel(u)}</option>)}</select></div>
                <div><label style={S.lbl}>Tipo</label><select style={S.inp} value={chf.type} onChange={e=>setChf(f=>({...f,type:e.target.value}))}>{["Condomínio","Fundo de obras","Multa","Taxa extra","Água","Energia"].map(t=><option key={t}>{t}</option>)}</select></div>
                <div style={S.gr2}><div><label style={S.lbl}>Valor R$</label><input style={S.inp} type="number" step="0.01" value={chf.amount} onChange={e=>setChf(f=>({...f,amount:e.target.value}))} required/></div><div><label style={S.lbl}>Vencimento</label><input style={S.inp} type="date" value={chf.dueDate} onChange={e=>setChf(f=>({...f,dueDate:e.target.value}))} required/></div></div>
                <button style={S.btn}>Criar cobrança</button>{msg&&<span style={{color:C.acc,fontWeight:600,fontSize:"0.83rem"}}>✓ {msg}</span>}
              </form>
            </div>
            <div style={S.sec}><div style={S.sh}>Cobranças ({charges.length})</div>
              <table style={S.table}><thead><tr><th style={S.th}>Unidade</th><th style={S.th}>Tipo</th><th style={S.th}>Valor</th><th style={S.th}>Vencimento</th><th style={S.th}>Status</th><th style={S.th}></th></tr></thead>
              <tbody>{charges.map(c=>(<tr key={c.id}><td style={S.td}>Apt {c.unit.number}{c.unit.block?" B"+c.unit.block:""}</td><td style={S.td}>{c.type}</td><td style={S.td}>R$ {c.amount.toFixed(2)}</td><td style={S.td}>{new Date(c.dueDate).toLocaleDateString("pt-BR")}</td><td style={S.td}><span style={S.badge(SC[c.status]??"#888")}>{c.status}</span></td><td style={S.td}>{c.status==="pending"&&<button style={S.sbtn(C.ok)} onClick={()=>markPaid(c.id)}>Pago</button>}</td></tr>))}</tbody></table>
            </div>
          </div>
        </>}
        {tab==="notices" && <>
          <h1 style={{fontSize:"1.4rem",fontWeight:700,marginBottom:"1.5rem"}}>Comunicados</h1>
          <div style={{display:"grid",gridTemplateColumns:"360px 1fr",gap:"1.5rem"}}>
            <div style={S.sec}><div style={S.sh}>Novo comunicado</div>
              <form style={S.form} onSubmit={addNotice}>
                <div><label style={S.lbl}>Título</label><input style={S.inp} value={nf.title} onChange={e=>setNf(f=>({...f,title:e.target.value}))} required/></div>
                <div><label style={S.lbl}>Mensagem</label><textarea style={S.ta} value={nf.body} onChange={e=>setNf(f=>({...f,body:e.target.value}))} required/></div>
                <div><label style={S.lbl}>Prioridade</label><select style={S.inp} value={nf.priority} onChange={e=>setNf(f=>({...f,priority:e.target.value}))}><option value="normal">Normal</option><option value="high">Alta</option><option value="urgent">Urgente</option></select></div>
                <button style={S.btn}>Publicar</button>{msg&&<span style={{color:C.acc,fontWeight:600,fontSize:"0.83rem"}}>✓ {msg}</span>}
              </form>
            </div>
            <div style={S.sec}><div style={S.sh}>Comunicados ({notices.length})</div>
              {notices.map(n=>{const pc=n.priority==="urgent"?C.warn:n.priority==="high"?C.yellow:C.acc;return(<div key={n.id} style={{padding:"0.75rem",borderRadius:8,border:`1px solid ${pc}33`,background:pc+"11",marginBottom:"0.75rem"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:"0.3rem"}}><strong style={{fontSize:"0.875rem"}}>{n.title}</strong><span style={S.badge(pc)}>{n.priority}</span></div><p style={{fontSize:"0.83rem",margin:0,lineHeight:1.5}}>{n.body}</p><div style={{color:C.muted,fontSize:"0.75rem",marginTop:"0.3rem"}}>{new Date(n.createdAt).toLocaleDateString("pt-BR")}</div></div>);})}
              {notices.length===0&&<p style={{color:C.muted,fontSize:"0.83rem"}}>Nenhum comunicado.</p>}
            </div>
          </div>
        </>}
      </main>
    </div>
  );
}