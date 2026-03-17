import { useState, useEffect, useRef } from "react";

const USERS = ["Katkar", "Kenkre", "Samar", "Sharvil", "Dev", "Bhavik", "Hrishil"];
const COLORS = ["#e91e63","#9c27b0","#3f51b5","#00bcd4","#4caf50","#ff9800","#f44336"];

const TEAMS = { 
  galatasaray:{n:"Galatasaray",s:"GAL",c:["#FDB913","#A32638"],co:"TUR",eid:"432"},
  juventus:{n:"Juventus",s:"JUV",c:["#000000","#FFFFFF"],co:"ITA",eid:"111"},
  dortmund:{n:"B. Dortmund",s:"BVB",c:["#FDE100","#000000"],co:"GER",eid:"124"},
  atalanta:{n:"Atalanta",s:"ATA",c:["#1E71B8","#000000"],co:"ITA",eid:"105"},
  monaco:{n:"Monaco",s:"MON",c:["#E2001A","#FFFFFF"],co:"FRA",eid:"174"},
  psg:{n:"Paris SG",s:"PSG",c:["#004170","#DA291C"],co:"FRA",eid:"160"},
  benfica:{n:"Benfica",s:"BEN",c:["#FF0000","#FFFFFF"],co:"POR",eid:"219"},
  realmadrid:{n:"Real Madrid",s:"RMA",c:["#FFFFFF","#FEBE10"],co:"ESP",eid:"86"},
  qarabag:{n:"Qarabağ",s:"QAR",c:["#1C1C1C","#FF6600"],co:"AZE",eid:"10414"},
  newcastle:{n:"Newcastle",s:"NEW",c:["#241F20","#FFFFFF"],co:"ENG",eid:"361"},
  clubbrugge:{n:"Club Brugge",s:"BRU",c:["#0055A4","#000000"],co:"BEL",eid:"240"},
  atletico:{n:"Atlético",s:"ATM",c:["#CB3524","#272E61"],co:"ESP",eid:"1068"},
  bodoglimt:{n:"Bodø/Glimt",s:"BOD",c:["#FFD700","#000000"],co:"NOR",eid:"2980"},
  inter:{n:"Inter Milan",s:"INT",c:["#009BDB","#000000"],co:"ITA",eid:"110"},
  olympiacos:{n:"Olympiacos",s:"OLY",c:["#CC0000","#FFFFFF"],co:"GRE",eid:"201"},
  leverkusen:{n:"Leverkusen",s:"LEV",c:["#E32221","#000000"],co:"GER",eid:"131"},
  arsenal:{n:"Arsenal",s:"ARS",c:["#EF0107","#FFFFFF"],co:"ENG",eid:"359"},
  barcelona:{n:"Barcelona",s:"BAR",c:["#A50044","#004D98"],co:"ESP",eid:"83"},
  bayern:{n:"Bayern München",s:"BAY",c:["#DC052D","#FFFFFF"],co:"GER",eid:"132"},
  chelsea:{n:"Chelsea",s:"CHE",c:["#034694","#FFFFFF"],co:"ENG",eid:"363"},
  liverpool:{n:"Liverpool",s:"LIV",c:["#C8102E","#FFFFFF"],co:"ENG",eid:"364"},
  mancity:{n:"Man City",s:"MCI",c:["#6CABDD","#FFFFFF"],co:"ENG",eid:"382"},
  sportingcp:{n:"Sporting CP",s:"SCP",c:["#006847","#FFFFFF"],co:"POR",eid:"228"},
  tottenham:{n:"Tottenham",s:"TOT",c:["#132257","#FFFFFF"],co:"ENG",eid:"367"},
};

const INIT_MATCHES = [
  {id:"kp1_1",home:"galatasaray",away:"juventus",date:"2026-02-17",time:"21:00",stage:"KO Playoffs · Leg 1",status:"upcoming",hs:null,as:null,gs:[]},
  {id:"kp1_2",home:"dortmund",away:"atalanta",date:"2026-02-17",time:"21:00",stage:"KO Playoffs · Leg 1",status:"upcoming",hs:null,as:null,gs:[]},
  {id:"kp1_3",home:"monaco",away:"psg",date:"2026-02-17",time:"21:00",stage:"KO Playoffs · Leg 1",status:"upcoming",hs:null,as:null,gs:[]},
  {id:"kp1_4",home:"benfica",away:"realmadrid",date:"2026-02-17",time:"21:00",stage:"KO Playoffs · Leg 1",status:"upcoming",hs:null,as:null,gs:[]},
  {id:"kp1_5",home:"qarabag",away:"newcastle",date:"2026-02-18",time:"18:45",stage:"KO Playoffs · Leg 1",status:"upcoming",hs:null,as:null,gs:[]},
  {id:"kp1_6",home:"clubbrugge",away:"atletico",date:"2026-02-18",time:"21:00",stage:"KO Playoffs · Leg 1",status:"upcoming",hs:null,as:null,gs:[]},
  {id:"kp1_7",home:"bodoglimt",away:"inter",date:"2026-02-18",time:"21:00",stage:"KO Playoffs · Leg 1",status:"upcoming",hs:null,as:null,gs:[]},
  {id:"kp1_8",home:"olympiacos",away:"leverkusen",date:"2026-02-18",time:"21:00",stage:"KO Playoffs · Leg 1",status:"upcoming",hs:null,as:null,gs:[]},
];

const logoUrl = (k) => `https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/${TEAMS[k]?.eid}.png&w=80&h=80`;

const TeamBadge = ({k, sz=36}) => {
  const [err, setErr] = useState(false);
  const t = TEAMS[k];
  if (!t) return null;
  if (err) return (
    <div style={{width:sz,height:sz,borderRadius:"50%",background:`linear-gradient(135deg,${t.c[0]},${t.c[1]})`,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid rgba(255,255,255,0.1)",flexShrink:0}}>
      <span style={{color:["#000000","#241F20","#1C1C1C","#004170","#034694","#132257"].includes(t.c[0])?"#fff":"#000",fontSize:sz*0.25,fontWeight:800}}>{t.s}</span>
    </div>
  );
  return <img src={logoUrl(k)} alt={t.s} onError={()=>setErr(true)} style={{width:sz,height:sz,borderRadius:"50%",objectFit:"contain",background:"rgba(255,255,255,0.9)",border:"2px solid rgba(255,255,255,0.12)",flexShrink:0}} />;
};

const fmtDate = d => new Date(d+"T00:00:00").toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"});

const callAPI = async (msgs, useSearch = false) => {
  // Separate system message from user messages
  const systemMsgs = msgs.filter(m => m.role === "system");
  const userMsgs = msgs.filter(m => m.role !== "system");
  
  const body = { 
    model: "claude-sonnet-4-20250514", 
    max_tokens: 1000, 
    messages: userMsgs
  };
  if (systemMsgs.length) body.system = systemMsgs.map(m => m.content).join("\n");
  if (useSearch) body.tools = [{ type: "web_search_20250305", name: "web_search" }];
  
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`API ${res.status}: ${errBody.slice(0, 200)}`);
  }
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || "API error");
  
  // Extract all text blocks from response (web search returns multiple blocks)
  const textParts = data.content.filter(b => b.type === "text").map(b => b.text);
  if (!textParts.length) throw new Error("No text in API response");
  return textParts.join("\n");
};

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("matches");
  const [matches, setMatches] = useState(INIT_MATCHES);
  const [preds, setPreds] = useState({});
  const [squads, setSquads] = useState({});
  const [selMatch, setSelMatch] = useState(null);
  const [ep, setEp] = useState(null); // editing prediction
  const [scorers, setScorers] = useState([]);
  const [search, setSearch] = useState("");
  const [showDrop, setShowDrop] = useState(false);
  const [showAll, setShowAll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [squadLoading, setSquadLoading] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState(null);
  const [apiLog, setApiLog] = useState("");
  const [testResult, setTestResult] = useState(null);
  // Clean up test
  const clearTest = () => setTestResult(null);

  // ── Run scoring test simulation ──
  const runTestSimulation = () => {
    const testMatch = {
      id: "test_sim", home: "realmadrid", away: "juventus",
      date: "2026-01-01", time: "20:00", stage: "🧪 TEST",
      status: "finished", hs: 3, as: 1,
      gs: [{name:"Mbappé",team:"realmadrid",goals:2},{name:"Bellingham",team:"realmadrid",goals:1},{name:"Vlahovic",team:"juventus",goals:1}]
    };
    const tp = {
      "Katkar": {winner:"realmadrid",hs:"3",as:"1",scorers:[{name:"Mbappé",team:"realmadrid",goals:2},{name:"Bellingham",team:"realmadrid",goals:1},{name:"Vlahovic",team:"juventus",goals:1}]},
      "Kenkre": {winner:"realmadrid",hs:"3",as:"1",scorers:[{name:"Mbappé",team:"realmadrid",goals:2},{name:"Vinícius",team:"realmadrid",goals:1},{name:"Vlahovic",team:"juventus",goals:1}]},
      "Samar": {winner:"realmadrid",hs:"2",as:"0",scorers:[{name:"Mbappé",team:"realmadrid",goals:1},{name:"Vinícius",team:"realmadrid",goals:1}]},
      "Sharvil": {winner:"juventus",hs:"1",as:"2",scorers:[{name:"Vlahovic",team:"juventus",goals:1},{name:"Yildiz",team:"juventus",goals:2}]},
      "Dev": {winner:"draw",hs:"2",as:"2",scorers:[{name:"Mbappé",team:"realmadrid",goals:1},{name:"Bellingham",team:"realmadrid",goals:1},{name:"Vlahovic",team:"juventus",goals:1},{name:"Yildiz",team:"juventus",goals:1}]},
      "Bhavik": {winner:"realmadrid",hs:"2",as:"1",scorers:[{name:"Mbappé",team:"realmadrid",goals:1},{name:"Bellingham",team:"realmadrid",goals:1},{name:"Vlahovic",team:"juventus",goals:1}]},
      "Hrishil": {winner:"realmadrid",hs:"3",as:"1",scorers:[{name:"Vinícius",team:"realmadrid",goals:2},{name:"Rodrygo",team:"realmadrid",goals:1},{name:"Yildiz",team:"juventus",goals:1}]},
    };
    const results = USERS.map(u => ({user:u, pred:tp[u], pts:calcPts(tp[u], testMatch)}));
    setTestResult({match:testMatch, results});
  };

  const [adminEdit, setAdminEdit] = useState({});
  const [fetchingMatches, setFetchingMatches] = useState(false);
  const [addingManual, setAddingManual] = useState(false);
  const [manualMatch, setManualMatch] = useState({home:"",away:"",date:"",time:"21:00",stage:""});

  // ── Fetch upcoming matches from web ──
  const fetchUpcomingMatches = async () => {
    setFetchingMatches(true);
    setApiLog("Searching for upcoming UCL fixtures...");
    try {
      const existingIds = matches.map(m => `${m.home}_${m.away}_${m.date}`);
      const txt = await callAPI([{
        role: "user",
        content: `Search for ALL upcoming UEFA Champions League 2025-26 fixtures that haven't been played yet. Include knockout playoffs (Feb 24-25 second legs), round of 16, quarter-finals, semi-finals, and final. Return ONLY a JSON array of match objects like:
[{"home":"Team Name","away":"Team Name","date":"2026-02-24","time":"21:00","stage":"Knockout Playoffs · Leg 2"}]
Use exact team names from this list: ${Object.values(TEAMS).map(t=>t.n).join(", ")}. Include the stage name (e.g. "Knockout Playoffs · Leg 2", "Round of 16 · Leg 1", "Quarter-Final · Leg 1", etc). Return ONLY the JSON array.`
      }], true);
      setApiLog("Parsing fixtures...");
      const clean = txt.replace(/```json|```/g, "").trim();
      const jsonMatch = clean.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error("No fixtures data found");
      const fixtures = JSON.parse(jsonMatch[0]);
      
      // Map team names to keys
      const nameToKey = {};
      Object.entries(TEAMS).forEach(([k,v]) => {
        nameToKey[v.n.toLowerCase()] = k;
        nameToKey[v.s.toLowerCase()] = k;
        // Handle variations
        const words = v.n.toLowerCase().split(" ");
        words.forEach(w => { if (w.length > 3) nameToKey[w] = k; });
      });
      
      let added = 0;
      const newMatches = [...matches];
      fixtures.forEach((f, idx) => {
        // Find team keys
        let homeKey = null, awayKey = null;
        Object.entries(nameToKey).forEach(([name, key]) => {
          if (f.home?.toLowerCase().includes(name) || name.includes(f.home?.toLowerCase()?.split(" ")[0])) homeKey = homeKey || key;
          if (f.away?.toLowerCase().includes(name) || name.includes(f.away?.toLowerCase()?.split(" ")[0])) awayKey = awayKey || key;
        });
        
        if (homeKey && awayKey && TEAMS[homeKey] && TEAMS[awayKey]) {
          const dedupId = `${homeKey}_${awayKey}_${f.date}`;
          if (!existingIds.includes(dedupId)) {
            existingIds.push(dedupId);
            newMatches.push({
              id: `auto_${Date.now()}_${idx}`,
              home: homeKey,
              away: awayKey,
              date: f.date || "2026-03-01",
              time: f.time || "21:00",
              stage: f.stage || "Champions League",
              status: "upcoming",
              hs: null, as: null, gs: []
            });
            added++;
          }
        }
      });
      
      if (added > 0) {
        // Sort by date
        newMatches.sort((a,b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
        save(SKEY.matches, newMatches, setMatches);
        flash(`Added ${added} new match${added>1?"es":""}!`);
      } else {
        flash("No new matches found (all already added)", "err");
      }
      setApiLog("");
    } catch(e) {
      console.error("Match fetch error:", e);
      flash("Failed: " + e.message, "err");
      setApiLog("");
    }
    setFetchingMatches(false);
  };

  // ── Add match manually ──
  const addManualMatch = () => {
    const {home, away, date, time, stage} = manualMatch;
    if (!home || !away || !date) { flash("Select both teams and date", "err"); return; }
    if (home === away) { flash("Teams can't be the same!", "err"); return; }
    const dedupId = `${home}_${away}_${date}`;
    if (matches.find(m => `${m.home}_${m.away}_${m.date}` === dedupId)) { flash("Match already exists!", "err"); return; }
    const newMatch = { id: `man_${Date.now()}`, home, away, date, time: time || "21:00", stage: stage || "Champions League", status: "upcoming", hs: null, as: null, gs: [] };
    const newMatches = [...matches, newMatch].sort((a,b) => a.date.localeCompare(b.date));
    save(SKEY.matches, newMatches, setMatches);
    setManualMatch({home:"",away:"",date:"",time:"21:00",stage:""});
    setAddingManual(false);
    flash("Match added!");
  };

  // ── Delete match (admin) ──
  const deleteMatch = (mid) => {
    const m = matches.find(x=>x.id===mid);
    if (!m) return;
    // Remove related predictions too
    const newPreds = {...preds};
    USERS.forEach(u => { delete newPreds[pk(mid, u)]; });
    const newMatches = matches.filter(x=>x.id!==mid);
    save(SKEY.matches, newMatches, setMatches);
    save(SKEY.preds, newPreds, setPreds);
    flash(`${TEAMS[m.home].s} vs ${TEAMS[m.away].s} removed`);
  };
  const [admSrch, setAdmSrch] = useState({});
  const dropRef = useRef(null);

  useEffect(() => { init(); }, []);
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setShowDrop(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const flash = (m, t="ok") => { setToast({m,t}); setTimeout(()=>setToast(null), 3000); };

  const init = async () => {
    // Load persisted data from SHARED storage (so all friends see same data)
    try { const r = await window.storage.get("ucl_shared_preds", true); if(r) setPreds(JSON.parse(r.value)); } catch(e){}
    try { const r = await window.storage.get("ucl_shared_matches", true); if(r) setMatches(JSON.parse(r.value)); } catch(e){}
    try { const r = await window.storage.get("ucl_shared_squads", true); if(r) setSquads(JSON.parse(r.value)); } catch(e){}
    setLoading(false);
  };

  const save = async (k, v, fn) => { fn(v); try { await window.storage.set(k, JSON.stringify(v), true); } catch(e){} };
  const pk = (mid, u) => `${mid}_${u}`;

  // Storage keys (all shared)
  const SKEY = { preds: "ucl_shared_preds", matches: "ucl_shared_matches", squads: "ucl_shared_squads" };

  // ── Fetch squad (WITH web search for accurate current data) ──
  const fetchSquad = async (teamKey) => {
    if (squads[teamKey]?.length) return squads[teamKey];
    if (squadLoading[teamKey]) return [];
    setSquadLoading(p => ({...p, [teamKey]: true}));
    try {
      const t = TEAMS[teamKey];
      // Step 1: Use API with web search to get current squad
      const txt = await callAPI([{
        role: "system",
        content: "You MUST use the web_search tool to find the answer. Do NOT answer from memory. Search the web first, then respond."
      },{
        role: "user",
        content: `Use web search to look up: "${t.n} squad 2025-26 season players"

Search ESPN or Transfermarkt for their CURRENT squad as of February 2026. 

IMPORTANT: You MUST search the web. Do NOT use your training data — it may be outdated.

After searching, return ONLY a JSON array of player LAST NAMES (surnames only) who are currently registered for the 2025-26 season. Include 20-25 first-team players (no youth/academy). 

Format: ["Surname1","Surname2","Surname3"]
Return ONLY the raw JSON array. No markdown. No backticks. No explanation.`
      }], true);
      
      const clean = txt.replace(/```json|```/g, "").trim();
      const jsonMatch = clean.match(/\[[\s\S]*?\]/);
      if (!jsonMatch) throw new Error("Could not parse squad data");
      const arr = JSON.parse(jsonMatch[0]);
      if (!arr.length || arr.length < 5) throw new Error("Squad too small: " + arr.length);
      
      // Validate: all entries should be strings
      const valid = arr.filter(x => typeof x === "string" && x.length > 1);
      if (valid.length < 5) throw new Error("Not enough valid player names");
      
      const ns = {...squads, [teamKey]: valid};
      setSquads(ns);
      try { await window.storage.set(SKEY.squads, JSON.stringify(ns), true); } catch(e){}
      setSquadLoading(p => ({...p, [teamKey]: false}));
      return valid;
    } catch(e) {
      console.error("Squad error for " + teamKey + ":", e);
      setSquadLoading(p => ({...p, [teamKey]: false}));
      flash(`${TEAMS[teamKey].s} squad failed: ${e.message}`, "err");
      return [];
    }
  };

  // Force refresh a squad (bypass cache)
  const refreshSquad = async (teamKey) => {
    const ns = {...squads};
    delete ns[teamKey];
    setSquads(ns);
    try { await window.storage.set("ucl9_squads", JSON.stringify(ns)); } catch(e){}
    // Small delay before re-fetching
    await new Promise(r => setTimeout(r, 500));
    return fetchSquad(teamKey);
  };

  // ── Fetch live scores (WITH web search) ──
  const fetchScores = async () => {
    setRefreshing(true);
    setApiLog("Searching for live scores...");
    try {
      const pending = matches.filter(m => m.status !== "finished");
      if (!pending.length) { flash("All matches already have results!"); setRefreshing(false); return; }
      const list = pending.map(m => `${TEAMS[m.home].n} vs ${TEAMS[m.away].n}`).join(", ");
      const txt = await callAPI([{
        role: "user",
        content: `Search for today's UEFA Champions League 2025-26 knockout playoff scores (February 17-18, 2026). Matches: ${list}. Return ONLY a JSON array with objects like: {"home":"Team Name","away":"Team Name","homeScore":0,"awayScore":0,"status":"finished","scorers":["Lastname"]}. If match hasn't started, use status "upcoming" with null scores. ONLY return the JSON array, no other text.`
      }], true);
      setApiLog("Parsing response...");
      const clean = txt.replace(/```json|```/g, "").trim();
      const jsonMatch = clean.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error("No JSON found in response");
      const results = JSON.parse(jsonMatch[0]);
      let updated = 0;
      const newMatches = matches.map(m => {
        const ho = TEAMS[m.home], aw = TEAMS[m.away];
        const r = results.find(x =>
          (ho.n.toLowerCase().includes(x.home?.toLowerCase().split(" ")[0]) || x.home?.toLowerCase().includes(ho.n.toLowerCase().split(" ")[0])) &&
          (aw.n.toLowerCase().includes(x.away?.toLowerCase().split(" ")[0]) || x.away?.toLowerCase().includes(aw.n.toLowerCase().split(" ")[0]))
        );
        if (r && r.homeScore !== null && r.homeScore !== undefined && r.status !== "upcoming") {
          updated++;
          return {...m, hs: r.homeScore, as: r.awayScore, status: r.status || "finished",
            gs: (r.scorers || []).map(s => typeof s === "string" ? {name:s,team:"unknown",goals:1} : s)};
        }
        return m;
      });
      save("ucl4_matches", newMatches, setMatches);
      flash(updated > 0 ? `Updated ${updated} match(es)!` : "No new scores found yet");
      setApiLog("");
    } catch(e) {
      console.error("Score fetch error:", e);
      flash("Score fetch failed: " + e.message, "err");
      setApiLog("Error: " + e.message);
    }
    setRefreshing(false);
  };

  const [squadTab, setSquadTab] = useState(null); // "home" or "away"

  // ── Open prediction panel ──
  const openPred = async (match) => {
    setEp({winner:"",hs:"",as:""});
    setScorers([]);
    setSearch("");
    setShowAll(null);
    setSelMatch(match.id);
    setSquadTab("home");
    // Fetch squads SEQUENTIALLY to avoid rate limits
    await fetchSquad(match.home);
    // Small delay between calls
    await new Promise(r => setTimeout(r, 500));
    await fetchSquad(match.away);
  };

  // Auto-derive winner from score
  const setScore = (field, val) => {
    const next = {...ep, [field]: val};
    const h = field==="hs" ? val : ep.hs;
    const a = field==="as" ? val : ep.as;
    if (h !== "" && a !== "") {
      const hi = parseInt(h), ai = parseInt(a);
      if (!isNaN(hi) && !isNaN(ai)) {
        const m = matches.find(x=>x.id===selMatch);
        if (hi > ai) next.winner = m.home;
        else if (ai > hi) next.winner = m.away;
        else next.winner = "draw";
      }
    }
    setEp(next);
  };

  // Auto-adjust score when winner is picked
  const setWinner = (w, m) => {
    const next = {...ep, winner: w};
    const h = parseInt(ep.hs), a = parseInt(ep.as);
    if (!isNaN(h) && !isNaN(a)) {
      if (w === m.home && h <= a) { next.hs = String(a + 1); }
      else if (w === m.away && a <= h) { next.as = String(h + 1); }
      else if (w === "draw" && h !== a) { next.as = String(h); }
    }
    setEp(next);
  };

  // Validate prediction consistency
  const getTotalGoals = () => {
    if (!ep || ep.hs==="" || ep.as==="") return null;
    const h = parseInt(ep.hs), a = parseInt(ep.as);
    if (isNaN(h) || isNaN(a)) return null;
    return h + a;
  };

  const getScorerGoals = () => scorers.reduce((sum, s) => sum + s.goals, 0);

  const isPredValid = () => {
    if (!ep || !ep.winner || ep.hs==="" || ep.as==="") return false;
    const h = parseInt(ep.hs), a = parseInt(ep.as);
    if (isNaN(h) || isNaN(a)) return false;
    const m = matches.find(x=>x.id===selMatch);
    if (ep.winner === m.home && h <= a) return false;
    if (ep.winner === m.away && a <= h) return false;
    if (ep.winner === "draw" && h !== a) return false;
    const total = h + a;
    if (total === 0) return true; // 0-0 needs no scorers
    if (getScorerGoals() !== total) return false;
    return true;
  };

  const getScoreError = () => {
    if (!ep || ep.hs==="" || ep.as==="" || !ep.winner) return null;
    const h = parseInt(ep.hs), a = parseInt(ep.as);
    if (isNaN(h) || isNaN(a)) return null;
    const m = matches.find(x=>x.id===selMatch);
    if (ep.winner === m.home && h <= a) return `${TEAMS[m.home].s} is winner but score shows otherwise`;
    if (ep.winner === m.away && a <= h) return `${TEAMS[m.away].s} is winner but score shows otherwise`;
    if (ep.winner === "draw" && h !== a) return "Draw selected but scores aren't equal";
    return null;
  };

  const getScorerError = () => {
    const total = getTotalGoals();
    if (total === null || total === 0) return null;
    const picked = getScorerGoals();
    if (picked < total) return `Need ${total - picked} more goal${total-picked>1?"s":""} · ${picked}/${total} assigned`;
    if (picked > total) return `Too many goals! ${picked}/${total} assigned · remove ${picked - total}`;
    return null;
  };

  const addScorer = (name, team) => {
    const ex = scorers.find(s => s.name === name && s.team === team);
    if (ex) setScorers(scorers.map(s => s.name===name&&s.team===team ? {...s,goals:s.goals+1} : s));
    else setScorers([...scorers, {name, team, goals:1}]);
    setSearch(""); setShowDrop(false);
  };

  const submitPred = (mid) => {
    if (!ep?.winner || ep.hs==="" || ep.as==="") return;
    if (preds[pk(mid,user)]) { flash("Already submitted!", "err"); return; }
    const np = {...preds, [pk(mid,user)]: {...ep, scorers, user, matchId:mid, at:new Date().toISOString()}};
    save(SKEY.preds, np, setPreds);
    setEp(null); setScorers([]); setSelMatch(null);
    flash("🔒 Prediction locked!");
  };

  const calcPts = (pred, m) => {
    if (m.hs === null) return null;
    const pH=+pred.hs||0, pA=+pred.as||0, aH=m.hs, aA=m.as;
    let pts=0, gotR=false, gotS=false, sPts=0;
    const pR=pH>pA?"H":pH<pA?"A":"D", aR=aH>aA?"H":aH<aA?"A":"D";
    if (pR===aR) { pts+=1; gotR=true; }
    if (pH===aH && pA===aA) { pts+=2; gotS=true; }
    if (pred.scorers?.length && m.gs?.length) {
      pred.scorers.forEach(ps => {
        const found = m.gs.find(as => {
          const pn = ps.name.toLowerCase(), an = (as.name||"").toLowerCase();
          return pn.includes(an) || an.includes(pn) || pn.split(" ").pop() === an.split(" ").pop();
        });
        if (found) sPts += 1;
      });
      pts += sPts;
    }
    const slam = gotR && gotS && sPts > 0;
    if (slam) pts *= 2;
    return {pts, gotR, gotS, sPts, slam};
  };

  const leaderboard = () => USERS.map(u => {
    let tot=0, slams=0, played=0;
    matches.forEach(m => {
      const p = preds[pk(m.id,u)];
      if (p && m.hs!==null) { played++; const r=calcPts(p,m); if(r){tot+=r.pts;if(r.slam)slams++;} }
    });
    return {user:u, tot, slams, played, cnt:matches.filter(m=>preds[pk(m.id,u)]).length};
  }).sort((a,b)=>b.tot-a.tot||b.slams-a.slams);

  // ── Helpers ──
  const allPlayers = (mid) => {
    const m = matches.find(x=>x.id===mid);
    if(!m) return [];
    return [...(squads[m.home]||[]).map(n=>({name:n,team:m.home})), ...(squads[m.away]||[]).map(n=>({name:n,team:m.away}))];
  };

  const ss = {
    bg: "linear-gradient(180deg,#0a0e27,#131730,#0d1025)",
    card: {background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:12,padding:"12px 14px",cursor:"pointer",transition:"all 0.15s"},
    inp: {background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,color:"#fff",outline:"none",boxSizing:"border-box"},
    btn: {background:"linear-gradient(135deg,#1a237e,#3f51b5)",border:"none",borderRadius:8,color:"#fff",fontWeight:700,cursor:"pointer"},
  };

  if (loading) return <div style={{minHeight:"100vh",background:ss.bg,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12,fontFamily:"system-ui"}}><style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style><div style={{fontSize:40}}>⚽</div><div style={{color:"#7986cb",fontSize:13}}>Loading...</div></div>;

  // ── Login Screen ──
  if (!user) return (
    <div style={{minHeight:"100vh",background:ss.bg,fontFamily:"'Segoe UI',system-ui",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{textAlign:"center",marginBottom:36}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:6}}>
          <div style={{width:3,height:24,background:"linear-gradient(180deg,#1a237e,#3f51b5)",borderRadius:2}}/>
          <span style={{fontSize:9,fontWeight:700,letterSpacing:4,color:"#5c6bc0"}}>UEFA CHAMPIONS LEAGUE</span>
          <div style={{width:3,height:24,background:"linear-gradient(180deg,#3f51b5,#1a237e)",borderRadius:2}}/>
        </div>
        <h1 style={{color:"#fff",fontSize:32,fontWeight:800,margin:"6px 0 2px",letterSpacing:-1}}>PREDICTOR</h1>
        <p style={{color:"#7986cb",fontSize:12,margin:0}}>2025/26 · Knockout Phase</p>
      </div>
      <div style={{width:"100%",maxWidth:340}}>
        <p style={{color:"#9fa8da",fontSize:11,textAlign:"center",marginBottom:10}}>Who's predicting?</p>
        {USERS.map((u,i) => (
          <button key={u} onClick={()=>setUser(u)} style={{width:"100%",padding:"11px 14px",background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:10,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:10,marginBottom:4,animation:`fadeIn 0.25s ease ${i*0.04}s both`,transition:"all 0.15s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#3f51b5";e.currentTarget.style.background="rgba(63,81,181,0.12)"}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.05)";e.currentTarget.style.background="rgba(255,255,255,0.025)"}}>
            <div style={{width:30,height:30,borderRadius:"50%",background:COLORS[i],display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{u[0]}</div>
            {u}
          </button>
        ))}
      </div>
    </div>
  );

  const grouped = {};
  matches.forEach(m => { if(!grouped[m.date]) grouped[m.date]=[]; grouped[m.date].push(m); });

  return (
    <div style={{minHeight:"100vh",background:ss.bg,fontFamily:"'Segoe UI',system-ui",color:"#fff"}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}input[type=number]{-moz-appearance:textfield}`}</style>

      {toast && <div style={{position:"fixed",top:14,left:"50%",transform:"translateX(-50%)",zIndex:1e3,padding:"8px 18px",borderRadius:8,background:toast.t==="err"?"rgba(244,67,54,0.95)":"rgba(63,81,181,0.95)",color:"#fff",fontSize:12,fontWeight:600,boxShadow:"0 4px 16px rgba(0,0,0,0.3)",animation:"fadeIn 0.2s ease"}}>{toast.m}</div>}

      {/* Header */}
      <div style={{background:"linear-gradient(180deg,rgba(26,35,126,0.3),transparent)",borderBottom:"1px solid rgba(255,255,255,0.04)",padding:"10px 16px",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(20px)"}}>
        <div style={{maxWidth:560,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:9,fontWeight:700,letterSpacing:3,color:"#5c6bc0"}}>UCL</span>
            <div style={{width:1,height:12,background:"rgba(255,255,255,0.12)"}}/>
            <span style={{fontSize:13,fontWeight:800}}>PREDICTOR</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{background:"rgba(63,81,181,0.2)",borderRadius:14,padding:"3px 10px",fontSize:11,fontWeight:600,color:"#9fa8da"}}>{user}</div>
            <button onClick={()=>setUser(null)} style={{background:"none",border:"none",color:"#5c6bc0",cursor:"pointer",fontSize:10,padding:"3px 5px"}}>Switch</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{maxWidth:560,margin:"0 auto",padding:"8px 16px 0",display:"flex",gap:2}}>
        {["matches","leaderboard","admin"].map(t=>(
          <button key={t} onClick={()=>setView(t)} style={{flex:1,padding:"8px 0",background:view===t?"rgba(63,81,181,0.12)":"transparent",border:"none",borderBottom:view===t?"2px solid #3f51b5":"2px solid transparent",color:view===t?"#fff":"#5c6bc0",fontSize:11,fontWeight:600,cursor:"pointer",borderRadius:"5px 5px 0 0",textTransform:"capitalize"}}>{t}</button>
        ))}
      </div>

      <div style={{maxWidth:560,margin:"0 auto",padding:14}}>

        {/* ━━━ MATCHES ━━━ */}
        {view==="matches" && <div>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:10}}>
            <button onClick={fetchScores} disabled={refreshing} style={{padding:"5px 12px",background:"rgba(76,175,80,0.12)",border:"1px solid rgba(76,175,80,0.25)",borderRadius:6,color:"#4caf50",fontSize:10,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
              {refreshing ? <><div style={{width:12,height:12,border:"2px solid rgba(76,175,80,0.2)",borderTopColor:"#4caf50",borderRadius:"50%",animation:"spin 0.5s linear infinite"}}/> Fetching...</> : "🔄 Refresh Scores"}
            </button>
          </div>
          {apiLog && <div style={{fontSize:10,color:"#7986cb",textAlign:"center",marginBottom:8,animation:"fadeIn 0.2s"}}>{apiLog}</div>}

          {Object.entries(grouped).map(([date, dayMs])=>(
            <div key={date} style={{marginBottom:18}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                <div style={{width:3,height:3,borderRadius:"50%",background:"#3f51b5"}}/>
                <span style={{fontSize:10,fontWeight:700,letterSpacing:2,color:"#7986cb"}}>{fmtDate(date)}</span>
                <div style={{flex:1,height:1,background:"rgba(255,255,255,0.04)"}}/>
              </div>

              {dayMs.map(m => {
                const ho=TEAMS[m.home],aw=TEAMS[m.away];
                const myP=preds[pk(m.id,user)];
                const cnt=USERS.filter(u=>preds[pk(m.id,u)]).length;
                const open=selMatch===m.id;
                const pts=myP&&m.hs!==null?calcPts(myP,m):null;

                return <div key={m.id} style={{marginBottom:5}}>
                  <div onClick={()=>{
                    if(open){setSelMatch(null);setEp(null);setShowAll(null);}
                    else if(!myP&&m.status==="upcoming") openPred(m);
                    else {setSelMatch(m.id);setShowAll(m.id);}
                  }} style={{...ss.card, borderRadius:open?"12px 12px 0 0":12, borderColor:open?"rgba(63,81,181,0.2)":"rgba(255,255,255,0.05)"}}>
                    {/* Match header */}
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                      <span style={{fontSize:8,color:"#5c6bc0",fontWeight:600,letterSpacing:1}}>{m.stage}</span>
                      <span style={{fontSize:8,fontWeight:700,color:m.status==="live"?"#4caf50":m.status==="finished"?"#ff9800":"#5c6bc0"}}>
                        {m.status==="live"?"● LIVE":m.status==="finished"?"FT":m.time+" CET"}
                      </span>
                    </div>
                    {/* Teams + Score */}
                    <div style={{display:"flex",alignItems:"center"}}>
                      <div style={{display:"flex",alignItems:"center",gap:7,flex:1,minWidth:0}}>
                        <TeamBadge k={m.home} sz={34}/>
                        <div style={{overflow:"hidden"}}><div style={{fontSize:13,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ho.n}</div><div style={{fontSize:8,color:"#7986cb"}}>{ho.co}</div></div>
                      </div>
                      <div style={{padding:"0 8px",textAlign:"center",flexShrink:0,minWidth:50}}>
                        {m.hs!==null ? <div style={{fontSize:20,fontWeight:800,letterSpacing:2}}>{m.hs} – {m.as}</div> : <div style={{fontSize:11,color:"#5c6bc0",fontWeight:600}}>vs</div>}
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:7,flex:1,justifyContent:"flex-end",minWidth:0,textAlign:"right"}}>
                        <div style={{overflow:"hidden"}}><div style={{fontSize:13,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{aw.n}</div><div style={{fontSize:8,color:"#7986cb"}}>{aw.co}</div></div>
                        <TeamBadge k={m.away} sz={34}/>
                      </div>
                    </div>
                    {/* Status bar */}
                    <div style={{marginTop:7,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      {myP ? <div style={{fontSize:9,display:"flex",alignItems:"center",gap:5}}>
                        <span style={{color:"#4caf50"}}>🔒 {TEAMS[myP.winner]?.s||"DRAW"} {myP.hs}–{myP.as}</span>
                        {pts && <span style={{background:pts.slam?"rgba(255,215,0,0.15)":pts.pts>0?"rgba(76,175,80,0.15)":"rgba(255,255,255,0.04)",padding:"1px 5px",borderRadius:4,fontWeight:700,fontSize:9,color:pts.slam?"#ffd700":pts.pts>0?"#4caf50":"#5c6bc0"}}>{pts.slam?"🏆 ":""}+{pts.pts}</span>}
                      </div> : <span style={{fontSize:9,color:"#ff9800"}}>⚡ Tap to predict</span>}
                      <span style={{fontSize:9,color:"#5c6bc0"}}>{cnt}/{USERS.length}</span>
                    </div>
                  </div>

                  {/* ── Expanded ── */}
                  {open && <div style={{background:"rgba(26,35,126,0.06)",border:"1px solid rgba(63,81,181,0.15)",borderTop:"none",borderRadius:"0 0 12px 12px",padding:12}}>
                    <div style={{display:"flex",gap:4,marginBottom:12}}>
                      {!myP&&m.status==="upcoming" && <button onClick={e=>{e.stopPropagation();setShowAll(null);}} style={{flex:1,padding:6,background:showAll!==m.id?"rgba(63,81,181,0.2)":"rgba(255,255,255,0.03)",border:"1px solid rgba(63,81,181,0.15)",borderRadius:5,color:"#fff",fontSize:10,fontWeight:600,cursor:"pointer"}}>✏️ Predict</button>}
                      <button onClick={e=>{e.stopPropagation();setShowAll(showAll===m.id?null:m.id);setEp(null);}} style={{flex:1,padding:6,background:showAll===m.id?"rgba(63,81,181,0.2)":"rgba(255,255,255,0.03)",border:"1px solid rgba(63,81,181,0.15)",borderRadius:5,color:"#fff",fontSize:10,fontWeight:600,cursor:"pointer"}}>👥 All ({cnt})</button>
                    </div>

                    {/* ── Prediction Form ── */}
                    {ep && showAll!==m.id && !myP && m.status==="upcoming" && <div onClick={e=>e.stopPropagation()}>
                      {/* Winner */}
                      <div style={{marginBottom:10}}>
                        <div style={{fontSize:9,color:"#7986cb",fontWeight:600,letterSpacing:1,marginBottom:4}}>WINNER</div>
                        <div style={{display:"flex",gap:3}}>
                          {[m.home,"draw",m.away].map(o=>(
                            <button key={o} onClick={()=>setWinner(o,m)} style={{flex:1,padding:"8px 2px",background:ep.winner===o?"rgba(63,81,181,0.3)":"rgba(255,255,255,0.025)",border:ep.winner===o?"1px solid #3f51b5":"1px solid rgba(255,255,255,0.05)",borderRadius:5,color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                              {o!=="draw" && <TeamBadge k={o} sz={16}/>}
                              {o==="draw"?"Draw":TEAMS[o]?.s}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Score */}
                      <div style={{marginBottom:10}}>
                        <div style={{fontSize:9,color:"#7986cb",fontWeight:600,letterSpacing:1,marginBottom:4}}>SCORE</div>
                        <div style={{display:"flex",alignItems:"center",gap:5}}>
                          <div style={{flex:1,textAlign:"center"}}>
                            <div style={{fontSize:8,color:"#7986cb",marginBottom:2}}>{ho.s}</div>
                            <input type="number" min="0" max="20" value={ep.hs} onChange={e=>setScore("hs",e.target.value)} style={{...ss.inp,width:"100%",padding:7,fontSize:18,fontWeight:800,textAlign:"center"}}/>
                          </div>
                          <span style={{color:"#5c6bc0",fontWeight:800}}>:</span>
                          <div style={{flex:1,textAlign:"center"}}>
                            <div style={{fontSize:8,color:"#7986cb",marginBottom:2}}>{aw.s}</div>
                            <input type="number" min="0" max="20" value={ep.as} onChange={e=>setScore("as",e.target.value)} style={{...ss.inp,width:"100%",padding:7,fontSize:18,fontWeight:800,textAlign:"center"}}/>
                          </div>
                        </div>
                        {getScoreError() && <div style={{marginTop:4,padding:"4px 8px",background:"rgba(244,67,54,0.1)",border:"1px solid rgba(244,67,54,0.2)",borderRadius:4,fontSize:9,color:"#f44336",textAlign:"center"}}>⚠ {getScoreError()}</div>}
                        {ep.winner && ep.hs!=="" && ep.as!=="" && !getScoreError() && <div style={{marginTop:4,fontSize:9,color:"#4caf50",textAlign:"center"}}>✓ {ep.winner==="draw"?"Draw":TEAMS[ep.winner]?.n+" wins"} {ep.hs}–{ep.as}</div>}
                      </div>

                      {/* Goalscorer picker — two team tabs */}
                      <div style={{marginBottom:10}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                          <div style={{fontSize:9,color:"#7986cb",fontWeight:600,letterSpacing:1}}>
                            GOALSCORERS {(squadLoading[m.home]||squadLoading[m.away]) && <span style={{color:"#ff9800"}}>(loading...)</span>}
                          </div>
                          {getTotalGoals()!==null && getTotalGoals()>0 && <div style={{fontSize:9,fontWeight:700,color:getScorerGoals()===getTotalGoals()?"#4caf50":getScorerGoals()>getTotalGoals()?"#f44336":"#ff9800"}}>
                            ⚽ {getScorerGoals()} / {getTotalGoals()}
                            {/* Info */}
          <div style={{marginTop:12,padding:10,background:"rgba(63,81,181,0.04)",border:"1px solid rgba(63,81,181,0.1)",borderRadius:8}}>
            <div style={{fontSize:9,fontWeight:700,color:"#7986cb",marginBottom:4}}>HOW IT WORKS</div>
            <div style={{fontSize:9,color:"#9fa8da",lineHeight:1.7}}>
              <div>🌐 <strong>Fetch Next Round</strong> — searches the web for upcoming UCL fixtures and auto-adds them</div>
              <div>📡 <strong>Update Scores</strong> — pulls live/final scores from the web after matches</div>
              <div>➕ <strong>Add</strong> — manually add a match if auto-fetch misses one</div>
              <div>🗑 <strong>Delete</strong> — remove a match (also removes all predictions)</div>
              <div style={{marginTop:3,color:"#7986cb"}}>As each round ends, just hit "Fetch Next Round" to add R16, QF, SF & Final matches automatically!</div>
            </div>
          </div>
          {/* Squad management */}
          <div style={{marginTop:8,padding:10,background:"rgba(255,152,0,0.04)",border:"1px solid rgba(255,152,0,0.1)",borderRadius:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:9,fontWeight:700,color:"#ff9800",marginBottom:2}}>SQUAD DATA</div>
                <div style={{fontSize:9,color:"#9fa8da"}}>{Object.keys(squads).length} team squads cached · Squads load via live web search from ESPN/Transfermarkt</div>
              </div>
              <button onClick={async ()=>{
                setSquads({});
                try{await window.storage.delete("ucl6_squads");}catch(e){}
                flash("All squad caches cleared! They'll reload fresh when you open a match.");
              }} style={{padding:"5px 10px",background:"rgba(255,152,0,0.1)",border:"1px solid rgba(255,152,0,0.2)",borderRadius:5,color:"#ff9800",fontSize:9,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>
                🗑 Clear All Squads
              </button>
            </div>
          </div>

          {/* ━━━ TEST SIMULATOR ━━━ */}
          <div style={{marginTop:8,padding:10,background:"rgba(156,39,176,0.04)",border:"1px solid rgba(156,39,176,0.15)",borderRadius:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:testResult?8:0}}>
              <div>
                <div style={{fontSize:9,fontWeight:700,color:"#ce93d8",marginBottom:2}}>🧪 SCORING TEST SIMULATOR</div>
                <div style={{fontSize:9,color:"#9fa8da"}}>Verify point calculations with a simulated match</div>
              </div>
              {!testResult ? (
                <button onClick={runTestSimulation} style={{padding:"5px 10px",background:"rgba(156,39,176,0.15)",border:"1px solid rgba(156,39,176,0.25)",borderRadius:5,color:"#ce93d8",fontSize:9,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>
                  ▶ Run Test
                </button>
              ) : (
                <button onClick={clearTest} style={{padding:"5px 10px",background:"rgba(244,67,54,0.1)",border:"1px solid rgba(244,67,54,0.2)",borderRadius:5,color:"#f44336",fontSize:9,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>
                  ✕ Close
                </button>
              )}
            </div>

            {testResult && <div>
              {/* Simulated match info */}
              <div style={{padding:8,background:"rgba(255,255,255,0.03)",borderRadius:6,marginBottom:8}}>
                <div style={{fontSize:8,color:"#ce93d8",fontWeight:600,letterSpacing:1,marginBottom:4}}>SIMULATED MATCH RESULT</div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:6}}>
                  <TeamBadge k="realmadrid" sz={24}/> <span style={{fontSize:13,fontWeight:800}}>Real Madrid</span>
                  <span style={{fontSize:18,fontWeight:800,color:"#fff",padding:"0 6px"}}>3 – 1</span>
                  <span style={{fontSize:13,fontWeight:800}}>Juventus</span> <TeamBadge k="juventus" sz={24}/>
                </div>
                <div style={{textAlign:"center",fontSize:10,color:"#9fa8da"}}>
                  ⚽ Mbappé ×2, Bellingham ×1, Vlahovic ×1
                </div>
              </div>

              {/* Test scenarios */}
              <div style={{fontSize:8,color:"#ce93d8",fontWeight:600,letterSpacing:1,marginBottom:4}}>PREDICTION SCENARIOS & EXPECTED POINTS</div>
              {testResult.results.map((r, i) => {
                const p = r.pred;
                const expectedMap = {
                  "Katkar": {desc: "Grand Slam: result✓ score✓ all 3 scorers✓", expect: "(1+2+3)×2 = 12", val: 12},
                  "Kenkre": {desc: "Grand Slam: result✓ score✓ 2/3 scorers (Vinícius wrong)", expect: "(1+2+2)×2 = 10", val: 10},
                  "Samar": {desc: "Correct result only + 1 scorer (Mbappé)", expect: "1+0+1 = 2", val: 2},
                  "Sharvil": {desc: "Wrong result (picked Juve) + 1 scorer (Vlahovic)", expect: "0+0+1 = 1", val: 1},
                  "Dev": {desc: "Wrong result (draw) + 3 correct scorers", expect: "0+0+3 = 3", val: 3},
                  "Bhavik": {desc: "Correct result + 3 scorers (no exact score)", expect: "1+0+3 = 4", val: 4},
                  "Hrishil": {desc: "Exact score + result but 0 correct scorers", expect: "1+2+0 = 3", val: 3},
                };
                const e = expectedMap[r.user] || {};
                const passed = r.pts !== null;
                return <div key={r.user} style={{padding:"6px 8px",background:i%2===0?"rgba(255,255,255,0.015)":"transparent",borderRadius:4,marginBottom:2}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                    <div style={{display:"flex",alignItems:"center",gap:5}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background:COLORS[i],display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700}}>{r.user[0]}</div>
                      <span style={{fontSize:11,fontWeight:700}}>{r.user}</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:4}}>
                      {r.pts?.slam && <span style={{fontSize:8,color:"#ffd700",fontWeight:700}}>🏆 GRAND SLAM</span>}
                      <span style={{background:r.pts?.slam?"rgba(255,215,0,0.15)":r.pts?.pts>0?"rgba(76,175,80,0.15)":"rgba(255,255,255,0.04)",padding:"2px 8px",borderRadius:8,fontSize:11,fontWeight:800,color:r.pts?.slam?"#ffd700":r.pts?.pts>0?"#4caf50":"#5c6bc0"}}>
                        {r.pts?.pts || 0} pts
                      </span>
                    </div>
                  </div>
                  <div style={{fontSize:9,color:"#9fa8da",marginLeft:25}}>
                    Predicted: <strong>{TEAMS[p.winner]?.s||"DRAW"} {p.hs}–{p.as}</strong>
                    {p.scorers?.length > 0 && <span> · {p.scorers.map(s=>`${s.name}${s.goals>1?`×${s.goals}`:""}`).join(", ")}</span>}
                  </div>
                  <div style={{fontSize:9,marginLeft:25,marginTop:2}}>
                    <span style={{color:"#7986cb"}}>{e.desc}</span>
                  </div>
                  <div style={{fontSize:9,marginLeft:25,display:"flex",alignItems:"center",gap:4}}>
                    <span style={{color:"#ce93d8"}}>Expected: {e.expect}</span>
                    <span style={{color:"#5c6bc0"}}>→</span>
                    <span style={{color:"#ce93d8"}}>Got: <strong>{r.pts?.pts || 0}</strong></span>
                    {r.pts && (
                      <span style={{fontSize:8,color: r.pts.pts === e.val ? "#4caf50" : "#f44336", fontWeight:700}}>
                        {r.pts.pts === e.val ? "✅ PASS" : "❌ FAIL"}
                      </span>
                    )}
                  </div>
                  <div style={{fontSize:8,marginLeft:25,color:"#5c6bc0",marginTop:1}}>
                    Breakdown: result={r.pts?.gotR?"✓1":"✗0"} · score={r.pts?.gotS?"✓2":"✗0"} · scorers={r.pts?.sPts||0} {r.pts?.slam?"· ×2 grand slam":""}
                  </div>
                </div>;
              })}

              {/* Summary */}
              {(()=>{
                const EXPECTED = {Katkar:12,Kenkre:10,Samar:2,Sharvil:1,Dev:3,Bhavik:4,Hrishil:3};
                const allPass = testResult.results.every(r => r.pts?.pts === EXPECTED[r.user]);
                return <div style={{marginTop:6,padding:6,background:"rgba(255,255,255,0.02)",borderRadius:4,textAlign:"center"}}>
                  <span style={{fontSize:10,fontWeight:700,color:allPass?"#4caf50":"#f44336"}}>
                    {allPass ? "✅ ALL 7 TESTS PASSED — Scoring engine is correct!" : "❌ SOME TESTS FAILED — Check scoring logic"}
                  </span>
                </div>;
              })()}
            </div>}
          </div>
        </div>}
                          {getTotalGoals()===0 && <div style={{fontSize:9,color:"#4caf50",fontWeight:600}}>✓ 0–0 no scorers needed</div>}
                        </div>
                        {/* Selected scorers */}
                        {scorers.length>0 && <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:6}}>
                          {scorers.map((s,i)=>(
                            <div key={i} style={{display:"flex",alignItems:"center",gap:3,background:"rgba(63,81,181,0.15)",border:"1px solid rgba(63,81,181,0.2)",borderRadius:5,padding:"3px 6px",fontSize:10}}>
                              <TeamBadge k={s.team} sz={14}/> <span style={{fontWeight:600}}>{s.name}</span>
                              {s.goals>1 && <span style={{color:"#ffd700",fontWeight:700}}>×{s.goals}</span>}
                              <button onClick={()=>addScorer(s.name,s.team)} style={{background:"none",border:"none",color:"#4caf50",cursor:"pointer",fontSize:11,padding:0,fontWeight:700}}>+</button>
                              <button onClick={()=>{const n=[...scorers];if(n[i].goals>1)n[i]={...n[i],goals:n[i].goals-1};else n.splice(i,1);setScorers(n);}} style={{background:"none",border:"none",color:"#f44336",cursor:"pointer",fontSize:11,padding:0,fontWeight:700}}>−</button>
                            </div>
                          ))}
                        </div>}
                        {/* Team tabs */}
                        <div style={{display:"flex",gap:2,marginBottom:4}}>
                          <button onClick={()=>setSquadTab("home")} style={{flex:1,padding:"6px 4px",background:squadTab==="home"?`${ho.c[0]}22`:"rgba(255,255,255,0.02)",border:squadTab==="home"?`1px solid ${ho.c[0]}55`:"1px solid rgba(255,255,255,0.04)",borderRadius:"5px 5px 0 0",color:"#fff",fontSize:10,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                            <TeamBadge k={m.home} sz={14}/> {ho.s}
                            <span style={{fontSize:8,color:"#7986cb"}}>({(squads[m.home]||[]).length})</span>
                          </button>
                          <button onClick={()=>setSquadTab("away")} style={{flex:1,padding:"6px 4px",background:squadTab==="away"?`${aw.c[0]}22`:"rgba(255,255,255,0.02)",border:squadTab==="away"?`1px solid ${aw.c[0]}55`:"1px solid rgba(255,255,255,0.04)",borderRadius:"5px 5px 0 0",color:"#fff",fontSize:10,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                            <TeamBadge k={m.away} sz={14}/> {aw.s}
                            <span style={{fontSize:8,color:"#7986cb"}}>({(squads[m.away]||[]).length})</span>
                          </button>
                            <button onClick={async (e)=>{
                            e.stopPropagation();
                            const tk = squadTab==="home"?m.home:m.away;
                            flash(`Refreshing ${TEAMS[tk].s} squad...`);
                            await refreshSquad(tk);
                            flash(`${TEAMS[tk].s} squad updated!`);
                          }} title="Refresh this squad from web" style={{padding:"6px 8px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.04)",borderRadius:"5px 5px 0 0",color:"#5c6bc0",fontSize:10,cursor:"pointer"}}>🔄</button>
                        </div>
                        {/* Search + player list for selected team */}
                        <div ref={dropRef} style={{border:"1px solid rgba(255,255,255,0.06)",borderRadius:"0 0 6px 6px",overflow:"hidden"}}>
                          <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${squadTab==="home"?ho.s:aw.s} players...`}
                            style={{...ss.inp,width:"100%",padding:"6px 8px",fontSize:11,borderRadius:0,border:"none",borderBottom:"1px solid rgba(255,255,255,0.04)"}}/>
                          <div style={{maxHeight:160,overflow:"auto",background:"rgba(0,0,0,0.15)"}}>
                            {(()=>{
                              const teamKey = squadTab==="home"?m.home:m.away;
                              const players = (squads[teamKey]||[]).filter(p=>!search||p.toLowerCase().includes(search.toLowerCase()));
                              if (squadLoading[teamKey]) return <div style={{padding:10,color:"#ff9800",fontSize:10,textAlign:"center"}}>Loading {TEAMS[teamKey].s} squad...</div>;
                              if (!players.length && !search) return <div style={{padding:10,color:"#5c6bc0",fontSize:10,textAlign:"center"}}>No squad loaded · tap match again</div>;
                              if (!players.length && search) return <div style={{padding:10,color:"#5c6bc0",fontSize:10,textAlign:"center"}}>No players matching "{search}"</div>;
                              return players.map((p,i)=>{
                                const already = scorers.find(s=>s.name===p&&s.team===teamKey);
                                return <button key={i} onClick={()=>addScorer(p,teamKey)} style={{display:"flex",alignItems:"center",gap:5,width:"100%",padding:"6px 8px",background:already?"rgba(63,81,181,0.08)":"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,0.02)",color:"#fff",fontSize:11,cursor:"pointer",textAlign:"left"}}
                                  onMouseEnter={e=>e.currentTarget.style.background=already?"rgba(63,81,181,0.15)":"rgba(255,255,255,0.03)"} onMouseLeave={e=>e.currentTarget.style.background=already?"rgba(63,81,181,0.08)":"transparent"}>
                                  <span style={{width:4,height:4,borderRadius:"50%",background:TEAMS[teamKey].c[0],flexShrink:0}}/>
                                  {p}
                                  {already && <span style={{marginLeft:"auto",fontSize:8,color:"#4caf50",fontWeight:700}}>✓ ×{already.goals}</span>}
                                  {!already && <span style={{marginLeft:"auto",fontSize:8,color:"#5c6bc0"}}>+ add</span>}
                                </button>;
                              });
                            })()}
                          </div>
                        </div>
                      </div>

                      {getScorerError() && <div style={{marginBottom:6,padding:"4px 8px",background:"rgba(255,152,0,0.1)",border:"1px solid rgba(255,152,0,0.2)",borderRadius:4,fontSize:9,color:"#ff9800",textAlign:"center"}}>⚽ {getScorerError()}</div>}
                      <button onClick={()=>submitPred(m.id)} disabled={!isPredValid()} style={{...ss.btn,width:"100%",padding:10,fontSize:12,opacity:isPredValid()?1:0.35}}>
                        🔒 Submit Prediction
                      </button>
                      <div style={{fontSize:8,color:"#f44336",textAlign:"center",marginTop:4,opacity:0.7}}>Predictions are final · no changes allowed</div>
                    </div>}

                    {/* Locked prediction */}
                    {myP && showAll!==m.id && <div style={{textAlign:"center",padding:8}}>
                      <div style={{fontSize:10,color:"#4caf50",fontWeight:600,marginBottom:4}}>🔒 Locked</div>
                      <div style={{fontSize:16,fontWeight:800}}>{TEAMS[myP.winner]?.s||"DRAW"} · {myP.hs}–{myP.as}</div>
                      {myP.scorers?.length>0 && <div style={{marginTop:6,display:"flex",justifyContent:"center",gap:3,flexWrap:"wrap"}}>
                        {myP.scorers.map((s,i)=><span key={i} style={{background:"rgba(63,81,181,0.12)",padding:"2px 6px",borderRadius:4,fontSize:9,fontWeight:600}}>⚽ {s.name}{s.goals>1?` ×${s.goals}`:""}</span>)}
                      </div>}
                    </div>}

                    {/* All predictions */}
                    {showAll===m.id && <div>
                      {USERS.map(u=>{
                        const p=preds[pk(m.id,u)]; const r=p&&m.hs!==null?calcPts(p,m):null;
                        return <div key={u} style={{display:"flex",alignItems:"center",padding:"6px 8px",background:u===user?"rgba(63,81,181,0.06)":"transparent",borderRadius:5,marginBottom:2}}>
                          <div style={{width:22,height:22,borderRadius:"50%",background:COLORS[USERS.indexOf(u)],display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,flexShrink:0,marginRight:7}}>{u[0]}</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:11,fontWeight:600}}>{u}</div>
                            {p ? <div style={{fontSize:9,color:"#9fa8da",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                              {TEAMS[p.winner]?.s||"DRAW"} {p.hs}–{p.as}
                              {p.scorers?.length>0 && <span style={{color:"#7986cb"}}> · {p.scorers.map(s=>`${s.name}${s.goals>1?`×${s.goals}`:""}`).join(", ")}</span>}
                            </div> : <div style={{fontSize:9,color:"#5c6bc0"}}>—</div>}
                          </div>
                          {r && <div style={{background:r.slam?"rgba(255,215,0,0.12)":r.pts>0?"rgba(76,175,80,0.12)":"rgba(255,255,255,0.03)",padding:"2px 7px",borderRadius:8,fontSize:10,fontWeight:700,color:r.slam?"#ffd700":r.pts>0?"#4caf50":"#5c6bc0"}}>{r.slam&&"🏆"}+{r.pts}</div>}
                        </div>;
                      })}
                    </div>}
                  </div>}
                </div>;
              })}
            </div>
          ))}
        </div>}

        {/* ━━━ LEADERBOARD ━━━ */}
        {view==="leaderboard" && <div>
          <h2 style={{fontSize:15,fontWeight:800,letterSpacing:1,textAlign:"center",margin:"0 0 14px"}}>LEADERBOARD</h2>
          {leaderboard().map((e,i)=>(
            <div key={e.user} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",background:i===0?"rgba(255,215,0,0.04)":"rgba(255,255,255,0.015)",border:`1px solid ${i===0?"rgba(255,215,0,0.1)":"rgba(255,255,255,0.03)"}`,borderRadius:10,marginBottom:3,animation:`fadeIn 0.2s ease ${i*0.04}s both`}}>
              <div style={{width:24,textAlign:"center",fontSize:13,fontWeight:800,color:i===0?"#ffd700":i===1?"#c0c0c0":i===2?"#cd7f32":"#5c6bc0"}}>{i<3?["🥇","🥈","🥉"][i]:i+1}</div>
              <div style={{width:30,height:30,borderRadius:"50%",background:i===0?"linear-gradient(135deg,#ffd700,#ff8f00)":COLORS[USERS.indexOf(e.user)],display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{e.user[0]}</div>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700}}>{e.user}</div><div style={{fontSize:9,color:"#7986cb"}}>{e.cnt} predicted · {e.slams>0?`${e.slams} grand slam${e.slams>1?"s":""} 🏆`:`${e.played} scored`}</div></div>
              <div style={{fontSize:18,fontWeight:800,color:i===0?"#ffd700":"#fff"}}>{e.tot}</div>
              <div style={{fontSize:8,color:"#5c6bc0",fontWeight:600}}>PTS</div>
            </div>
          ))}
          <div style={{marginTop:14,padding:12,background:"rgba(255,255,255,0.015)",borderRadius:10,border:"1px solid rgba(255,255,255,0.03)"}}>
            <h3 style={{fontSize:10,fontWeight:700,color:"#7986cb",letterSpacing:1,margin:"0 0 6px"}}>SCORING</h3>
            <div style={{fontSize:10,color:"#9fa8da",lineHeight:1.8}}>
              <div>✅ Correct result (W/D/L) = <strong style={{color:"#4caf50"}}>1 pt</strong></div>
              <div>🎯 Exact score = <strong style={{color:"#4caf50"}}>2 pts</strong></div>
              <div>⚽ Each correct goalscorer = <strong style={{color:"#4caf50"}}>1 pt</strong></div>
              <div style={{marginTop:3,paddingTop:3,borderTop:"1px solid rgba(255,255,255,0.04)"}}>🏆 <strong style={{color:"#ffd700"}}>GRAND SLAM</strong> = <strong style={{color:"#ffd700"}}>ALL ×2</strong></div>
            </div>
          </div>
        </div>}

        {/* ━━━ ADMIN ━━━ */}
        {view==="admin" && <div>
          <h2 style={{fontSize:15,fontWeight:800,letterSpacing:1,textAlign:"center",margin:"0 0 3px"}}>ADMIN</h2>
          <p style={{fontSize:10,color:"#7986cb",textAlign:"center",margin:"0 0 12px"}}>Manage matches, results & goalscorers</p>
          
          {/* Action buttons row */}
          <div style={{display:"flex",gap:4,marginBottom:12}}>
            <button onClick={fetchUpcomingMatches} disabled={fetchingMatches} style={{flex:1,padding:8,background:"rgba(63,81,181,0.1)",border:"1px solid rgba(63,81,181,0.2)",borderRadius:6,color:"#9fa8da",fontSize:10,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
              {fetchingMatches?<><div style={{width:11,height:11,border:"2px solid rgba(63,81,181,0.2)",borderTopColor:"#3f51b5",borderRadius:"50%",animation:"spin 0.5s linear infinite"}}/>Fetching...</>:"🌐 Fetch Next Round"}
            </button>
            <button onClick={fetchScores} disabled={refreshing} style={{flex:1,padding:8,background:"rgba(76,175,80,0.08)",border:"1px solid rgba(76,175,80,0.2)",borderRadius:6,color:"#4caf50",fontSize:10,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
              {refreshing?<><div style={{width:11,height:11,border:"2px solid rgba(76,175,80,0.2)",borderTopColor:"#4caf50",borderRadius:"50%",animation:"spin 0.5s linear infinite"}}/>Fetching...</>:"📡 Update Scores"}
            </button>
            <button onClick={()=>setAddingManual(!addingManual)} style={{padding:"8px 12px",background:addingManual?"rgba(255,152,0,0.15)":"rgba(255,255,255,0.03)",border:`1px solid ${addingManual?"rgba(255,152,0,0.3)":"rgba(255,255,255,0.06)"}`,borderRadius:6,color:addingManual?"#ff9800":"#9fa8da",fontSize:10,fontWeight:600,cursor:"pointer"}}>
              {addingManual?"✕":"+ Add"}
            </button>
          </div>
          {apiLog && <div style={{fontSize:9,color:"#7986cb",textAlign:"center",marginBottom:8}}>{apiLog}</div>}

          {/* Manual Add Match */}
          {addingManual && <div style={{padding:12,background:"rgba(255,152,0,0.04)",border:"1px solid rgba(255,152,0,0.15)",borderRadius:10,marginBottom:12}}>
            <div style={{fontSize:10,fontWeight:700,color:"#ff9800",marginBottom:8}}>ADD MATCH MANUALLY</div>
            <div style={{display:"flex",gap:4,marginBottom:6}}>
              <div style={{flex:1}}>
                <div style={{fontSize:8,color:"#7986cb",marginBottom:2}}>HOME</div>
                <select value={manualMatch.home} onChange={e=>setManualMatch({...manualMatch,home:e.target.value})} style={{...ss.inp,width:"100%",padding:6,fontSize:10}}>
                  <option value="">Select team</option>
                  {Object.entries(TEAMS).sort((a,b)=>a[1].n.localeCompare(b[1].n)).map(([k,v])=><option key={k} value={k}>{v.n}</option>)}
                </select>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:8,color:"#7986cb",marginBottom:2}}>AWAY</div>
                <select value={manualMatch.away} onChange={e=>setManualMatch({...manualMatch,away:e.target.value})} style={{...ss.inp,width:"100%",padding:6,fontSize:10}}>
                  <option value="">Select team</option>
                  {Object.entries(TEAMS).sort((a,b)=>a[1].n.localeCompare(b[1].n)).map(([k,v])=><option key={k} value={k}>{v.n}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:"flex",gap:4,marginBottom:6}}>
              <div style={{flex:1}}>
                <div style={{fontSize:8,color:"#7986cb",marginBottom:2}}>DATE</div>
                <input type="date" value={manualMatch.date} onChange={e=>setManualMatch({...manualMatch,date:e.target.value})} style={{...ss.inp,width:"100%",padding:6,fontSize:10}}/>
              </div>
              <div style={{flex:0.5}}>
                <div style={{fontSize:8,color:"#7986cb",marginBottom:2}}>TIME (CET)</div>
                <input type="time" value={manualMatch.time} onChange={e=>setManualMatch({...manualMatch,time:e.target.value})} style={{...ss.inp,width:"100%",padding:6,fontSize:10}}/>
              </div>
            </div>
            <div style={{marginBottom:6}}>
              <div style={{fontSize:8,color:"#7986cb",marginBottom:2}}>STAGE</div>
              <select value={manualMatch.stage} onChange={e=>setManualMatch({...manualMatch,stage:e.target.value})} style={{...ss.inp,width:"100%",padding:6,fontSize:10}}>
                <option value="">Select round</option>
                <option value="Knockout Playoffs · Leg 1">KO Playoffs · Leg 1</option>
                <option value="Knockout Playoffs · Leg 2">KO Playoffs · Leg 2</option>
                <option value="Round of 16 · Leg 1">Round of 16 · Leg 1</option>
                <option value="Round of 16 · Leg 2">Round of 16 · Leg 2</option>
                <option value="Quarter-Final · Leg 1">Quarter-Final · Leg 1</option>
                <option value="Quarter-Final · Leg 2">Quarter-Final · Leg 2</option>
                <option value="Semi-Final · Leg 1">Semi-Final · Leg 1</option>
                <option value="Semi-Final · Leg 2">Semi-Final · Leg 2</option>
                <option value="Final">Final · Budapest</option>
              </select>
            </div>
            {manualMatch.home && manualMatch.away && manualMatch.home !== manualMatch.away && (
              <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 8px",background:"rgba(255,255,255,0.02)",borderRadius:6,marginBottom:6}}>
                <TeamBadge k={manualMatch.home} sz={20}/><span style={{fontSize:11,fontWeight:700}}>{TEAMS[manualMatch.home]?.s}</span>
                <span style={{color:"#5c6bc0",fontSize:9}}>vs</span>
                <span style={{fontSize:11,fontWeight:700}}>{TEAMS[manualMatch.away]?.s}</span><TeamBadge k={manualMatch.away} sz={20}/>
              </div>
            )}
            <button onClick={addManualMatch} style={{...ss.btn,width:"100%",padding:8,fontSize:11}}>Add Match</button>
          </div>}

          {/* Matches grouped by stage */}
          {(()=>{
            const byStage = {};
            matches.forEach(m => { const st = m.stage || "Other"; if(!byStage[st]) byStage[st]=[]; byStage[st].push(m); });
            return Object.entries(byStage).map(([stage, stageMs]) => (
              <div key={stage} style={{marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                  <div style={{width:3,height:3,borderRadius:"50%",background:"#3f51b5"}}/>
                  <span style={{fontSize:9,fontWeight:700,letterSpacing:1.5,color:"#7986cb"}}>{stage.toUpperCase()}</span>
                  <span style={{fontSize:8,color:"#5c6bc0"}}>({stageMs.length})</span>
                  <div style={{flex:1,height:1,background:"rgba(255,255,255,0.03)"}}/>
                </div>
                {stageMs.map(m=>{
            const ho=TEAMS[m.home],aw=TEAMS[m.away];
            const ed=adminEdit[m.id]||{home:m.hs??"",away:m.as??"",status:m.status,scorers:m.gs||[]};
            const comb=[...(squads[m.home]||[]).map(n=>({name:n,team:m.home})),...(squads[m.away]||[]).map(n=>({name:n,team:m.away}))];
            const sr=admSrch[m.id]||"";
            return <div key={m.id} style={{padding:12,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.04)",borderRadius:10,marginBottom:5}}>
              <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:8}}>
                <TeamBadge k={m.home} sz={22}/><span style={{fontSize:11,fontWeight:700}}>{ho.s}</span>
                <span style={{color:"#5c6bc0",fontSize:9}}>vs</span>
                <span style={{fontSize:11,fontWeight:700}}>{aw.s}</span><TeamBadge k={m.away} sz={22}/>
                <span style={{marginLeft:"auto",fontSize:8,color:m.status==="finished"?"#4caf50":"#ff9800",fontWeight:600}}>{m.status==="finished"?"✓ SET":"PENDING"}</span>
              </div>
              <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:6}}>
                <input type="number" min="0" value={ed.home} onChange={e=>setAdminEdit({...adminEdit,[m.id]:{...ed,home:e.target.value}})} style={{...ss.inp,width:42,padding:6,fontSize:14,fontWeight:700,textAlign:"center"}}/>
                <span style={{color:"#5c6bc0",fontWeight:700}}>:</span>
                <input type="number" min="0" value={ed.away} onChange={e=>setAdminEdit({...adminEdit,[m.id]:{...ed,away:e.target.value}})} style={{...ss.inp,width:42,padding:6,fontSize:14,fontWeight:700,textAlign:"center"}}/>
                <select value={ed.status} onChange={e=>setAdminEdit({...adminEdit,[m.id]:{...ed,status:e.target.value}})} style={{...ss.inp,flex:1,padding:6,fontSize:10}}>
                  <option value="upcoming">Upcoming</option><option value="live">Live</option><option value="finished">Finished</option>
                </select>
              </div>
              <div style={{marginBottom:6}}>
                <div style={{fontSize:8,color:"#7986cb",fontWeight:600,letterSpacing:1,marginBottom:3}}>GOALSCORERS</div>
                {ed.scorers?.length>0 && <div style={{display:"flex",flexWrap:"wrap",gap:2,marginBottom:4}}>
                  {ed.scorers.map((s,i)=><span key={i} style={{background:"rgba(63,81,181,0.1)",padding:"1px 5px",borderRadius:3,fontSize:9,display:"flex",alignItems:"center",gap:2}}>
                    ⚽ {s.name}{s.goals>1&&` ×${s.goals}`}
                    <button onClick={()=>{const ns=[...ed.scorers];ns.splice(i,1);setAdminEdit({...adminEdit,[m.id]:{...ed,scorers:ns}});}} style={{background:"none",border:"none",color:"#f44336",cursor:"pointer",fontSize:9,padding:0}}>×</button>
                  </span>)}
                </div>}
                <div style={{position:"relative"}}>
                  <input type="text" value={sr} onChange={e=>{setAdmSrch({...admSrch,[m.id]:e.target.value});if(!squads[m.home]?.length)fetchSquad(m.home);if(!squads[m.away]?.length)fetchSquad(m.away);}} placeholder="Add scorer..." style={{...ss.inp,width:"100%",padding:"5px 7px",fontSize:10}}/>
                  {sr&&<div style={{position:"absolute",top:"100%",left:0,right:0,maxHeight:140,overflow:"auto",background:"#1a1f3a",border:"1px solid rgba(63,81,181,0.2)",borderRadius:"0 0 5px 5px",zIndex:50}}>
                    {comb.filter(p=>p.name.toLowerCase().includes(sr.toLowerCase())).slice(0,10).map((p,i)=>(
                      <button key={i} onClick={()=>{const ex=ed.scorers?.find(s=>s.name===p.name);const ns=ex?ed.scorers.map(s=>s.name===p.name?{...s,goals:s.goals+1}:s):[...(ed.scorers||[]),{name:p.name,team:p.team,goals:1}];setAdminEdit({...adminEdit,[m.id]:{...ed,scorers:ns}});setAdmSrch({...admSrch,[m.id]:""});}}
                        style={{display:"flex",alignItems:"center",gap:4,width:"100%",padding:"4px 7px",background:"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,0.02)",color:"#fff",fontSize:10,cursor:"pointer",textAlign:"left"}}
                        onMouseEnter={e=>e.currentTarget.style.background="rgba(63,81,181,0.08)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <TeamBadge k={p.team} sz={13}/>{p.name}<span style={{marginLeft:"auto",fontSize:7,color:"#5c6bc0"}}>{TEAMS[p.team]?.s}</span>
                      </button>
                    ))}
                  </div>}
                </div>
              </div>
              <div style={{display:"flex",gap:4}}>
                                    <button onClick={()=>{const up=matches.map(x=>x.id===m.id?{...x,hs:parseInt(ed.home)||0,as:parseInt(ed.away)||0,status:ed.status,gs:ed.scorers||[]}:x);save(SKEY.matches,up,setMatches);flash(`${ho.s} vs ${aw.s} saved!`);}} style={{...ss.btn,flex:1,padding:7,fontSize:10}}>Save Result</button>
                    <button onClick={()=>{if(window.confirm(`Delete ${ho.s} vs ${aw.s}?`))deleteMatch(m.id);}} style={{padding:"7px 10px",background:"rgba(244,67,54,0.08)",border:"1px solid rgba(244,67,54,0.2)",borderRadius:8,color:"#f44336",fontSize:10,fontWeight:600,cursor:"pointer"}}>🗑</button>
              </div>
            </div>;
          })}
              </div>
            ));
          })()}
        </div>}
      </div>
    </div>
  );
}
