import { useState, useEffect, useRef } from "react";

const USERS = ["Katkar","Kenkre","Samar","Sharvil","Dev","Bhavik","Hrishil"];
const CLR = ["#e91e63","#9c27b0","#3f51b5","#00bcd4","#4caf50","#ff9800","#f44336"];

const T = {
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

// ── HARDCODED SQUADS (2025-26, post-Jan window) ──
const SQ = {
  galatasaray:["Uğurcan Çakır","Günay Güvenç","Davinson Sánchez","Abdülkerim Bardakcı","Kaan Ayhan","Ismail Jakobs","Sacha Boey","Renato Nhaga","İlkay Gündoğan","Lucas Torreira","Kerem Aktürkoğlu","Leroy Sané","Baris Yilmaz","Noa Lang","Dries Mertens","Yunus Akgün","Wilfried Singo","Mauro Icardi","Victor Osimhen","Gabriel Sara","Eren Elmalı","Carlos Cuesta"],
  juventus:["Wojciech Szczęsny","Mattia Perin","Gleison Bremer","Federico Gatti","Danilo","Andrea Cambiaso","Juan Cabal","Nicolás González","Manuel Locatelli","Weston McKennie","Douglas Luiz","Khéphren Thuram","Teun Koopmeiners","Filip Kostić","Kenan Yıldız","Timothy Weah","Francisco Conceição","Dušan Vlahović","Arkadiusz Milik","Samuel Mbangula","Nicolò Fagioli"],
  dortmund:["Gregor Kobel","Alexander Meyer","Waldemar Anton","Niklas Süle","Nico Schlotterbeck","Ramy Bensebaini","Julian Ryerson","Emre Can","Marcel Sabitzer","Felix Nmecha","Pascal Groß","Julian Brandt","Jamie Gittens","Karim Adeyemi","Donyell Malen","Serhou Guirassy","Maximilian Beier","Giovanni Reyna","Julien Duranville","Yan Couto"],
  atalanta:["Marco Carnesecchi","Juan Musso","Rafael Tolói","Berat Djimsiti","Isak Hien","Sead Kolašinac","Davide Zappacosta","Matteo Ruggeri","Marten de Roon","Ederson","Mario Pašalić","Teun Koopmeiners","Charles De Ketelaere","Ademola Lookman","Mateo Retegui","Gianluca Scamacca","Lazar Samardžić","Marco Brescianini","Ben Godfrey"],
  monaco:["Philipp Köhn","Radoslaw Majecki","Thilo Kehrer","Mohammed Salisu","Wilfried Singo","Caio Henrique","Vanderson","Denis Zakaria","Youssouf Fofana","Aleksandr Golovin","Eliesse Ben Seghir","Maghnes Akliouche","Takumi Minamino","Breel Embolo","Folarin Balogun","Mykhaylo Mudryk","Lamine Camara","George Ilenikhena"],
  psg:["Gianluigi Donnarumma","Matvey Safonov","Marquinhos","Milan Škriniar","Willian Pacho","Lucas Hernández","Nuno Mendes","Achraf Hakimi","Vitinha","Warren Zaïre-Emery","Fabián Ruiz","João Neves","Lee Kang-in","Marco Asensio","Ousmane Dembélé","Bradley Barcola","Randal Kolo Muani","Gonçalo Ramos","Désiré Doué","Khvicha Kvaratskhelia"],
  benfica:["Anatoliy Trubin","Samuel Soares","Nicolás Otamendi","Tomás Araújo","Alexander Bah","Álvaro Carreras","Fredrik Aursnes","Florentino Luís","Orkun Kökçü","Rafa Silva","Ángel Di María","Kerem Aktürkoğlu","Andreas Schjelderup","Gianluca Prestianni","Vangelis Pavlidis","Arthur Cabral","Jan-Niklas Beste","Renato Sanches","Antonio Silva","Leandro Barreiro"],
  realmadrid:["Thibaut Courtois","Andriy Lunin","Antonio Rüdiger","Éder Militão","David Alaba","Dean Huijsen","Ferland Mendy","Álvaro Carreras","Trent Alexander-Arnold","Dani Carvajal","Luka Modrić","Federico Valverde","Aurélien Tchouaméni","Eduardo Camavinga","Jude Bellingham","Arda Güler","Vinícius Jr.","Kylian Mbappé","Rodrygo","Endrick","Brahim Díaz"],
  qarabag:["Shahrudin Mahammadaliyev","Kady","Maxim Medvedev","Bahlul Mustafazade","Abbas Huseynov","Toral Bayramov","Richard Almedia","Abdellah Zoubir","Olavio Juninho","Filip Ozobić","Ramil Sheydaev","Julio Romão","Patrick Andrade","Jaime Romero","Marko Janković"],
  newcastle:["Nick Pope","Martin Dúbravka","Kieran Trippier","Dan Burn","Sven Botman","Fabian Schär","Lewis Hall","Lloyd Kelly","Tino Livramento","Joelinton","Bruno Guimarães","Sean Longstaff","Joe Willock","Sandro Tonali","Jacob Murphy","Harvey Barnes","Miguel Almirón","Anthony Gordon","Alexander Isak","Callum Wilson","Eli Adams"],
  clubbrugge:["Simon Mignolet","Joel Ordóñez","Brandon Mechele","Björn Meijer","Maxim De Cuyper","Raphael Onyedika","Casper Nielsen","Hans Vanaken","Andreas Skov Olsen","Christos Tzolis","Ferran Jutglà","Gustaf Nilsson","Hugo Vetlesen","Ardon Jashari","Michal Skóraś"],
  atletico:["Jan Oblak","Ivo Grbić","José Giménez","Robin Le Normand","César Azpilicueta","Reinildo Mandava","Javi Galán","Nahuel Molina","Marcos Llorente","Koke","Rodrigo De Paul","Pablo Barrios","Conor Gallagher","Axel Witsel","Antoine Griezmann","Ángel Correa","Julián Álvarez","Alexander Sörloth","Samuel Lino","Giuliano Simeone"],
  bodoglimt:["Nikita Haykin","Brice Wembangomo","Odin Bjortuft","Villads Nielsen","Fredrik Bjørkan","Patrick Berg","Ulrik Saltnes","Sondre Brunstad Fet","Jens Hauge","Albert Grønbæk","Isak Helstad Amundsen","Runar Espejord","Nino Zugelj","Kasper Høgh","Philip Zinckernagel","Brede Moe"],
  inter:["Yann Sommer","Josep Martinez","Alessandro Bastoni","Francesco Acerbi","Benjamin Pavard","Stefan de Vrij","Yann Bisseck","Federico Dimarco","Denzel Dumfries","Matteo Darmian","Hakan Çalhanoğlu","Nicolò Barella","Henrikh Mkhitaryan","Kristjan Asllani","Davide Frattesi","Marcus Thuram","Lautaro Martínez","Mehdi Taremi","Marko Arnautović","Piotr Zieliński"],
  olympiacos:["Konstantinos Tzolakis","Rodinei","Panagiotis Retsos","Santiago Hezze","Kostas Fortounis","Ayoub El Kaabi","Gelson Martins","Sotiris Alexandropoulos","Georgios Masouras","Mathieu Valbuena","Pape Abou Cissé","Ousseynou Ba"],
  leverkusen:["Lukáš Hrádecký","Matěj Kovář","Jonathan Tah","Piero Hincapié","Odilon Kossounou","Edmond Tapsoba","Alejandro Grimaldo","Jeremie Frimpong","Granit Xhaka","Robert Andrich","Florian Wirtz","Exequiel Palacios","Jonas Hofmann","Amine Adli","Moussa Diaby","Victor Boniface","Patrik Schick","Adam Hložek","Nathan Tella","Martin Terrier"],
  arsenal:["David Raya","Neto","William Saliba","Gabriel Magalhães","Ben White","Jakub Kiwior","Takehiro Tomiyasu","Oleksandr Zinchenko","Jurriën Timber","Riccardo Calafiori","Thomas Partey","Declan Rice","Martin Ødegaard","Jorginho","Mikel Merino","Kai Havertz","Gabriel Martinelli","Bukayo Saka","Leandro Trossard","Raheem Sterling","Gabriel Jesus","Ethan Nwaneri"],
  barcelona:["Marc-André ter Stegen","Iñaki Peña","Ronald Araújo","Pau Cubarsí","Jules Koundé","Alejandro Baldé","Andreas Christensen","Héctor Fort","Marc Casadó","Pedri","Gavi","Frenkie de Jong","Dani Olmo","Pablo Torre","Fermín López","Lamine Yamal","Raphinha","Robert Lewandowski","Ansu Fati","Ferran Torres","Eric García"],
  bayern:["Manuel Neuer","Sven Ulreich","Dayot Upamecano","Kim Min-jae","Eric Dier","Josip Stanišić","Alphonso Davies","Joshua Kimmich","Konrad Laimer","Leon Goretzka","Aleksandar Pavlović","Jamal Musiala","Leroy Sané","Serge Gnabry","Kingsley Coman","Michael Olise","Thomas Müller","Harry Kane","Mathys Tel","João Palhinha","Raphaël Guerreiro"],
  chelsea:["Robert Sánchez","Filip Jørgensen","Wesley Fofana","Levi Colwill","Benoît Badiashile","Marc Cucurella","Reece James","Malo Gusto","Moisés Caicedo","Enzo Fernández","Romeo Lavia","Kiernan Dewsbury-Hall","Cole Palmer","Noni Madueke","Pedro Neto","Mykhailo Mudryk","Jadon Sancho","Nicolas Jackson","Christopher Nkunku","João Félix","Renato Veiga"],
  liverpool:["Alisson Becker","Caoimhín Kelleher","Virgil van Dijk","Ibrahima Konaté","Joe Gomez","Jarell Quansah","Andrew Robertson","Trent Alexander-Arnold","Kostas Tsimikas","Ryan Gravenberch","Alexis Mac Allister","Dominik Szoboszlai","Curtis Jones","Harvey Elliott","Mohamed Salah","Luis Díaz","Diogo Jota","Darwin Núñez","Cody Gakpo","Chiesa"],
  mancity:["Ederson","Stefan Ortega","Rúben Dias","John Stones","Manuel Akanji","Nathan Aké","Joško Gvardiol","Kyle Walker","Rico Lewis","Mateo Kovačić","Rodri","Ilkay Gündoğan","Bernardo Silva","Kevin De Bruyne","Phil Foden","Jack Grealish","Savinho","Jeremy Doku","Erling Haaland","Nico O'Reilly","James McAtee"],
  sportingcp:["Israel","Franco Israel","Gonçalo Inácio","Matheus Reis","Jeremiah St. Juste","Eduardo Quaresma","Geny Catamo","Nuno Santos","Hidemasa Morita","Daniel Bragança","Morten Hjulmand","Pedro Gonçalves","Francisco Trincão","Marcus Edwards","Geovany Quenda","Viktor Gyökeres","Conrad Harder","Maximiliano Araújo"],
  tottenham:["Guglielmo Vicario","Fraser Forster","Cristian Romero","Micky van de Ven","Radu Drăgușin","Ben Davies","Destiny Udogie","Pedro Porro","Djed Spence","Yves Bissouma","Rodrigo Bentancur","James Maddison","Pape Sarr","Dejan Kulusevski","Son Heung-min","Brennan Johnson","Timo Werner","Richarlison","Dominic Solanke","Lucas Bergvall","Archie Gray"],
};

// ── ALL MATCHES (playoffs done, R16 in progress) ──
const ALL_MATCHES = [
  // KO Playoffs Leg 1 — FINISHED
  {id:"kp1_1",home:"galatasaray",away:"juventus",date:"2026-02-17",time:"21:00",stage:"KO Playoffs · Leg 1",status:"finished",hs:5,as:2,gs:[{name:"Mauro Icardi",team:"galatasaray",goals:2},{name:"Victor Osimhen",team:"galatasaray",goals:2},{name:"Kerem Aktürkoğlu",team:"galatasaray",goals:1},{name:"Dušan Vlahović",team:"juventus",goals:1},{name:"Kenan Yıldız",team:"juventus",goals:1}]},
  {id:"kp1_2",home:"dortmund",away:"atalanta",date:"2026-02-17",time:"21:00",stage:"KO Playoffs · Leg 1",status:"finished",hs:2,as:0,gs:[{name:"Serhou Guirassy",team:"dortmund",goals:1},{name:"Julian Brandt",team:"dortmund",goals:1}]},
  {id:"kp1_3",home:"monaco",away:"psg",date:"2026-02-17",time:"21:00",stage:"KO Playoffs · Leg 1",status:"finished",hs:2,as:3,gs:[{name:"Folarin Balogun",team:"monaco",goals:1},{name:"Eliesse Ben Seghir",team:"monaco",goals:1},{name:"Ousmane Dembélé",team:"psg",goals:1},{name:"Bradley Barcola",team:"psg",goals:1},{name:"Gonçalo Ramos",team:"psg",goals:1}]},
  {id:"kp1_4",home:"benfica",away:"realmadrid",date:"2026-02-17",time:"21:00",stage:"KO Playoffs · Leg 1",status:"finished",hs:0,as:1,gs:[{name:"Vinícius Jr.",team:"realmadrid",goals:1}]},
  {id:"kp1_5",home:"qarabag",away:"newcastle",date:"2026-02-18",time:"18:45",stage:"KO Playoffs · Leg 1",status:"finished",hs:1,as:6,gs:[{name:"Toral Bayramov",team:"qarabag",goals:1},{name:"Alexander Isak",team:"newcastle",goals:3},{name:"Anthony Gordon",team:"newcastle",goals:1},{name:"Bruno Guimarães",team:"newcastle",goals:1},{name:"Eli Adams",team:"newcastle",goals:1}]},
  {id:"kp1_6",home:"clubbrugge",away:"atletico",date:"2026-02-18",time:"21:00",stage:"KO Playoffs · Leg 1",status:"finished",hs:3,as:3,gs:[{name:"Gustaf Nilsson",team:"clubbrugge",goals:1},{name:"Hans Vanaken",team:"clubbrugge",goals:1},{name:"Ferran Jutglà",team:"clubbrugge",goals:1},{name:"Julián Álvarez",team:"atletico",goals:2},{name:"Antoine Griezmann",team:"atletico",goals:1}]},
  {id:"kp1_7",home:"bodoglimt",away:"inter",date:"2026-02-18",time:"21:00",stage:"KO Playoffs · Leg 1",status:"finished",hs:3,as:1,gs:[{name:"Jens Hauge",team:"bodoglimt",goals:1},{name:"Philip Zinckernagel",team:"bodoglimt",goals:1},{name:"Patrick Berg",team:"bodoglimt",goals:1},{name:"Lautaro Martínez",team:"inter",goals:1}]},
  {id:"kp1_8",home:"olympiacos",away:"leverkusen",date:"2026-02-18",time:"21:00",stage:"KO Playoffs · Leg 1",status:"finished",hs:0,as:2,gs:[{name:"Victor Boniface",team:"leverkusen",goals:1},{name:"Florian Wirtz",team:"leverkusen",goals:1}]},
  // R16 Leg 1 — FINISHED
  {id:"r16_1a",home:"galatasaray",away:"liverpool",date:"2026-03-10",time:"21:00",stage:"Round of 16 · Leg 1",status:"finished",hs:1,as:0,gs:[{name:"Victor Osimhen",team:"galatasaray",goals:1}]},
  {id:"r16_2a",home:"atalanta",away:"bayern",date:"2026-03-10",time:"21:00",stage:"Round of 16 · Leg 1",status:"finished",hs:1,as:6,gs:[{name:"Ademola Lookman",team:"atalanta",goals:1},{name:"Harry Kane",team:"bayern",goals:2},{name:"Jamal Musiala",team:"bayern",goals:2},{name:"Michael Olise",team:"bayern",goals:1},{name:"Thomas Müller",team:"bayern",goals:1}]},
  {id:"r16_3a",home:"atletico",away:"tottenham",date:"2026-03-10",time:"21:00",stage:"Round of 16 · Leg 1",status:"finished",hs:5,as:2,gs:[{name:"Julián Álvarez",team:"atletico",goals:2},{name:"Antoine Griezmann",team:"atletico",goals:2},{name:"Ángel Correa",team:"atletico",goals:1},{name:"Son Heung-min",team:"tottenham",goals:1},{name:"Dominic Solanke",team:"tottenham",goals:1}]},
  {id:"r16_4a",home:"newcastle",away:"barcelona",date:"2026-03-10",time:"21:00",stage:"Round of 16 · Leg 1",status:"finished",hs:1,as:1,gs:[{name:"Alexander Isak",team:"newcastle",goals:1},{name:"Robert Lewandowski",team:"barcelona",goals:1}]},
  {id:"r16_5a",home:"leverkusen",away:"arsenal",date:"2026-03-11",time:"21:00",stage:"Round of 16 · Leg 1",status:"finished",hs:1,as:1,gs:[{name:"Florian Wirtz",team:"leverkusen",goals:1},{name:"Bukayo Saka",team:"arsenal",goals:1}]},
  {id:"r16_6a",home:"bodoglimt",away:"sportingcp",date:"2026-03-11",time:"21:00",stage:"Round of 16 · Leg 1",status:"finished",hs:3,as:0,gs:[{name:"Jens Hauge",team:"bodoglimt",goals:1},{name:"Philip Zinckernagel",team:"bodoglimt",goals:1},{name:"Patrick Berg",team:"bodoglimt",goals:1}]},
  {id:"r16_7a",home:"psg",away:"chelsea",date:"2026-03-11",time:"21:00",stage:"Round of 16 · Leg 1",status:"finished",hs:5,as:2,gs:[{name:"Ousmane Dembélé",team:"psg",goals:2},{name:"Khvicha Kvaratskhelia",team:"psg",goals:1},{name:"Bradley Barcola",team:"psg",goals:1},{name:"Vitinha",team:"psg",goals:1},{name:"Cole Palmer",team:"chelsea",goals:1},{name:"Nicolas Jackson",team:"chelsea",goals:1}]},
  {id:"r16_8a",home:"realmadrid",away:"mancity",date:"2026-03-11",time:"21:00",stage:"Round of 16 · Leg 1",status:"finished",hs:3,as:0,gs:[{name:"Kylian Mbappé",team:"realmadrid",goals:1},{name:"Vinícius Jr.",team:"realmadrid",goals:1},{name:"Jude Bellingham",team:"realmadrid",goals:1}]},
  // R16 Leg 2 — TODAY (March 17-18)
  {id:"r16_6b",home:"sportingcp",away:"bodoglimt",date:"2026-03-17",time:"18:45",stage:"Round of 16 · Leg 2",status:"upcoming",hs:null,as:null,gs:[]},
  {id:"r16_5b",home:"arsenal",away:"leverkusen",date:"2026-03-17",time:"21:00",stage:"Round of 16 · Leg 2",status:"upcoming",hs:null,as:null,gs:[]},
  {id:"r16_7b",home:"chelsea",away:"psg",date:"2026-03-17",time:"21:00",stage:"Round of 16 · Leg 2",status:"upcoming",hs:null,as:null,gs:[]},
  {id:"r16_8b",home:"mancity",away:"realmadrid",date:"2026-03-17",time:"21:00",stage:"Round of 16 · Leg 2",status:"upcoming",hs:null,as:null,gs:[]},
  {id:"r16_4b",home:"barcelona",away:"newcastle",date:"2026-03-18",time:"18:45",stage:"Round of 16 · Leg 2",status:"upcoming",hs:null,as:null,gs:[]},
  {id:"r16_2b",home:"bayern",away:"atalanta",date:"2026-03-18",time:"21:00",stage:"Round of 16 · Leg 2",status:"upcoming",hs:null,as:null,gs:[]},
  {id:"r16_1b",home:"liverpool",away:"galatasaray",date:"2026-03-18",time:"21:00",stage:"Round of 16 · Leg 2",status:"upcoming",hs:null,as:null,gs:[]},
  {id:"r16_3b",home:"tottenham",away:"atletico",date:"2026-03-18",time:"21:00",stage:"Round of 16 · Leg 2",status:"upcoming",hs:null,as:null,gs:[]},
];

const Badge = ({k,sz=34})=>{const[e,setE]=useState(false);const t=T[k];if(!t)return null;if(e)return<div style={{width:sz,height:sz,borderRadius:"50%",background:`linear-gradient(135deg,${t.c[0]},${t.c[1]})`,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid rgba(255,255,255,0.1)",flexShrink:0}}><span style={{color:["#000","#241F20","#1C1C1C","#004170","#034694","#132257"].includes(t.c[0])?"#fff":"#000",fontSize:sz*.25,fontWeight:800}}>{t.s}</span></div>;return<img src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/${t.eid}.png&w=80&h=80`} alt={t.s} onError={()=>setE(true)} style={{width:sz,height:sz,borderRadius:"50%",objectFit:"contain",background:"rgba(255,255,255,0.9)",border:"2px solid rgba(255,255,255,0.12)",flexShrink:0}}/>};

const fmtD=d=>new Date(d+"T00:00:00").toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"});

export default function App(){
  const[user,setUser]=useState(null);
  const[view,setView]=useState("matches");
  const[matches,setMatches]=useState(ALL_MATCHES);
  const[preds,setPreds]=useState({});
  const[sel,setSel]=useState(null);
  const[ep,setEp]=useState(null);
  const[scorers,setScorers]=useState([]);
  const[search,setSearch]=useState("");
  const[showAll,setShowAll]=useState(null);
  const[loading,setLoading]=useState(true);
  const[toast,setToast]=useState(null);
  const[tab,setTab]=useState("upcoming"); // "upcoming" or "completed"
  const[squadTab,setSqTab]=useState("home");
  const[adminEdit,setAdminEdit]=useState({});
  const[admSrch,setAdmSrch]=useState({});
  const dropRef=useRef(null);

  useEffect(()=>{
    const init=async()=>{
      try{const r=await window.storage.get("ucl_preds");if(r)setPreds(JSON.parse(r.value));}catch(e){}
      try{const r=await window.storage.get("ucl_matches");if(r)setMatches(JSON.parse(r.value));}catch(e){}
      setLoading(false);
    };
    init();
  },[]);

  useEffect(()=>{const h=e=>{if(dropRef.current&&!dropRef.current.contains(e.target)){}};document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);},[]);

  const sv=async(k,v,fn)=>{fn(v);try{await window.storage.set(k,JSON.stringify(v));}catch(e){}};
  const pk=(mid,u)=>`${mid}_${u}`;
  const flash=(m,t="ok")=>{setToast({m,t});setTimeout(()=>setToast(null),3000);};

  // ── Score/Winner logic ──
  const setScore=(f,v)=>{const n={...ep,[f]:v};const h=f==="hs"?v:ep.hs,a=f==="as"?v:ep.as;if(h!==""&&a!==""){const hi=+h,ai=+a;if(!isNaN(hi)&&!isNaN(ai)){const m=matches.find(x=>x.id===sel);if(hi>ai)n.winner=m.home;else if(ai>hi)n.winner=m.away;else n.winner="draw";}}setEp(n);};
  const setWinner=(w,m)=>{const n={...ep,winner:w};const h=+ep.hs,a=+ep.as;if(!isNaN(h)&&!isNaN(a)){if(w===m.home&&h<=a)n.hs=String(a+1);else if(w===m.away&&a<=h)n.as=String(h+1);else if(w==="draw"&&h!==a)n.as=String(h);}setEp(n);};
  const totalG=()=>{if(!ep||ep.hs===""||ep.as==="")return null;const h=+ep.hs,a=+ep.as;return isNaN(h)||isNaN(a)?null:h+a;};
  const scorerG=()=>scorers.reduce((s,x)=>s+x.goals,0);
  const valid=()=>{if(!ep||!ep.winner||ep.hs===""||ep.as==="")return false;const h=+ep.hs,a=+ep.as,m=matches.find(x=>x.id===sel);if(ep.winner===m.home&&h<=a)return false;if(ep.winner===m.away&&a<=h)return false;if(ep.winner==="draw"&&h!==a)return false;const tot=h+a;return tot===0?true:scorerG()===tot;};
  const scoreErr=()=>{if(!ep||ep.hs===""||ep.as===""||!ep.winner)return null;const h=+ep.hs,a=+ep.as,m=matches.find(x=>x.id===sel);if(ep.winner===m.home&&h<=a)return`${T[m.home].s} winner but score disagrees`;if(ep.winner===m.away&&a<=h)return`${T[m.away].s} winner but score disagrees`;if(ep.winner==="draw"&&h!==a)return"Draw but scores aren't equal";return null;};
  const scorerErr=()=>{const tot=totalG();if(tot===null||tot===0)return null;const p=scorerG();if(p<tot)return`Need ${tot-p} more · ${p}/${tot}`;if(p>tot)return`Too many! ${p}/${tot}`;return null;};

  const addScorer=(name,team)=>{const ex=scorers.find(s=>s.name===name&&s.team===team);if(ex)setScorers(scorers.map(s=>s.name===name&&s.team===team?{...s,goals:s.goals+1}:s));else setScorers([...scorers,{name,team,goals:1}]);setSearch("");};

  const submit=async(mid)=>{if(!valid())return;if(preds[pk(mid,user)]){flash("Already submitted!","err");return;}const np={...preds,[pk(mid,user)]:{...ep,scorers,user,matchId:mid,at:new Date().toISOString()}};await sv("ucl_preds",np,setPreds);setEp(null);setScorers([]);setSel(null);flash("🔒 Prediction locked!");};

  const calcPts=(pred,m)=>{if(m.hs===null)return null;const pH=+pred.hs||0,pA=+pred.as||0,aH=m.hs,aA=m.as;let pts=0,gotR=false,gotS=false,sPts=0;const pR=pH>pA?"H":pH<pA?"A":"D",aR=aH>aA?"H":aH<aA?"A":"D";if(pR===aR){pts+=1;gotR=true;}if(pH===aH&&pA===aA){pts+=2;gotS=true;}if(pred.scorers?.length&&m.gs?.length){const norm=n=>(n||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z]/g,"");const used=new Set();pred.scorers.forEach(ps=>{const pN=norm(ps.name);const idx=m.gs.findIndex((as,i)=>{if(used.has(i))return false;const aN=norm(as.name);return pN===aN||pN.includes(aN)||aN.includes(pN);});if(idx!==-1){sPts+=1;used.add(idx);}});pts+=sPts;}const slam=gotR&&gotS&&sPts>0;if(slam)pts*=2;return{pts,gotR,gotS,sPts,slam};};

  const lb=()=>USERS.map(u=>{let tot=0,slams=0,played=0;matches.forEach(m=>{const p=preds[pk(m.id,u)];if(p&&m.hs!==null){played++;const r=calcPts(p,m);if(r){tot+=r.pts;if(r.slam)slams++;}}});return{user:u,tot,slams,played,cnt:matches.filter(m=>preds[pk(m.id,u)]).length};}).sort((a,b)=>b.tot-a.tot||b.slams-a.slams);

  const openPred=(m)=>{setEp({winner:"",hs:"",as:""});setScorers([]);setSearch("");setShowAll(null);setSel(m.id);setSqTab("home");};

  const ss={inp:{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,color:"#fff",outline:"none",boxSizing:"border-box"},btn:{background:"linear-gradient(135deg,#1a237e,#3f51b5)",border:"none",borderRadius:8,color:"#fff",fontWeight:700,cursor:"pointer"}};

  if(loading)return<div style={{minHeight:"100vh",background:"linear-gradient(180deg,#0a0e27,#131730,#0d1025)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui"}}><style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style><div style={{fontSize:40}}>⚽</div></div>;

  if(!user)return(
    <div style={{minHeight:"100vh",background:"linear-gradient(180deg,#0a0e27,#141833,#0d1025)",fontFamily:"'Segoe UI',system-ui",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:6}}><div style={{width:3,height:24,background:"linear-gradient(180deg,#1a237e,#3f51b5)",borderRadius:2}}/><span style={{fontSize:9,fontWeight:700,letterSpacing:4,color:"#5c6bc0"}}>UEFA CHAMPIONS LEAGUE</span><div style={{width:3,height:24,background:"linear-gradient(180deg,#3f51b5,#1a237e)",borderRadius:2}}/></div>
        <h1 style={{color:"#fff",fontSize:32,fontWeight:800,margin:"6px 0 2px",letterSpacing:-1}}>PREDICTOR</h1>
        <p style={{color:"#7986cb",fontSize:12,margin:0}}>2025/26 · Knockout Phase</p>
      </div>
      <div style={{width:"100%",maxWidth:340}}>
        <p style={{color:"#9fa8da",fontSize:11,textAlign:"center",marginBottom:10}}>Who's predicting?</p>
        {USERS.map((u,i)=><button key={u} onClick={()=>setUser(u)} style={{width:"100%",padding:"11px 14px",background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:10,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:10,marginBottom:4,animation:`fadeIn 0.25s ease ${i*0.04}s both`}} onMouseEnter={e=>{e.currentTarget.style.borderColor="#3f51b5";e.currentTarget.style.background="rgba(63,81,181,0.12)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.05)";e.currentTarget.style.background="rgba(255,255,255,0.025)";}}><div style={{width:30,height:30,borderRadius:"50%",background:CLR[i],display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{u[0]}</div>{u}</button>)}
      </div>
    </div>
  );

  // Filter matches
  const filtered=matches.filter(m=>tab==="upcoming"?m.status!=="finished":m.status==="finished");
  const grouped={};filtered.forEach(m=>{if(!grouped[m.date])grouped[m.date]=[];grouped[m.date].push(m);});

  const renderMatch=(m)=>{
    const ho=T[m.home],aw=T[m.away],myP=preds[pk(m.id,user)],cnt=USERS.filter(u=>preds[pk(m.id,u)]).length,open=sel===m.id,pts=myP&&m.hs!==null?calcPts(myP,m):null;
    return<div key={m.id} style={{marginBottom:5}}>
      <div onClick={()=>{if(open){setSel(null);setEp(null);setShowAll(null);}else if(!myP&&m.status==="upcoming")openPred(m);else{setSel(m.id);setShowAll(m.id);}}} style={{background:"rgba(255,255,255,0.025)",border:`1px solid ${open?"rgba(63,81,181,0.2)":"rgba(255,255,255,0.05)"}`,borderRadius:open?"12px 12px 0 0":12,padding:"12px 14px",cursor:"pointer"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><span style={{fontSize:8,color:"#5c6bc0",fontWeight:600,letterSpacing:1}}>{m.stage}</span><span style={{fontSize:8,fontWeight:700,color:m.status==="live"?"#4caf50":m.status==="finished"?"#ff9800":"#5c6bc0"}}>{m.status==="live"?"● LIVE":m.status==="finished"?"FT":m.time+" CET"}</span></div>
        <div style={{display:"flex",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:7,flex:1,minWidth:0}}><Badge k={m.home} sz={34}/><div><div style={{fontSize:13,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ho.n}</div><div style={{fontSize:8,color:"#7986cb"}}>{ho.co}</div></div></div>
          <div style={{padding:"0 8px",textAlign:"center",flexShrink:0,minWidth:50}}>{m.hs!==null?<div style={{fontSize:20,fontWeight:800,letterSpacing:2}}>{m.hs} – {m.as}</div>:<div style={{fontSize:11,color:"#5c6bc0",fontWeight:600}}>vs</div>}</div>
          <div style={{display:"flex",alignItems:"center",gap:7,flex:1,justifyContent:"flex-end",minWidth:0,textAlign:"right"}}><div><div style={{fontSize:13,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{aw.n}</div><div style={{fontSize:8,color:"#7986cb"}}>{aw.co}</div></div><Badge k={m.away} sz={34}/></div>
        </div>
        <div style={{marginTop:7,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          {myP?<div style={{fontSize:9,display:"flex",alignItems:"center",gap:5}}><span style={{color:"#4caf50"}}>🔒 {T[myP.winner]?.s||"DRAW"} {myP.hs}–{myP.as}</span>{pts&&<span style={{background:pts.slam?"rgba(255,215,0,0.15)":pts.pts>0?"rgba(76,175,80,0.15)":"rgba(255,255,255,0.04)",padding:"1px 5px",borderRadius:4,fontWeight:700,fontSize:9,color:pts.slam?"#ffd700":pts.pts>0?"#4caf50":"#5c6bc0"}}>{pts.slam?"🏆 ":""}+{pts.pts}</span>}</div>:<span style={{fontSize:9,color:m.status==="finished"?"#5c6bc0":"#ff9800"}}>{m.status==="finished"?"No prediction":"⚡ Tap to predict"}</span>}
          <span style={{fontSize:9,color:"#5c6bc0"}}>{cnt}/{USERS.length}</span>
        </div>
      </div>

      {open&&<div style={{background:"rgba(26,35,126,0.06)",border:"1px solid rgba(63,81,181,0.15)",borderTop:"none",borderRadius:"0 0 12px 12px",padding:12}}>
        <div style={{display:"flex",gap:4,marginBottom:12}}>
          {!myP&&m.status==="upcoming"&&<button onClick={e=>{e.stopPropagation();setShowAll(null);}} style={{flex:1,padding:6,background:showAll!==m.id?"rgba(63,81,181,0.2)":"rgba(255,255,255,0.03)",border:"1px solid rgba(63,81,181,0.15)",borderRadius:5,color:"#fff",fontSize:10,fontWeight:600,cursor:"pointer"}}>✏️ Predict</button>}
          <button onClick={e=>{e.stopPropagation();setShowAll(showAll===m.id?null:m.id);setEp(null);}} style={{flex:1,padding:6,background:showAll===m.id?"rgba(63,81,181,0.2)":"rgba(255,255,255,0.03)",border:"1px solid rgba(63,81,181,0.15)",borderRadius:5,color:"#fff",fontSize:10,fontWeight:600,cursor:"pointer"}}>👥 All ({cnt})</button>
        </div>

        {/* Prediction Form */}
        {ep&&showAll!==m.id&&!myP&&m.status==="upcoming"&&<div onClick={e=>e.stopPropagation()}>
          <div style={{marginBottom:10}}><div style={{fontSize:9,color:"#7986cb",fontWeight:600,letterSpacing:1,marginBottom:4}}>WINNER</div><div style={{display:"flex",gap:3}}>{[m.home,"draw",m.away].map(o=><button key={o} onClick={()=>setWinner(o,m)} style={{flex:1,padding:"8px 2px",background:ep.winner===o?"rgba(63,81,181,0.3)":"rgba(255,255,255,0.025)",border:ep.winner===o?"1px solid #3f51b5":"1px solid rgba(255,255,255,0.05)",borderRadius:5,color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>{o!=="draw"&&<Badge k={o} sz={16}/>}{o==="draw"?"Draw":T[o]?.s}</button>)}</div></div>
          <div style={{marginBottom:10}}><div style={{fontSize:9,color:"#7986cb",fontWeight:600,letterSpacing:1,marginBottom:4}}>SCORE</div><div style={{display:"flex",alignItems:"center",gap:5}}><div style={{flex:1,textAlign:"center"}}><div style={{fontSize:8,color:"#7986cb",marginBottom:2}}>{ho.s}</div><input type="number" min="0" max="20" value={ep.hs} onChange={e=>setScore("hs",e.target.value)} style={{...ss.inp,width:"100%",padding:7,fontSize:18,fontWeight:800,textAlign:"center"}}/></div><span style={{color:"#5c6bc0",fontWeight:800}}>:</span><div style={{flex:1,textAlign:"center"}}><div style={{fontSize:8,color:"#7986cb",marginBottom:2}}>{aw.s}</div><input type="number" min="0" max="20" value={ep.as} onChange={e=>setScore("as",e.target.value)} style={{...ss.inp,width:"100%",padding:7,fontSize:18,fontWeight:800,textAlign:"center"}}/></div></div>{scoreErr()&&<div style={{marginTop:4,padding:"4px 8px",background:"rgba(244,67,54,0.1)",border:"1px solid rgba(244,67,54,0.2)",borderRadius:4,fontSize:9,color:"#f44336",textAlign:"center"}}>⚠ {scoreErr()}</div>}{ep.winner&&ep.hs!==""&&ep.as!==""&&!scoreErr()&&<div style={{marginTop:4,fontSize:9,color:"#4caf50",textAlign:"center"}}>✓ {ep.winner==="draw"?"Draw":T[ep.winner]?.n+" wins"} {ep.hs}–{ep.as}</div>}</div>

          {/* Goalscorers */}
          <div style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><div style={{fontSize:9,color:"#7986cb",fontWeight:600,letterSpacing:1}}>GOALSCORERS</div><div style={{display:"flex",alignItems:"center",gap:6}}>{totalG()!==null&&totalG()>0&&<div style={{fontSize:9,fontWeight:700,color:scorerG()===totalG()?"#4caf50":scorerG()>totalG()?"#f44336":"#ff9800"}}>⚽ {scorerG()}/{totalG()}</div>}{totalG()===0&&<div style={{fontSize:9,color:"#4caf50",fontWeight:600}}>✓ 0–0</div>}</div></div>
            {scorers.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:6}}>{scorers.map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:3,background:"rgba(63,81,181,0.15)",border:"1px solid rgba(63,81,181,0.2)",borderRadius:5,padding:"3px 6px",fontSize:10}}><Badge k={s.team} sz={14}/><span style={{fontWeight:600}}>{s.name}</span>{s.goals>1&&<span style={{color:"#ffd700",fontWeight:700}}>×{s.goals}</span>}<button onClick={()=>addScorer(s.name,s.team)} style={{background:"none",border:"none",color:"#4caf50",cursor:"pointer",fontSize:11,padding:0,fontWeight:700}}>+</button><button onClick={()=>{const n=[...scorers];if(n[i].goals>1)n[i]={...n[i],goals:n[i].goals-1};else n.splice(i,1);setScorers(n);}} style={{background:"none",border:"none",color:"#f44336",cursor:"pointer",fontSize:11,padding:0,fontWeight:700}}>−</button></div>)}</div>}
            <div style={{display:"flex",gap:2,marginBottom:2}}>
              <button onClick={()=>setSqTab("home")} style={{flex:1,padding:"5px 4px",background:squadTab==="home"?`${ho.c[0]}22`:"rgba(255,255,255,0.02)",border:squadTab==="home"?`1px solid ${ho.c[0]}55`:"1px solid rgba(255,255,255,0.04)",borderRadius:"5px 5px 0 0",color:"#fff",fontSize:9,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:3}}><Badge k={m.home} sz={14}/>{ho.s}</button>
              <button onClick={()=>setSqTab("away")} style={{flex:1,padding:"5px 4px",background:squadTab==="away"?`${aw.c[0]}22`:"rgba(255,255,255,0.02)",border:squadTab==="away"?`1px solid ${aw.c[0]}55`:"1px solid rgba(255,255,255,0.04)",borderRadius:"5px 5px 0 0",color:"#fff",fontSize:9,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:3}}><Badge k={m.away} sz={14}/>{aw.s}</button>
            </div>
            <div ref={dropRef} style={{border:"1px solid rgba(255,255,255,0.06)",borderRadius:"0 0 6px 6px",overflow:"hidden"}}>
              <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${squadTab==="home"?ho.s:aw.s} players...`} style={{...ss.inp,width:"100%",padding:"6px 8px",fontSize:11,borderRadius:0,border:"none",borderBottom:"1px solid rgba(255,255,255,0.04)"}}/>
              <div style={{maxHeight:160,overflow:"auto",background:"rgba(0,0,0,0.15)"}}>{(()=>{const tk=squadTab==="home"?m.home:m.away;const pl=(SQ[tk]||[]).filter(p=>!search||p.toLowerCase().includes(search.toLowerCase()));if(!pl.length)return<div style={{padding:10,color:"#5c6bc0",fontSize:10,textAlign:"center"}}>No players found</div>;return pl.map((p,i)=>{const al=scorers.find(s=>s.name===p&&s.team===tk);return<button key={i} onClick={()=>addScorer(p,tk)} style={{display:"flex",alignItems:"center",gap:5,width:"100%",padding:"6px 8px",background:al?"rgba(63,81,181,0.08)":"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,0.02)",color:"#fff",fontSize:11,cursor:"pointer",textAlign:"left"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(63,81,181,0.1)"} onMouseLeave={e=>e.currentTarget.style.background=al?"rgba(63,81,181,0.08)":"transparent"}><span style={{width:4,height:4,borderRadius:"50%",background:T[tk].c[0],flexShrink:0}}/>{p}{al&&<span style={{marginLeft:"auto",fontSize:8,color:"#4caf50",fontWeight:700}}>✓ ×{al.goals}</span>}{!al&&<span style={{marginLeft:"auto",fontSize:8,color:"#5c6bc0"}}>+ add</span>}</button>;});})()}</div>
            </div>
          </div>
          {scorerErr()&&<div style={{marginBottom:6,padding:"4px 8px",background:"rgba(255,152,0,0.1)",border:"1px solid rgba(255,152,0,0.2)",borderRadius:4,fontSize:9,color:"#ff9800",textAlign:"center"}}>⚽ {scorerErr()}</div>}
          <button onClick={()=>submit(m.id)} disabled={!valid()} style={{...ss.btn,width:"100%",padding:10,fontSize:12,opacity:valid()?1:0.35}}>🔒 Submit Prediction</button>
          <div style={{fontSize:8,color:"#f44336",textAlign:"center",marginTop:4,opacity:0.7}}>Predictions are final</div>
        </div>}

        {myP&&showAll!==m.id&&<div style={{textAlign:"center",padding:8}}><div style={{fontSize:10,color:"#4caf50",fontWeight:600,marginBottom:4}}>🔒 Locked</div><div style={{fontSize:16,fontWeight:800}}>{T[myP.winner]?.s||"DRAW"} · {myP.hs}–{myP.as}</div>{myP.scorers?.length>0&&<div style={{marginTop:6,display:"flex",justifyContent:"center",gap:3,flexWrap:"wrap"}}>{myP.scorers.map((s,i)=><span key={i} style={{background:"rgba(63,81,181,0.12)",padding:"2px 6px",borderRadius:4,fontSize:9,fontWeight:600}}>⚽ {s.name}{s.goals>1?` ×${s.goals}`:""}</span>)}</div>}</div>}

        {showAll===m.id&&<div>{USERS.map(u=>{const p=preds[pk(m.id,u)],r=p&&m.hs!==null?calcPts(p,m):null;return<div key={u} style={{display:"flex",alignItems:"center",padding:"6px 8px",background:u===user?"rgba(63,81,181,0.06)":"transparent",borderRadius:5,marginBottom:2}}><div style={{width:22,height:22,borderRadius:"50%",background:CLR[USERS.indexOf(u)],display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,flexShrink:0,marginRight:7}}>{u[0]}</div><div style={{flex:1,minWidth:0}}><div style={{fontSize:11,fontWeight:600}}>{u}</div>{p?<div style={{fontSize:9,color:"#9fa8da",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{T[p.winner]?.s||"DRAW"} {p.hs}–{p.as}{p.scorers?.length>0&&<span style={{color:"#7986cb"}}> · {p.scorers.map(s=>`${s.name}${s.goals>1?`×${s.goals}`:""}`).join(", ")}</span>}</div>:<div style={{fontSize:9,color:"#5c6bc0"}}>—</div>}</div>{r&&<div style={{background:r.slam?"rgba(255,215,0,0.12)":r.pts>0?"rgba(76,175,80,0.12)":"rgba(255,255,255,0.03)",padding:"2px 7px",borderRadius:8,fontSize:10,fontWeight:700,color:r.slam?"#ffd700":r.pts>0?"#4caf50":"#5c6bc0"}}>{r.slam&&"🏆"}+{r.pts}</div>}</div>;})}</div>}
      </div>}
    </div>;
  };

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(180deg,#0a0e27,#131730,#0d1025)",fontFamily:"'Segoe UI',system-ui",color:"#fff"}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}input[type=number]{-moz-appearance:textfield}`}</style>
      {toast&&<div style={{position:"fixed",top:14,left:"50%",transform:"translateX(-50%)",zIndex:1e3,padding:"8px 18px",borderRadius:8,background:toast.t==="err"?"rgba(244,67,54,0.95)":"rgba(63,81,181,0.95)",color:"#fff",fontSize:12,fontWeight:600,boxShadow:"0 4px 16px rgba(0,0,0,0.3)"}}>{toast.m}</div>}

      <div style={{background:"linear-gradient(180deg,rgba(26,35,126,0.3),transparent)",borderBottom:"1px solid rgba(255,255,255,0.04)",padding:"10px 16px",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(20px)"}}><div style={{maxWidth:560,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:9,fontWeight:700,letterSpacing:3,color:"#5c6bc0"}}>UCL</span><div style={{width:1,height:12,background:"rgba(255,255,255,0.12)"}}/><span style={{fontSize:13,fontWeight:800}}>PREDICTOR</span></div><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{background:"rgba(63,81,181,0.2)",borderRadius:14,padding:"3px 10px",fontSize:11,fontWeight:600,color:"#9fa8da"}}>{user}</div><button onClick={()=>setUser(null)} style={{background:"none",border:"none",color:"#5c6bc0",cursor:"pointer",fontSize:10}}>Switch</button></div></div></div>

      <div style={{maxWidth:560,margin:"0 auto",padding:"8px 16px 0",display:"flex",gap:2}}>
        {["matches","leaderboard","admin"].map(t=><button key={t} onClick={()=>setView(t)} style={{flex:1,padding:"8px 0",background:view===t?"rgba(63,81,181,0.12)":"transparent",border:"none",borderBottom:view===t?"2px solid #3f51b5":"2px solid transparent",color:view===t?"#fff":"#5c6bc0",fontSize:11,fontWeight:600,cursor:"pointer",borderRadius:"5px 5px 0 0",textTransform:"capitalize"}}>{t}</button>)}
      </div>

      <div style={{maxWidth:560,margin:"0 auto",padding:14}}>

        {view==="matches"&&<div>
          {/* Upcoming / Completed toggle */}
          <div style={{display:"flex",gap:4,marginBottom:12}}>
            {["upcoming","completed"].map(t=><button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"8px 0",background:tab===t?"rgba(63,81,181,0.15)":"rgba(255,255,255,0.02)",border:tab===t?"1px solid rgba(63,81,181,0.3)":"1px solid rgba(255,255,255,0.04)",borderRadius:8,color:tab===t?"#fff":"#5c6bc0",fontSize:11,fontWeight:600,cursor:"pointer"}}>{t==="upcoming"?`⚡ Upcoming (${matches.filter(m=>m.status!=="finished").length})`:`✓ Completed (${matches.filter(m=>m.status==="finished").length})`}</button>)}
          </div>
          {Object.keys(grouped).length===0&&<div style={{textAlign:"center",padding:40,color:"#5c6bc0",fontSize:12}}>No {tab} matches</div>}
          {Object.entries(grouped).sort(([a],[b])=>tab==="completed"?b.localeCompare(a):a.localeCompare(b)).map(([date,ms])=><div key={date} style={{marginBottom:18}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}><div style={{width:3,height:3,borderRadius:"50%",background:"#3f51b5"}}/><span style={{fontSize:10,fontWeight:700,letterSpacing:2,color:"#7986cb"}}>{fmtD(date)}</span><div style={{flex:1,height:1,background:"rgba(255,255,255,0.04)"}}/></div>{ms.map(renderMatch)}</div>)}
        </div>}

        {view==="leaderboard"&&<div>
          <h2 style={{fontSize:15,fontWeight:800,letterSpacing:1,textAlign:"center",margin:"0 0 14px"}}>LEADERBOARD</h2>
          {lb().map((e,i)=><div key={e.user} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",background:i===0?"rgba(255,215,0,0.04)":"rgba(255,255,255,0.015)",border:`1px solid ${i===0?"rgba(255,215,0,0.1)":"rgba(255,255,255,0.03)"}`,borderRadius:10,marginBottom:3}}><div style={{width:24,textAlign:"center",fontSize:13,fontWeight:800,color:i===0?"#ffd700":i===1?"#c0c0c0":i===2?"#cd7f32":"#5c6bc0"}}>{i<3?["🥇","🥈","🥉"][i]:i+1}</div><div style={{width:30,height:30,borderRadius:"50%",background:i===0?"linear-gradient(135deg,#ffd700,#ff8f00)":CLR[USERS.indexOf(e.user)],display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{e.user[0]}</div><div style={{flex:1}}><div style={{fontSize:13,fontWeight:700}}>{e.user}</div><div style={{fontSize:9,color:"#7986cb"}}>{e.cnt} predicted · {e.slams>0?`${e.slams} slam${e.slams>1?"s":""} 🏆`:`${e.played} scored`}</div></div><div style={{fontSize:18,fontWeight:800,color:i===0?"#ffd700":"#fff"}}>{e.tot}</div><div style={{fontSize:8,color:"#5c6bc0",fontWeight:600}}>PTS</div></div>)}
          <div style={{marginTop:14,padding:12,background:"rgba(255,255,255,0.015)",borderRadius:10,border:"1px solid rgba(255,255,255,0.03)"}}><h3 style={{fontSize:10,fontWeight:700,color:"#7986cb",letterSpacing:1,margin:"0 0 6px"}}>SCORING</h3><div style={{fontSize:10,color:"#9fa8da",lineHeight:1.8}}><div>✅ Correct result = <strong style={{color:"#4caf50"}}>1 pt</strong></div><div>🎯 Exact score = <strong style={{color:"#4caf50"}}>2 pts</strong></div><div>⚽ Each correct scorer = <strong style={{color:"#4caf50"}}>1 pt</strong></div><div style={{marginTop:3,paddingTop:3,borderTop:"1px solid rgba(255,255,255,0.04)"}}>🏆 <strong style={{color:"#ffd700"}}>GRAND SLAM</strong> = <strong style={{color:"#ffd700"}}>ALL ×2</strong></div></div></div>
        </div>}

        {view==="admin"&&<div>
          <h2 style={{fontSize:15,fontWeight:800,letterSpacing:1,textAlign:"center",margin:"0 0 12px"}}>ADMIN</h2>
          {matches.filter(m=>m.status!=="finished").map(m=>{const ho=T[m.home],aw=T[m.away],ed=adminEdit[m.id]||{home:m.hs??"",away:m.as??"",status:m.status,scorers:m.gs||[],sqTab:"home"};const sr=admSrch[m.id]||"";return<div key={m.id} style={{padding:12,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.04)",borderRadius:10,marginBottom:5}}>
            <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:8}}><Badge k={m.home} sz={22}/><span style={{fontSize:11,fontWeight:700}}>{ho.s}</span><span style={{color:"#5c6bc0",fontSize:9}}>vs</span><span style={{fontSize:11,fontWeight:700}}>{aw.s}</span><Badge k={m.away} sz={22}/><span style={{marginLeft:"auto",fontSize:8,color:"#ff9800",fontWeight:600}}>PENDING</span></div>
            <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:8}}><input type="number" min="0" value={ed.home} onChange={e=>setAdminEdit({...adminEdit,[m.id]:{...ed,home:e.target.value}})} style={{...ss.inp,width:42,padding:6,fontSize:14,fontWeight:700,textAlign:"center"}}/><span style={{color:"#5c6bc0",fontWeight:700}}>:</span><input type="number" min="0" value={ed.away} onChange={e=>setAdminEdit({...adminEdit,[m.id]:{...ed,away:e.target.value}})} style={{...ss.inp,width:42,padding:6,fontSize:14,fontWeight:700,textAlign:"center"}}/><select value={ed.status} onChange={e=>setAdminEdit({...adminEdit,[m.id]:{...ed,status:e.target.value}})} style={{...ss.inp,flex:1,padding:6,fontSize:10}}><option value="upcoming">Upcoming</option><option value="live">Live</option><option value="finished">Finished</option></select></div>
            <div style={{marginBottom:8}}><div style={{fontSize:8,color:"#7986cb",fontWeight:600,letterSpacing:1,marginBottom:3}}>GOALSCORERS</div>
              {(ed.scorers||[]).length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:2,marginBottom:4}}>{ed.scorers.map((s,i)=><span key={i} style={{background:"rgba(63,81,181,0.1)",padding:"2px 6px",borderRadius:4,fontSize:9,display:"flex",alignItems:"center",gap:3}}><Badge k={s.team} sz={12}/>⚽ {s.name}{s.goals>1&&` ×${s.goals}`}<button onClick={()=>{const ns=[...ed.scorers];if(ns[i].goals>1)ns[i]={...ns[i],goals:ns[i].goals-1};else ns.splice(i,1);setAdminEdit({...adminEdit,[m.id]:{...ed,scorers:ns}});}} style={{background:"none",border:"none",color:"#f44336",cursor:"pointer",fontSize:9,padding:0}}>−</button><button onClick={()=>{const ns=ed.scorers.map((x,j)=>j===i?{...x,goals:x.goals+1}:x);setAdminEdit({...adminEdit,[m.id]:{...ed,scorers:ns}});}} style={{background:"none",border:"none",color:"#4caf50",cursor:"pointer",fontSize:9,padding:0}}>+</button></span>)}</div>}
              <div style={{display:"flex",gap:2,marginBottom:2}}><button onClick={()=>setAdminEdit({...adminEdit,[m.id]:{...ed,sqTab:"home"}})} style={{flex:1,padding:"4px",background:ed.sqTab==="home"?`${ho.c[0]}22`:"rgba(255,255,255,0.02)",border:ed.sqTab==="home"?`1px solid ${ho.c[0]}44`:"1px solid rgba(255,255,255,0.04)",borderRadius:"4px 4px 0 0",color:"#fff",fontSize:9,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:3}}><Badge k={m.home} sz={12}/>{ho.s}</button><button onClick={()=>setAdminEdit({...adminEdit,[m.id]:{...ed,sqTab:"away"}})} style={{flex:1,padding:"4px",background:ed.sqTab==="away"?`${aw.c[0]}22`:"rgba(255,255,255,0.02)",border:ed.sqTab==="away"?`1px solid ${aw.c[0]}44`:"1px solid rgba(255,255,255,0.04)",borderRadius:"4px 4px 0 0",color:"#fff",fontSize:9,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:3}}><Badge k={m.away} sz={12}/>{aw.s}</button></div>
              <div style={{border:"1px solid rgba(255,255,255,0.05)",borderRadius:"0 0 5px 5px",overflow:"hidden"}}><input type="text" value={sr} onChange={e=>setAdmSrch({...admSrch,[m.id]:e.target.value})} placeholder={`Search ${(ed.sqTab==="home"?ho:aw).s}...`} style={{...ss.inp,width:"100%",padding:"5px 7px",fontSize:10,borderRadius:0,border:"none",borderBottom:"1px solid rgba(255,255,255,0.03)"}}/><div style={{maxHeight:130,overflow:"auto",background:"rgba(0,0,0,0.1)"}}>{(()=>{const tk=ed.sqTab==="home"?m.home:m.away;return(SQ[tk]||[]).filter(p=>!sr||p.toLowerCase().includes(sr.toLowerCase())).map((p,i)=>{const al=(ed.scorers||[]).find(s=>s.name===p);return<button key={i} onClick={()=>{const ex=(ed.scorers||[]).find(s=>s.name===p&&s.team===tk);const ns=ex?ed.scorers.map(s=>s.name===p&&s.team===tk?{...s,goals:s.goals+1}:s):[...(ed.scorers||[]),{name:p,team:tk,goals:1}];setAdminEdit({...adminEdit,[m.id]:{...ed,scorers:ns}});setAdmSrch({...admSrch,[m.id]:""});}} style={{display:"flex",alignItems:"center",gap:4,width:"100%",padding:"5px 7px",background:al?"rgba(63,81,181,0.06)":"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,0.02)",color:"#fff",fontSize:10,cursor:"pointer",textAlign:"left"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(63,81,181,0.08)"} onMouseLeave={e=>e.currentTarget.style.background=al?"rgba(63,81,181,0.06)":"transparent"}><span style={{width:3,height:3,borderRadius:"50%",background:T[tk].c[0],flexShrink:0}}/>{p}{al&&<span style={{marginLeft:"auto",fontSize:8,color:"#4caf50",fontWeight:700}}>✓ ×{al.goals}</span>}</button>;});})()}</div></div>
            </div>
            <div style={{display:"flex",gap:4}}><button onClick={()=>{const up=matches.map(x=>x.id===m.id?{...x,hs:parseInt(ed.home)||0,as:parseInt(ed.away)||0,status:ed.status,gs:ed.scorers||[]}:x);sv("ucl_matches",up,setMatches);flash(`${ho.s} vs ${aw.s} saved!`);}} style={{...ss.btn,flex:1,padding:7,fontSize:10}}>Save Result</button><button onClick={()=>{const up=matches.map(x=>x.id===m.id?{...x,hs:null,as:null,status:"upcoming",gs:[]}:x);sv("ucl_matches",up,setMatches);setAdminEdit({...adminEdit,[m.id]:{home:"",away:"",status:"upcoming",scorers:[],sqTab:"home"}});flash("Score reset!");}} style={{padding:"7px 10px",background:"rgba(255,152,0,0.08)",border:"1px solid rgba(255,152,0,0.2)",borderRadius:8,color:"#ff9800",fontSize:9,fontWeight:600,cursor:"pointer"}}>↩️</button></div>
          </div>;})}
          {matches.filter(m=>m.status!=="finished").length===0&&<div style={{textAlign:"center",padding:30,color:"#5c6bc0",fontSize:12}}>All matches have results set</div>}
          <div style={{marginTop:12,padding:10,background:"rgba(244,67,54,0.04)",border:"1px solid rgba(244,67,54,0.15)",borderRadius:8}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:9,fontWeight:700,color:"#f44336"}}>⚠ DANGER ZONE</div><div style={{fontSize:9,color:"#9fa8da"}}>Reset all data</div></div><div style={{display:"flex",gap:4}}><button onClick={async()=>{if(!window.confirm("Reset ALL predictions?"))return;setPreds({});try{await window.storage.delete("ucl_preds");}catch(e){}flash("Predictions wiped!");}} style={{padding:"5px 8px",background:"rgba(244,67,54,0.1)",border:"1px solid rgba(244,67,54,0.2)",borderRadius:5,color:"#f44336",fontSize:8,fontWeight:600,cursor:"pointer"}}>Reset Preds</button><button onClick={async()=>{if(!window.confirm("FULL RESET?"))return;setPreds({});setMatches(ALL_MATCHES);try{await window.storage.delete("ucl_preds");await window.storage.delete("ucl_matches");}catch(e){}flash("🔥 Full reset!");}} style={{padding:"5px 8px",background:"rgba(244,67,54,0.2)",border:"1px solid rgba(244,67,54,0.3)",borderRadius:5,color:"#f44336",fontSize:8,fontWeight:700,cursor:"pointer"}}>🔥 Full Reset</button></div></div></div>
        </div>}
      </div>
    </div>
  );
}