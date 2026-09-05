(() => {
  const $=s=>document.querySelector(s);
  const $$=s=>[...document.querySelectorAll(s)];
  const state={session:null,dashboard:null,current:null};
  const cfg=window.APP_CONFIG||{};

  class BridgeClient{
    constructor(url){this.url=url;this.frame=null;this.ready=false;this.pending=new Map();this.channel=crypto.randomUUID();this.waiters=[]}
    init(){
      if(!this.url || this.url.includes("PON_AQUI")) throw new Error("Falta configurar la URL de Apps Script en config.js.");
      this.frame=document.createElement("iframe");this.frame.style.display="none";
      this.frame.src=this.url+(this.url.includes("?")?"&":"?")+"mode=bridge&channel="+encodeURIComponent(this.channel);
      $("#bridgeMount").appendChild(this.frame);
      window.addEventListener("message",(e)=>this._onMessage(e));
      return new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(new Error("No fue posible conectar con el servidor.")),15000);this.waiters.push(()=>{clearTimeout(t);resolve()})})
    }
    _onMessage(e){
      if(e.source!==this.frame?.contentWindow) return;
      const m=e.data||{}; if(m.channel!==this.channel) return;
      if(m.type==="EOE_READY"){this.ready=true;this.waiters.splice(0).forEach(fn=>fn());return}
      if(m.type==="EOE_RESPONSE"&&this.pending.has(m.id)){const {resolve,reject,timer}=this.pending.get(m.id);clearTimeout(timer);this.pending.delete(m.id);m.ok?resolve(m.data):reject(new Error(m.error||"Error del servidor"))}
    }
    call(method,data={}){
      if(!this.ready) return Promise.reject(new Error("Servidor no disponible."));
      const id=crypto.randomUUID();
      return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{this.pending.delete(id);reject(new Error("La operación tardó demasiado."))},30000);
        this.pending.set(id,{resolve,reject,timer});
        this.frame.contentWindow.postMessage({type:"EOE_REQUEST",channel:this.channel,id,method,data},"*");
      })
    }
  }
  let bridge;

  const escapeHtml=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const toast=msg=>{const t=$("#toast");t.textContent=msg;t.classList.remove("hidden");setTimeout(()=>t.classList.add("hidden"),3200)};
  const err=(el,msg)=>{el.textContent=msg;el.classList.remove("hidden")};
  const clearErr=el=>{el.classList.add("hidden");el.textContent=""};

  async function boot(){
    try{bridge=new BridgeClient(cfg.bridgeUrl);await bridge.init();window.EOE_BRIDGE=bridge;window.dispatchEvent(new CustomEvent("eoe:bridge-ready"));$("#connectionBadge")?.classList.add("ok")}
    catch(e){$("#loginBtn").disabled=true;err($("#loginError"),e.message)}
    const token=sessionStorage.getItem("eoe_session");
    if(token){state.session=token;try{await loadDashboard()}catch(_){sessionStorage.removeItem("eoe_session");state.session=null}}
  }

  $("#togglePin").addEventListener("click",()=>{const p=$("#loginPin");p.type=p.type==="password"?"text":"password"});
  $("#loginForm").addEventListener("submit",async e=>{
    e.preventDefault();clearErr($("#loginError"));const btn=$("#loginBtn");btn.disabled=true;btn.textContent="Verificando…";
    try{
      const login=$("#loginCurp").value.trim().toUpperCase(), pin=$("#loginPin").value.trim();
      const r=await bridge.call("login",{login,pin});
      state.session=r.token;sessionStorage.setItem("eoe_session",r.token);$("#loginPin").value="";await loadDashboard();toast("Acceso correcto");
    }catch(ex){err($("#loginError"),ex.message)}
    finally{btn.disabled=false;btn.textContent="Ingresar"}
  });
  $("#logoutBtn").addEventListener("click",async()=>{try{if(state.session) await bridge.call("logout",{token:state.session})}catch(_){}
    sessionStorage.removeItem("eoe_session");state.session=null;state.dashboard=null;$("#appView").classList.add("hidden");$("#loginView").classList.remove("hidden");
  });

  async function loadDashboard(){
    const d=await bridge.call("dashboard",{token:state.session});state.dashboard=d;
    $("#loginView").classList.add("hidden");$("#appView").classList.remove("hidden");
    $("#studentName").textContent=d.student.nombre;
    $("#studentMeta").innerHTML=[
      `Grado ${escapeHtml(d.student.grado)}°`, `Grupo ${escapeHtml(d.student.grupo)}`, `Expediente ${escapeHtml(d.student.expediente)}`,
      `Ciclo ${escapeHtml(d.student.ciclo)}`
    ].map(x=>`<span>${x}</span>`).join("");
    $("#progressPct").textContent=d.progress+"%";$("#progressBar").style.width=d.progress+"%";
    $("#progressText").textContent=`${d.completed} de ${d.total} actividades`;
    renderActivities(d.activities);
    const c=d.certificate||{};$("#certificateText").textContent=c.url?"Tu constancia está disponible para consulta.":d.progress===100?"Tu expediente está completo. La constancia se generará o habilitará conforme a la configuración de Orientación Educativa.":"Completa el 100% del expediente para habilitar tu constancia.";
    const link=$("#certificateLink");if(c.url){link.href=c.url;link.classList.remove("hidden")}else link.classList.add("hidden");
  }

  function renderActivities(items){
    $("#activitiesGrid").innerHTML=items.map(a=>{
      const complete=a.estado==="COMPLETADO", locked=!a.unlocked&&!complete;
      return `<article class="activity-card ${complete?"complete":locked?"locked":""}">
        <div class="activity-number">${complete?"✓":a.orden}</div>
        <div><h4>${escapeHtml(a.nombre)}</h4><p>${escapeHtml(a.tipo)}</p>
          <span class="status ${complete?"complete":locked?"locked":"available"}">${complete?"Completado":locked?"Bloqueado":"Disponible"}</span>
        </div>
        <div class="activity-actions">
          ${complete&&a.pdfUrl?`<a class="btn ghost" href="${escapeHtml(a.pdfUrl)}" target="_blank" rel="noopener">Ver PDF</a>`:""}
          ${!complete&&!locked?`<button class="btn primary" type="button" data-open="${escapeHtml(a.id)}">Realizar</button>`:""}
        </div>
      </article>`;
    }).join("");
    $$("[data-open]").forEach(b=>b.addEventListener("click",()=>openActivity(b.dataset.open)));
  }

  function openActivity(id){
    const a=state.dashboard.activities.find(x=>x.id===id);if(!a)return;
    state.current=a;$("#dialogTitle").textContent=a.nombre;$("#dialogType").textContent=a.tipo;
    $("#dialogBody").innerHTML=renderForm(id);clearErr($("#dialogError"));$("#activityDialog").showModal();
  }

  function fieldHtml(f){
    const wide=f.wide?"wide":"";const required=f.required?"required":"";
    if(f.type==="select")return `<label class="${wide}">${escapeHtml(f.label)}<select name="${f.name}" ${required}><option value="">Selecciona…</option>${f.options.map(o=>`<option>${escapeHtml(o)}</option>`).join("")}</select></label>`;
    const type=f.inputType||f.type||"text";return `<label class="${wide}">${escapeHtml(f.label)}<input type="${type}" name="${f.name}" ${required} ${f.maxlength?`maxlength="${f.maxlength}"`:""} ${f.inputmode?`inputmode="${f.inputmode}"`:""}></label>`;
  }
  function sectionsHtml(def){return def.sections.map(s=>`<section class="form-section"><h3>${escapeHtml(s.title)}</h3><div class="form-grid">${s.fields.map(fieldHtml).join("")}</div></section>`).join("")}
  function scaleHtml(items,namePrefix,labels){
    return items.map((q,i)=>`<div class="scale-item"><p>${i+1}. ${escapeHtml(q)}</p><div class="scale-options">${labels.map(([txt,val])=>`<label><input required type="radio" name="${namePrefix}${i}" value="${val}">${txt}</label>`).join("")}</div></div>`).join("")
  }
  function renderForm(id){
    if(id==="FICHA_IDENTIFICACION") return sectionsHtml(EOE_FORMS.ficha);
    if(id==="BIOPSICOSOCIAL") return sectionsHtml(EOE_FORMS.bio);
    if(id==="SOCIOECONOMICO") return sectionsHtml(EOE_FORMS.socio);
    if(id==="BARSCH") return `<section class="form-section"><h3>Test de Barsch</h3><p class="hint">Responde de la manera más sincera posible.</p>${scaleHtml(EOE_FORMS.barschItems,"b_",[["Casi nunca",0],["Pocas veces",1],["Algunas veces",2],["Habitualmente",3],["Casi siempre",4]])}</section>`;
    if(id==="HABITOS_ESTUDIO") return Object.entries(EOE_FORMS.habits).map(([area,items])=>`<section class="form-section"><h3>${escapeHtml(area)}</h3>${scaleHtml(items,"h_"+slug(area)+"_",[["Nunca",0],["A veces",1],["Casi siempre",2],["Siempre",3]])}</section>`).join("");
    if(id==="FAMILIOGRAMA") return `<section class="form-section"><h3>Datos familiares</h3><div class="form-grid">
      ${fieldHtml({name:"padreNombreFam",label:"Nombre del padre"})}${fieldHtml({name:"padreEdadFam",label:"Edad del padre",type:"number"})}
      ${fieldHtml({name:"padreRelacionFam",label:"Relación con el padre"})}${fieldHtml({name:"viveConPadre",label:"¿Vive con el padre?",type:"select",options:["Sí","No"]})}
      ${fieldHtml({name:"madreNombreFam",label:"Nombre de la madre"})}${fieldHtml({name:"madreEdadFam",label:"Edad de la madre",type:"number"})}
      ${fieldHtml({name:"madreRelacionFam",label:"Relación con la madre"})}${fieldHtml({name:"viveConMadre",label:"¿Vive con la madre?",type:"select",options:["Sí","No"]})}
      ${fieldHtml({name:"viveConOtros",label:"¿Vive con otros familiares?",type:"select",options:["Sí","No"]})}
    </div></section><section class="form-section"><h3>Integrantes del hogar</h3><p class="hint">Agrega a las personas que consideres necesarias.</p><div id="familyList" class="family-list"></div><button class="btn ghost" type="button" id="addFamily">+ Agregar integrante</button></section>`;
    return `<p>No hay formulario configurado.</p>`;
  }
  function slug(s){return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^A-Za-z0-9]+/g,"_").replace(/^_|_$/g,"")}
  $("#activityDialog").addEventListener("close",()=>{state.current=null});
  $("#activityDialog").addEventListener("click",e=>{
    if(e.target.id==="addFamily"){addFamilyRow()}
    if(e.target.matches("[data-remove-family]")) e.target.closest(".family-row").remove();
  });
  const observer=new MutationObserver(()=>{if($("#addFamily")&&$("#familyList")&&!$("#familyList").children.length)addFamilyRow()});observer.observe($("#dialogBody"),{childList:true,subtree:true});
  function addFamilyRow(){
    $("#familyList").insertAdjacentHTML("beforeend",`<div class="family-row">
      <label>Nombre<input name="fam_nombre" required></label><label>Parentesco<input name="fam_parentesco" required></label>
      <label>Edad<input name="fam_edad" type="number"></label><label>Convive<select name="fam_convive"><option>Sí</option><option>No</option></select></label>
      <label>Relación<select name="fam_relacion"><option>Excelente</option><option>Buena</option><option>Regular</option><option>Difícil</option></select></label>
      <button type="button" class="icon-btn" data-remove-family>✕</button></div>`);
  }

  $("#activityForm").addEventListener("submit",async e=>{
    e.preventDefault();if(!state.current)return;
    const btn=$("#saveActivityBtn");btn.disabled=true;btn.textContent="Guardando…";clearErr($("#dialogError"));
    try{
      const payload=collectPayload(state.current.id,new FormData(e.currentTarget));
      const r=await bridge.call("saveActivity",{token:state.session,activityId:state.current.id,payload});
      $("#activityDialog").close();toast(r.message||"Actividad guardada");await loadDashboard();
      if(r.whatsappUrl && confirm("Actividad completada. ¿Deseas abrir WhatsApp para compartir el acuse?")) window.open(r.whatsappUrl,"_blank","noopener");
    }catch(ex){err($("#dialogError"),ex.message)}
    finally{btn.disabled=false;btn.textContent="Guardar y finalizar"}
  });
  function collectPayload(id,fd){
    if(id==="BARSCH") return {respuestas:EOE_FORMS.barschItems.map((_,i)=>Number(fd.get("b_"+i)))};
    if(id==="HABITOS_ESTUDIO"){
      const respuestas={};for(const [area,items] of Object.entries(EOE_FORMS.habits)){respuestas[area]=items.map((_,i)=>Number(fd.get("h_"+slug(area)+"_"+i)))}return {respuestas};
    }
    if(id==="FAMILIOGRAMA"){
      const obj={};for(const [k,v] of fd.entries()) if(!k.startsWith("fam_"))obj[k]=v;
      const names=fd.getAll("fam_nombre"),pars=fd.getAll("fam_parentesco"),ages=fd.getAll("fam_edad"),con=fd.getAll("fam_convive"),rel=fd.getAll("fam_relacion");
      obj.miembros=names.map((n,i)=>({nombre:n,parentesco:pars[i],edad:ages[i],convive:con[i],relacion:rel[i]}));return obj;
    }
    const obj={};for(const [k,v] of fd.entries())obj[k]=v;return obj;
  }

  boot();
})();