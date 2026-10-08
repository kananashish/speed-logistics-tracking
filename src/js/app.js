const STORAGE_KEY = "speedLogisticsPrototype_v1";
const THEME_KEY = "speedLogisticsTheme_v2";
const stages = [
  {key:"Order Accepted", label:"Order accepted", location:"Delhi Booking Centre", note:"Shipment order created and tracking ID issued."},
  {key:"Picked Up", label:"Cargo picked up", location:"Delhi, India", note:"Cargo picked up from the sender."},
  {key:"At Origin Warehouse", label:"Received at origin warehouse", location:"Delhi Origin Warehouse", note:"Cargo received, scanned and registered at the origin facility."},
  {key:"Ready for Dispatch", label:"Sorted & ready for dispatch", location:"Delhi Origin Warehouse · Zone B / Rack 12", note:"Cargo sorted, packed and cleared for dispatch."},
  {key:"In Transit", label:"In transit", location:"En route to destination", note:"Shipment departed the origin hub on its assigned transport."},
  {key:"At Destination Hub", label:"Arrived at destination hub", location:"London Destination Hub", note:"Cargo arrival recorded and awaiting last-mile processing."},
  {key:"Out for Delivery", label:"Out for delivery", location:"London Delivery Route", note:"Delivery partner has taken custody of the shipment."},
  {key:"Delivered", label:"Delivered", location:"Recipient address", note:"Delivery marked complete. Proof of delivery should be recorded separately."}
];
const defaultShipments = [
 {id:"SL-2026-1042",recipient:"Olivia Carter",sender:"Aarav Mehta",origin:"Delhi, India",destination:"London, UK",contents:"Electronics · 2 cartons",weight:"18.5 kg",service:"International Express",statusIndex:2,warehouse:"Zone B · Rack 12 · Bin 04",flight:"SL 208 (demo)",airline:"Speed Air Cargo (demo)",departure:"2026-10-08 19:10",arrival:"2026-10-09 06:30",eta:"2026-10-09T14:00",agent:"Daniel Brooks",agentPhone:"+44 7700 900123",lastUpdate:"2026-10-08T10:15",events:[
 {stage:"Order Accepted",location:"Delhi Booking Centre",note:"Order confirmed and tracking ID generated.",time:"2026-10-08T08:40"},
 {stage:"Picked Up",location:"Delhi, India",note:"Cargo picked up from sender.",time:"2026-10-08T09:10"},
 {stage:"At Origin Warehouse",location:"Delhi Origin Warehouse",note:"Cargo scanned into the warehouse.",time:"2026-10-08T10:15"}]},
 {id:"SL-2026-1043",recipient:"Noah Williams",sender:"Mira Sharma",origin:"Noida, India",destination:"Mumbai, India",contents:"Documents · 1 pack",weight:"0.8 kg",service:"Domestic Priority",statusIndex:5,warehouse:"Mumbai Hub · Sort Area 2",flight:"SL 415 (demo)",airline:"Speed Air Cargo (demo)",departure:"2026-10-08 12:20",arrival:"2026-10-08 14:05",eta:"2026-10-08T18:00",agent:"Priya Singh",agentPhone:"+91 90000 12345",lastUpdate:"2026-10-08T14:10",events:[
 {stage:"Order Accepted",location:"Noida Booking Centre",note:"Order confirmed and tracking ID generated.",time:"2026-10-08T08:10"},
 {stage:"Picked Up",location:"Noida, India",note:"Cargo picked up from sender.",time:"2026-10-08T08:45"},
 {stage:"At Origin Warehouse",location:"Noida Origin Warehouse",note:"Cargo received and scanned.",time:"2026-10-08T09:15"},
 {stage:"Ready for Dispatch",location:"Noida Origin Warehouse · Zone A",note:"Sorted and loaded for line-haul transport.",time:"2026-10-08T10:30"},
 {stage:"In Transit",location:"En route to Mumbai",note:"Shipment departed Noida hub.",time:"2026-10-08T11:00"},
 {stage:"At Destination Hub",location:"Mumbai Destination Hub",note:"Arrival scan recorded at destination hub.",time:"2026-10-08T14:10"}]}
];
let storageAvailable = true;
let shipments = loadData();
let selectedOpsId = shipments[0]?.id || "";
let selectedDeliveryId = "";
let customerId = "SL-2026-1042";
function loadData(){try{const saved=localStorage.getItem(STORAGE_KEY);if(saved){const data=JSON.parse(saved);if(Array.isArray(data)&&data.length)return data}}catch(e){storageAvailable=false}return structuredClone(defaultShipments)}
function saveData(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(shipments));storageAvailable=true}catch(e){storageAvailable=false}}
function displayLocation(s){
 if((s.statusIndex===2||s.statusIndex===3)&&s.warehouse)return s.warehouse;
 if(s.statusIndex===4&&s.flight)return `In transit · ${s.flight}`;
 if(s.statusIndex===6&&s.agent)return `With ${s.agent} · ${s.destination}`;
 return currentStage(s).location;
}
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function currentStage(s){return stages[Math.min(Math.max(s.statusIndex,0),stages.length-1)]}
function fmtDate(value){if(!value)return "Not set";const d=new Date(value);if(Number.isNaN(d.getTime()))return value;return d.toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit",hour12:true})}
function fmtETA(value){if(!value)return "Pending update";const d=new Date(value);if(Number.isNaN(d.getTime()))return value;return d.toLocaleString("en-IN",{weekday:"short",day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit",hour12:true})}
function statusClass(s){if(s.statusIndex===7)return "green";if(s.statusIndex>=4)return "blue";if(s.statusIndex<=1)return "gray";return "amber"}
function badge(s){return `<span class="status ${statusClass(s)}"><i class="pill-dot"></i>${esc(currentStage(s).label)}</span>`}
function stampNow(){return new Date().toISOString().slice(0,16)}
function addEvent(s,stageIndex,location,note){const now=new Date().toISOString(),previous=currentStage(s).label;s.statusIndex=stageIndex;s.lastUpdate=now;s.events=s.events||[];s.events.push({stage:stages[stageIndex].key,location,note,time:now});recordActivity(s,"Status changed",`${previous} → ${stages[stageIndex].label}. ${note||""}`);saveData();renderAll();toast("Tracking updated — customer view refreshed.");}
function findShipment(id){return shipments.find(s=>s.id.toLowerCase()===String(id||"").trim().toLowerCase())}
function toast(msg,type="success"){const el=document.getElementById("toast");el.textContent=msg;el.classList.remove("success","error","warning-toast");el.classList.add("show",type);clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show","success","error","warning-toast"),3200)}
function applyTheme(theme, announce=false){const safeTheme=theme==="dark"?"dark":"light";document.documentElement.dataset.theme=safeTheme;const b=document.getElementById("themeToggle");if(b){b.innerHTML=safeTheme==="dark"?'☀️ <span class="hide-mobile">Light mode</span>':'🌙 <span class="hide-mobile">Dark mode</span>';b.setAttribute("aria-label",safeTheme==="dark"?"Switch to light mode":"Switch to dark mode");b.title=safeTheme==="dark"?"Switch to light mode":"Switch to dark mode"}try{localStorage.setItem(THEME_KEY,safeTheme)}catch(e){}if(announce)toast("Switched to "+safeTheme+" mode.") }
function initTheme(){let theme="light";try{theme=localStorage.getItem(THEME_KEY)||"light"}catch(e){}applyTheme(theme)}
function recordActivity(s,action,details){s.activity=s.activity||[];s.activity.unshift({action,details,time:new Date().toISOString()});if(s.activity.length>50)s.activity=s.activity.slice(0,50)}
function switchPanel(name){document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.panel===name));document.querySelectorAll(".panel").forEach(p=>p.classList.toggle("active",p.id===name));if(name==="operations")renderOperations();if(name==="delivery")renderDelivery()} 
document.getElementById("themeToggle").addEventListener("click",()=>applyTheme(document.documentElement.dataset.theme==="dark"?"light":"dark",true));
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>switchPanel(b.dataset.panel)));
document.getElementById("trackBtn").addEventListener("click",()=>trackShipment(document.getElementById("trackingSearch").value));
document.getElementById("trackingSearch").addEventListener("keydown",e=>{if(e.key==="Enter")trackShipment(e.target.value)});
document.querySelectorAll("[data-track]").forEach(b=>b.addEventListener("click",()=>{document.getElementById("trackingSearch").value=b.dataset.track;trackShipment(b.dataset.track)}));
function trackShipment(id){const s=findShipment(id);if(!s){customerId="";document.getElementById("customerResult").innerHTML=`<div class="empty"><div class="empty-icon">⌕</div><b>No shipment found</b><p class="small">Check the tracking ID and try again.</p></div>`;document.getElementById("customerTimeline").innerHTML="";return}customerId=s.id;document.getElementById("trackingSearch").value=s.id;renderCustomer(s)}
function renderCustomer(s=findShipment(customerId)){
 const result=document.getElementById("customerResult"),timeline=document.getElementById("customerTimeline");
 if(!s){result.innerHTML=`<div class="empty">Enter a valid tracking ID to see shipment details.</div>`;timeline.innerHTML="";return}
 const etaText=s.statusIndex===7?"Delivered":fmtETA(s.eta);
 result.innerHTML=`<div class="shipment-title"><div><div class="eyebrow">TRACKING ID</div><h2>${esc(s.id)}</h2><div class="small muted">Recipient: ${esc(s.recipient)}</div></div>${badge(s)}</div>
 <div class="metrics"><div class="metric"><div class="label">Estimated delivery</div><div class="value">${esc(etaText)}</div></div><div class="metric"><div class="label">Last confirmed location</div><div class="value">${esc(displayLocation(s))}</div></div><div class="metric"><div class="label">Last update</div><div class="value">${esc(fmtDate(s.lastUpdate))}</div></div></div>
 <div class="route"><div><div class="city">${esc(s.origin.split(",")[0])}</div><div class="code">${esc(s.origin)}</div></div><div class="route-mid">✈<span>SHIPMENT ROUTE</span></div><div style="text-align:right"><div class="city">${esc(s.destination.split(",")[0])}</div><div class="code">${esc(s.destination)}</div></div></div>
 <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:17px"><div><div class="small muted">Cargo</div><strong style="font-size:12px;display:block;margin-top:4px">${esc(s.contents)}</strong><div class="small muted" style="margin-top:3px">${esc(s.weight)}</div></div><div><div class="small muted">Transport details</div><strong style="font-size:12px;display:block;margin-top:4px">${esc(s.flight||"Not assigned")}</strong><div class="small muted" style="margin-top:3px">${esc(s.airline||"Carrier pending")}</div></div></div>
 ${s.statusIndex===7?`<div class="notice" style="margin-top:16px">✓ Delivery marked complete. Proof of delivery: ${s.pod?esc(s.pod):"<strong>Not recorded</strong>"}.</div>`:""}`;
 const events=s.events||[];
 const latestByStage=new Map();
 [...events].sort((a,b)=>new Date(a.time)-new Date(b.time)).forEach(e=>latestByStage.set(e.stage,e));
 timeline.innerHTML=`<div class="progress-wrap"><div class="progress-caption"><span>Journey progress</span><strong>${Math.round((s.statusIndex/(stages.length-1))*100)}% complete</strong></div><div class="progress-track"><div class="progress-fill" style="width:${Math.round((s.statusIndex/(stages.length-1))*100)}%"></div></div></div>`+stages.map((stage,index)=>{
   const event=latestByStage.get(stage.key);
   const state=index<s.statusIndex?"done":index===s.statusIndex?"current":"future";
   const location=event?.location||(index===s.statusIndex?displayLocation(s):stage.location);
   const note=state==="future"?stage.note:(event?.note||(index===s.statusIndex?"Current shipment checkpoint.":"Checkpoint completed."));
   const time=state==="future"?null:event?.time;
   return `<div class="event ${state}"><div class="event-dot"></div><div><h4>${esc(stage.label)}</h4><p>${esc(location)}${note?" · "+esc(note):""}</p><div class="time">${time?esc(fmtDate(time)):state==="future"?"Awaiting update":state==="current"?"Current checkpoint":"Recorded checkpoint"}</div></div></div>`;
 }).join("");
}
function renderStats(){const total=shipments.length,transit=shipments.filter(s=>s.statusIndex>=4&&s.statusIndex<7).length,warehouse=shipments.filter(s=>s.statusIndex>=2&&s.statusIndex<=3).length,delivered=shipments.filter(s=>s.statusIndex===7).length;document.getElementById("stats").innerHTML=[["Total shipments",total,"All tracked shipments","▤"],["In transit",transit,"Moving through the network","↗"],["At warehouse",warehouse,"Awaiting dispatch or handling","⌂"],["Delivered",delivered,"Completed shipments","✓"]].map(a=>`<div class="card stat"><div class="stat-top"><span>${a[0]}</span><span>${a[3]}</span></div><div class="stat-num">${a[1]}</div><div class="stat-foot">${a[2]}</div></div>`).join("")}
function renderOperations(){
 const filter=document.getElementById("statusFilter");
 if(filter && filter.options.length===1){stages.forEach((stage,index)=>{const option=document.createElement("option");option.value=String(index);option.textContent=stage.label;filter.appendChild(option)})}renderStats();const q=(document.getElementById("opsSearch")?.value||"").toLowerCase();const list=shipments.filter(s=>[s.id,s.destination,s.recipient,s.origin].join(" ").toLowerCase().includes(q));document.getElementById("shipmentRows").innerHTML=list.length?list.map(s=>`<tr><td><strong>${esc(s.id)}</strong><small>${esc(s.destination)}</small></td><td>${badge(s)}</td><td>${esc(displayLocation(s))}</td><td><button class="icon-btn" data-select-ops="${esc(s.id)}">Manage →</button></td></tr>`).join(""):`<tr><td colspan="4" class="muted">No matching shipments.</td></tr>`;
 document.querySelectorAll("[data-select-ops]").forEach(b=>b.addEventListener("click",()=>{
 const id=b.dataset.selectOps;
 selectedOpsId=id;
 customerId=id;
 document.getElementById("trackingSearch").value=id;
 renderCustomer(findShipment(id));
 renderOpsEditor();
 toast("Managing shipment "+id+" — customer tracking synced.");
 const editor=document.getElementById("opsEditor");
 if(window.matchMedia("(max-width: 760px)").matches)editor.scrollIntoView({behavior:"smooth",block:"start"});
 }));if(!findShipment(selectedOpsId))selectedOpsId=shipments[0]?.id||"";renderOpsEditor()}
document.getElementById("opsSearch").addEventListener("input",renderOperations);
if(document.getElementById("statusFilter"))document.getElementById("statusFilter").addEventListener("change",renderOperations);
function renderOpsEditor(){const s=findShipment(selectedOpsId),el=document.getElementById("opsEditor");if(!s){el.innerHTML=`<div class="empty">Create a shipment to get started.</div>`;return}
const next=s.statusIndex<7?s.statusIndex+1:null;
el.innerHTML=`<div class="shipment-title"><div><div class="eyebrow">SELECTED SHIPMENT</div><h2 style="font-size:18px;margin:6px 0">${esc(s.id)}</h2><div class="small muted">${esc(s.recipient)} · ${esc(s.destination)}</div></div>${badge(s)}</div>
<div class="progress-bar"><span style="width:${(s.statusIndex/(stages.length-1))*100}%"></span></div><div class="small muted" style="margin:7px 0 18px">Stage ${s.statusIndex+1} of ${stages.length}</div>
<div class="form-grid">
<div class="field"><label for="editWarehouse">WAREHOUSE / CURRENT LOCATION</label><input class="input" id="editWarehouse" value="${esc(s.warehouse||currentStage(s).location)}"/></div>
<div class="field"><label for="editETA">ESTIMATED DELIVERY</label><input class="input" id="editETA" type="datetime-local" value="${esc(s.eta||"")}"/></div>
<div class="field"><label for="editFlight">FLIGHT / TRANSPORT ID</label><input class="input" id="editFlight" value="${esc(s.flight||"")}"/></div>
<div class="field"><label for="editAirline">AIRLINE / CARRIER</label><input class="input" id="editAirline" value="${esc(s.airline||"")}"/></div>
<div class="field"><label for="editDeparture">SCHEDULED DEPARTURE</label><input class="input" id="editDeparture" value="${esc(s.departure||"")}"/></div>
<div class="field"><label for="editArrival">SCHEDULED ARRIVAL</label><input class="input" id="editArrival" value="${esc(s.arrival||"")}"/></div>
<div class="field"><label for="editAgent">DELIVERY AGENT</label><input class="input" id="editAgent" value="${esc(s.agent||"")}"/></div>
<div class="field"><label for="editPhone">AGENT CONTACT (DEMO)</label><input class="input" id="editPhone" value="${esc(s.agentPhone||"")}"/></div>
</div>
<div class="field" style="margin-top:14px"><label for="editNote">TRACKING EVENT NOTE</label><textarea id="editNote" rows="2" placeholder="Add a checkpoint note…">${esc(s.note||"")}</textarea></div>
<div class="inline-actions" style="margin-top:14px"><button class="btn primary" id="saveDetails">Save details</button><button class="btn soft" id="advanceStage" ${next===null?"disabled":""}>Advance stage →</button><button class="btn" id="customStage">Set stage</button></div>
<div class="notice" style="margin-top:14px">Saving details updates the shared shipment record. Advancing the stage adds a timestamped event to the customer timeline.</div>`;
document.getElementById("saveDetails").onclick=()=>{s.warehouse=document.getElementById("editWarehouse").value.trim();s.eta=document.getElementById("editETA").value;s.flight=document.getElementById("editFlight").value.trim();s.airline=document.getElementById("editAirline").value.trim();s.departure=document.getElementById("editDeparture").value.trim();s.arrival=document.getElementById("editArrival").value.trim();s.agent=document.getElementById("editAgent").value.trim();s.agentPhone=document.getElementById("editPhone").value.trim();s.note=document.getElementById("editNote").value.trim();recordActivity(s,"Shipment details updated","Shipment details were edited in Operations.");saveData();renderAll();toast("Shipment details saved.")};
document.getElementById("advanceStage").onclick=()=>{if(next===null)return;const location=next===3?(s.warehouse||stages[next].location):next===4?(s.flight+" · "+(s.airline||"Carrier pending")):next===6?(s.agent||"Delivery partner pending"):stages[next].location;addEvent(s,next,location,document.getElementById("editNote").value.trim()||stages[next].note)};
document.getElementById("customStage").onclick=()=>openStageModal(s.id);
}
function openStageModal(id){const s=findShipment(id);if(!s)return;document.getElementById("modalRoot").innerHTML=`<div class="modal-backdrop" id="modalBackdrop"><div class="modal"><h2>Record tracking checkpoint</h2><p class="sub">${esc(s.id)} · Select the confirmed stage to record.</p><div class="field"><label for="stageSelect">SHIPMENT STAGE</label><select id="stageSelect">${stages.map((st,i)=>`<option value="${i}" ${i===s.statusIndex?"selected":""}>${esc(st.label)}</option>`).join("")}</select></div><div class="field" style="margin-top:14px"><label for="stageLocation">LOCATION / CHECKPOINT</label><input id="stageLocation" class="input" value="${esc(currentStage(s).location)}"/></div><div class="field" style="margin-top:14px"><label for="stageNote">EVENT NOTE</label><textarea id="stageNote" rows="2">${esc(stages[s.statusIndex].note)}</textarea></div><div class="modal-actions"><button class="btn" id="cancelStage">Cancel</button><button class="btn primary" id="confirmStage">Record checkpoint</button></div></div></div>`;
document.getElementById("cancelStage").onclick=()=>document.getElementById("modalRoot").innerHTML="";document.getElementById("modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")document.getElementById("modalRoot").innerHTML=""});document.getElementById("confirmStage").onclick=()=>{const idx=Number(document.getElementById("stageSelect").value);if(idx===7&&!confirm("Record this shipment as Delivered? Confirm only if delivery is complete.")){toast("Status update cancelled.","warning-toast");return}const loc=document.getElementById("stageLocation").value.trim()||stages[idx].location,note=document.getElementById("stageNote").value.trim()||stages[idx].note;document.getElementById("modalRoot").innerHTML="";addEvent(s,idx,loc,note)}}
document.getElementById("newShipmentBtn").addEventListener("click",openNewShipmentModal);
function openNewShipmentModal(){document.getElementById("modalRoot").innerHTML=`<div class="modal-backdrop" id="newBackdrop"><div class="modal"><h2>Create a shipment</h2><p class="sub">Create a demo order and generate a trackable shipment ID.</p><form id="newShipmentForm"><div class="form-grid"><div class="field"><label>SHIPPER NAME</label><input class="input" name="sender" required placeholder="e.g. Aarav Mehta"/></div><div class="field"><label>RECIPIENT NAME</label><input class="input" name="recipient" required placeholder="e.g. Olivia Carter"/></div><div class="field"><label>ORIGIN</label><input class="input" name="origin" required placeholder="City, Country"/></div><div class="field"><label>DESTINATION</label><input class="input" name="destination" required placeholder="City, Country"/></div><div class="field"><label>CARGO DESCRIPTION</label><input class="input" name="contents" required placeholder="e.g. Documents · 1 pack"/></div><div class="field"><label>WEIGHT</label><input class="input" name="weight" placeholder="e.g. 2 kg"/></div><div class="field full"><label>SERVICE TYPE</label><select name="service"><option>Domestic Standard</option><option>Domestic Priority</option><option>International Express</option><option>International Economy</option></select></div></div><div class="modal-actions"><button type="button" class="btn" id="cancelNew">Cancel</button><button class="btn primary" type="submit">Create shipment</button></div></form></div></div>`;
document.getElementById("cancelNew").onclick=()=>document.getElementById("modalRoot").innerHTML="";document.getElementById("newBackdrop").addEventListener("click",e=>{if(e.target.id==="newBackdrop")document.getElementById("modalRoot").innerHTML=""});document.getElementById("newShipmentForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),id="SL-2026-"+String(Math.max(1043,...shipments.map(s=>Number(s.id.split("-").pop())||0))+1);const now=new Date().toISOString();const s={id,sender:f.get("sender"),recipient:f.get("recipient"),origin:f.get("origin"),destination:f.get("destination"),contents:f.get("contents"),weight:f.get("weight")||"Not specified",service:f.get("service"),statusIndex:0,warehouse:"Booking Centre",flight:"Not assigned",airline:"Not assigned",departure:"",arrival:"",eta:"",agent:"Not assigned",agentPhone:"",lastUpdate:now,events:[{stage:"Order Accepted",location:f.get("origin")+" Booking Centre",note:"Order accepted and tracking ID generated.",time:now}]};recordActivity(s,"Shipment created","Shipment record created in Operations.");shipments.unshift(s);selectedOpsId=id;customerId=id;saveData();document.getElementById("modalRoot").innerHTML="";renderAll();document.getElementById("trackingSearch").value=id;switchPanel("operations");toast("Shipment created: "+id)}}
function renderDelivery(){const queue=shipments.filter(s=>s.statusIndex>=5&&s.statusIndex<=7);document.getElementById("deliveryQueue").innerHTML=queue.length?queue.map(s=>`<div class="delivery-item"><div class="avatar">${esc((s.agent||"D").split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase())}</div><div class="grow"><h4>${esc(s.id)} · ${esc(s.recipient)}</h4><p>${esc(s.destination)} · ${esc(currentStage(s).label)}</p></div><button class="icon-btn" data-delivery="${esc(s.id)}">${selectedDeliveryId===s.id?"Close ×":"Open →"}</button></div>`).join(""):`<div class="empty"><div class="empty-icon">✓</div>No shipments are at the delivery stage yet. Advance a shipment to the destination hub in Operations.</div>`;
document.querySelectorAll("[data-delivery]").forEach(b=>b.onclick=()=>{const id=b.dataset.delivery;selectedDeliveryId=selectedDeliveryId===id?"":id;renderDelivery()});if(selectedDeliveryId&&findShipment(selectedDeliveryId))renderDeliveryEditor();else document.getElementById("deliveryEditor").innerHTML=`<div class="empty"><div class="empty-icon">♧</div>Select a shipment from the delivery queue.</div>`}
function renderDeliveryEditor(){const s=findShipment(selectedDeliveryId),el=document.getElementById("deliveryEditor");if(!s){el.innerHTML=`<div class="empty">Select a shipment from the queue.</div>`;return}
el.innerHTML=`<div class="agent-card"><div class="avatar">${esc((s.agent||"D").split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase())}</div><div><strong style="font-size:13px">${esc(s.agent||"No agent assigned")}</strong><div class="small muted" style="margin-top:4px">${esc(s.agentPhone||"Contact not provided")}</div></div></div><div class="form-grid" style="margin-top:16px"><div class="field full"><label for="deliveryAgent">ASSIGNED DELIVERY AGENT</label><input class="input" id="deliveryAgent" value="${esc(s.agent||"")}"/></div><div class="field full"><label for="deliveryPhone">CONTACT (DEMO)</label><input class="input" id="deliveryPhone" value="${esc(s.agentPhone||"")}"/></div><div class="field full"><label for="deliveryStatus">CURRENT STATUS · EDITABLE</label><select id="deliveryStatus">${stages.map((stage,i)=>`<option value="${i}" ${i===s.statusIndex?"selected":""}>${esc(stage.label)}</option>`).join("")}</select><div class="small muted" style="margin-top:5px">Use this to correct an accidental status update, including a shipment marked Delivered by mistake.</div></div></div><div class="inline-actions" style="margin-top:17px"><button class="btn primary" id="saveDeliveryStatus">Save status</button><button class="btn" id="saveAgent">Save assignment</button><button class="btn primary" id="outForDelivery" ${s.statusIndex>=6?"disabled":""}>Mark out for delivery</button><button class="btn dark" id="markDelivered" ${s.statusIndex===7?"disabled":""}>✓ Confirm delivery</button></div><div class="warning" style="margin-top:15px">Prototype note: delivery confirmation is simulated. In production, capture recipient acknowledgement or a secure proof-of-delivery record.</div>`;
document.getElementById("saveDeliveryStatus").onclick=()=>{const nextStatus=Number(document.getElementById("deliveryStatus").value);if(nextStatus===s.statusIndex){toast("Status is unchanged.");return}s.agent=document.getElementById("deliveryAgent").value.trim()||s.agent;s.agentPhone=document.getElementById("deliveryPhone").value.trim()||s.agentPhone;if(nextStatus<7)delete s.pod;const location=nextStatus===6?((s.agent||"Delivery partner")+" · "+s.destination):nextStatus===4?(s.flight+" · "+(s.airline||"Carrier pending")):nextStatus===7?s.destination:currentStage(s).location;addEvent(s,nextStatus,location,"Status corrected by operations in Delivery Desk.");selectedDeliveryId=s.id;renderDelivery();toast("Shipment status updated to "+stages[nextStatus].label+".")};
document.getElementById("saveAgent").onclick=()=>{s.agent=document.getElementById("deliveryAgent").value.trim();s.agentPhone=document.getElementById("deliveryPhone").value.trim();recordActivity(s,"Delivery assignment updated","Delivery agent and contact information updated.");saveData();renderAll();renderDeliveryEditor();toast("Delivery assignment saved.")};
document.getElementById("outForDelivery").onclick=()=>{s.agent=document.getElementById("deliveryAgent").value.trim()||s.agent;s.agentPhone=document.getElementById("deliveryPhone").value.trim()||s.agentPhone;addEvent(s,6,s.agent+" · "+s.destination,"Delivery partner took custody of the shipment and started the final-mile route.")};
document.getElementById("markDelivered").onclick=()=>{if(!confirm("Confirm this shipment has been delivered? This records demo proof-of-delivery information.")){toast("Delivery confirmation cancelled.","warning-toast");return}s.agent=document.getElementById("deliveryAgent").value.trim()||s.agent;s.agentPhone=document.getElementById("deliveryPhone").value.trim()||s.agentPhone;s.pod="Demo recipient confirmation · "+new Date().toLocaleString();addEvent(s,7,s.destination,"Delivered by "+(s.agent||"assigned delivery agent")+"; proof of delivery recorded (demo).")};
}

function renderActivity(s){
 const el=document.getElementById("activityHistory");if(!el)return;
 if(!s){el.innerHTML='<div class="empty">Select a shipment to view its activity.</div>';return}
 const items=[...(s.activity||[])];
 (s.events||[]).forEach(e=>items.push({action:"Tracking checkpoint",details:`${e.stage} · ${e.location||"Location not recorded"}${e.note?" — "+e.note:""}`,time:e.time}));
 items.sort((a,b)=>new Date(b.time||0)-new Date(a.time||0));
 el.innerHTML=items.length?items.slice(0,8).map(item=>`<div class="activity-item"><span class="activity-marker"></span><div><strong>${esc(item.action||"Activity")}</strong><p>${esc(item.details||"Update recorded.")}</p><time>${esc(fmtDate(item.time))}</time></div></div>`).join(""):'<div class="empty">No activity recorded yet.</div>';
}

function renderAll(){
 renderOperations();renderCustomer(findShipment(customerId));renderDelivery();renderActivity(findShipment(selectedOpsId));
 const footer=document.querySelector(".footer");
 if(footer&&!storageAvailable)footer.innerHTML="SPEED LOGISTICS · WORKING PROTOTYPE · <strong>Browser storage unavailable: changes may not persist after refresh.</strong> · Sample data only";
}
initTheme();
renderAll();
trackShipment(customerId);
