(() => {
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const adminState = { token:null, data:null, students:[] };

  const showError = (el,msg)=>{el.textContent=msg;el.classList.remove("hidden")};
  const clearError = el=>{el.textContent="";el.classList.add("hidden")};
  const toast = msg => { const t=$("#toast"); t.textContent=msg; t.classList.remove("hidden"); setTimeout(()=>t.classList.add("hidden"),3500); };

  function bridge(){ return window.EOE_BRIDGE; }

  function setMode(mode){
    const admin = mode==="admin";
    $("#studentModeBtn").classList.toggle("active",!admin);
    $("#adminModeBtn").classList.toggle("active",admin);
    $("#studentLoginPanel").classList.toggle("hidden",admin);
    $("#adminLoginPanel").classList.toggle("hidden",!admin);
  }

  $("#studentModeBtn").addEventListener("click",()=>setMode("student"));
  $("#adminModeBtn").addEventListener("click",()=>setMode("admin"));
  $("#toggleAdminPassword").addEventListener("click",()=>{
    const i=$("#adminPassword"); i.type=i.type==="password"?"text":"password";
  });

  $("#adminLoginForm").addEventListener("submit",async e=>{
    e.preventDefault(); clearError($("#adminLoginError"));
    const btn=$("#adminLoginBtn"); btn.disabled=true; btn.textContent="Verificando…";
    try{
      if(!bridge()) throw new Error("El servidor todavía no está disponible.");
      const r=await bridge().call("adminLogin",{usuario:$("#adminUser").value.trim(),password:$("#adminPassword").value});
      adminState.token=r.token;
      sessionStorage.setItem("eoe_admin_session",r.token);
      sessionStorage.removeItem("eoe_session");
      $("#adminPassword").value="";
      await loadAdminDashboard();
      toast("Acceso administrativo correcto");
    }catch(ex){showError($("#adminLoginError"),ex.message)}
    finally{btn.disabled=false;btn.textContent="Ingresar como administrador"}
  });

  async function loadAdminDashboard(){
    const d=await bridge().call("adminDashboard",{token:adminState.token});
    adminState.data=d; adminState.students=d.students||[];
    $("#loginView").classList.add("hidden");
    $("#appView").classList.add("hidden");
    $("#adminView").classList.remove("hidden");
    $("#adminWelcome").textContent=`Sesión de ${d.admin.usuario}. Actualización: ${d.updatedAt}`;
    $("#statActive").textContent=d.stats.active;
    $("#statComplete").textContent=d.stats.complete;
    $("#statPending").textContent=d.stats.pending;
    $("#statAverage").textContent=d.stats.average+"%";
    fillFilters();
    renderStudents();
  }

  function fillFilters(){
    const grades=[...new Set(adminState.students.map(s=>String(s.grado||"")).filter(Boolean))].sort();
    const groups=[...new Set(adminState.students.map(s=>String(s.grupo||"")).filter(Boolean))].sort();
    const g=$("#adminGradeFilter"), gr=$("#adminGroupFilter");
    const gv=g.value, grv=gr.value;
    g.innerHTML='<option value="">Todos los grados</option>'+grades.map(x=>`<option value="${esc(x)}">${esc(x)}°</option>`).join("");
    gr.innerHTML='<option value="">Todos los grupos</option>'+groups.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join("");
    g.value=grades.includes(gv)?gv:""; gr.value=groups.includes(grv)?grv:"";
  }

  function filteredStudents(){
    const q=$("#adminSearch").value.trim().toLowerCase();
    const grade=$("#adminGradeFilter").value, group=$("#adminGroupFilter").value, p=$("#adminProgressFilter").value;
    return adminState.students.filter(s=>{
      const hay=[s.nombre,s.expediente,s.curp].join(" ").toLowerCase();
      if(q && !hay.includes(q)) return false;
      if(grade && String(s.grado)!==grade) return false;
      if(group && String(s.grupo)!==group) return false;
      if(p==="complete" && Number(s.progress)!==100) return false;
      if(p==="pending" && Number(s.progress)===100) return false;
      return true;
    });
  }

  function renderStudents(){
    const rows=filteredStudents();
    $("#adminStudentsBody").innerHTML=rows.map(s=>`<tr>
      <td><strong>${esc(s.nombre)}</strong><small>${esc(s.telefonoTutor||"Sin teléfono de tutor")}</small></td>
      <td>${esc(s.grado)}° / ${esc(s.grupo)}</td>
      <td>${esc(s.expediente||"—")}</td>
      <td><div class="mini-progress"><span style="width:${Number(s.progress)||0}%"></span></div><small>${Number(s.progress)||0}% · ${s.completed}/${s.total}</small></td>
      <td><span class="status ${Number(s.progress)===100?"complete":"available"}">${Number(s.progress)===100?"Completo":"En proceso"}</span></td>
      <td class="right"><button class="btn ghost small-btn" data-admin-open="${esc(s.id)}">Abrir</button></td>
    </tr>`).join("");
    $("#adminEmpty").classList.toggle("hidden",rows.length>0);
    document.querySelectorAll("[data-admin-open]").forEach(b=>b.addEventListener("click",()=>openStudent(b.dataset.adminOpen)));
  }

  ["adminSearch","adminGradeFilter","adminGroupFilter","adminProgressFilter"].forEach(id=>{
    $("#"+id).addEventListener(id==="adminSearch"?"input":"change",renderStudents);
  });

  async function openStudent(id){
    try{
      const d=await bridge().call("adminStudentDetail",{token:adminState.token,studentId:id});
      $("#adminStudentTitle").textContent=d.student.nombre;
      const docs=(d.documents||[]).map(x=>`<li><div><strong>${esc(x.nombre||x.tipo)}</strong><small>${esc(x.fecha||"")}</small></div>${x.url?`<a class="btn ghost small-btn" href="${esc(x.url)}" target="_blank" rel="noopener">Abrir PDF</a>`:""}</li>`).join("") || '<li class="muted">Sin documentos generados.</li>';
      const acts=(d.dashboard.activities||[]).map(a=>`<li><div><strong>${esc(a.nombre)}</strong><small>${esc(a.tipo)}</small></div><span class="status ${a.estado==="COMPLETADO"?"complete":"available"}">${a.estado==="COMPLETADO"?"Completado":"Pendiente"}</span></li>`).join("");
      const diag=objectRows(d.diagnostics||[]);
      const cond=objectRows(d.conductual||[]);
      const c=d.closure||{};
      const wa=d.student.telefonoTutor?`https://wa.me/52${String(d.student.telefonoTutor).replace(/\D/g,"")}?text=${encodeURIComponent(`EPOANT · Orientación Educativa\n${d.student.nombre}\nAvance actual del expediente: ${d.dashboard.progress}%.\nFavor de apoyar para completar las actividades pendientes.`)}`:"";
      $("#adminStudentBody").innerHTML=`
        <div class="detail-grid">
          <section class="detail-card"><h3>Datos del estudiante</h3>
            <dl><dt>Expediente</dt><dd>${esc(d.student.expediente||"—")}</dd><dt>CURP</dt><dd>${esc(d.student.curp||"—")}</dd><dt>Grado / Grupo</dt><dd>${esc(d.student.grado)}° / ${esc(d.student.grupo)}</dd><dt>Tutor</dt><dd>${esc(d.student.tutor||"—")}</dd><dt>Teléfono tutor</dt><dd>${esc(d.student.telefonoTutor||"—")}</dd></dl>
            ${wa?`<a class="btn primary full" href="${wa}" target="_blank" rel="noopener">Enviar recordatorio por WhatsApp</a>`:""}
          </section>
          <section class="detail-card"><h3>Avance</h3><div class="big-progress">${d.dashboard.progress}%</div><div class="progress"><div style="width:${d.dashboard.progress}%"></div></div><p>${d.dashboard.completed} de ${d.dashboard.total} actividades obligatorias.</p></section>
        </div>
        <section class="detail-section"><div class="detail-head"><h3>Actividades</h3>${d.dashboard.progress===100?`<button class="btn primary small-btn" id="adminCertificateBtn">Generar / habilitar constancia</button>`:""}</div><ul class="detail-list">${acts}</ul></section>
        <section class="detail-section"><h3>Documentos</h3><ul class="detail-list">${docs}</ul></section>
        <section class="detail-section"><h3>Diagnóstico integral</h3>${diag}</section>
        <section class="detail-section"><h3>Seguimiento conductual</h3>${cond}</section>
        <section class="detail-section"><h3>Cierre del expediente</h3>
          <div class="closure-grid">
            ${closureEditor("academic","Académico",c.ACADEMICO_VALIDADO,c.ACADEMICO_SINTESIS)}
            ${closureEditor("conductual","Conductual",c.CONDUCTUAL_VALIDADO,c.CONDUCTUAL_SINTESIS)}
          </div>
        </section>`;
      if(!$("#adminStudentDialog").open) $("#adminStudentDialog").showModal();
      document.querySelectorAll("[data-save-closure]").forEach(b=>b.addEventListener("click",()=>saveClosure(id,b.dataset.saveClosure)));
      $("#adminCertificateBtn")?.addEventListener("click",()=>generateCertificate(id));
    }catch(ex){toast(ex.message)}
  }

  function closureEditor(area,title,validated,synthesis){
    return `<div class="closure-box"><h4>${title}</h4><label>Validación<select id="${area}Validated"><option value="NO" ${String(validated)!=="SI"?"selected":""}>No validado</option><option value="SI" ${String(validated)==="SI"?"selected":""}>Validado</option></select></label><label>Síntesis<textarea id="${area}Synthesis" rows="5">${esc(synthesis||"")}</textarea></label><button class="btn ghost" data-save-closure="${area}">Guardar ${title.toLowerCase()}</button></div>`;
  }

  function objectRows(rows){
    if(!rows.length) return '<p class="muted">Sin registros.</p>';
    return rows.slice().reverse().map(r=>{
      const pairs=Object.entries(r).filter(([k,v])=>v!=="" && v!=null).slice(0,8);
      return `<div class="record-card">${pairs.map(([k,v])=>`<div><b>${esc(k.replaceAll("_"," "))}</b><span>${esc(String(v).slice(0,600))}</span></div>`).join("")}</div>`;
    }).join("");
  }

  async function saveClosure(studentId,area){
    try{
      const prefix=area==="academic"?"academic":"conductual";
      const r=await bridge().call("adminUpdateClosure",{token:adminState.token,studentId,area,validated:$("#"+prefix+"Validated").value,synthesis:$("#"+prefix+"Synthesis").value});
      toast(r.message||"Cierre actualizado");
      await openStudent(studentId);
    }catch(ex){toast(ex.message)}
  }

  async function generateCertificate(studentId){
    try{
      const r=await bridge().call("adminGenerateCertificate",{token:adminState.token,studentId});
      toast("Constancia habilitada");
      if(r.url) window.open(r.url,"_blank","noopener");
      await loadAdminDashboard();
    }catch(ex){toast(ex.message)}
  }

  $("#closeAdminStudentDialog").addEventListener("click",()=>$("#adminStudentDialog").close());

  $("#syncStudentsBtn").addEventListener("click",async()=>{
    if(!confirm("Se sincronizarán los estudiantes desde la base maestra de Datos de Identificación. No se borrará el historial. ¿Continuar?")) return;
    const b=$("#syncStudentsBtn"); b.disabled=true; b.textContent="Sincronizando…";
    try{
      const r=await bridge().call("adminSyncStudents",{token:adminState.token});
      toast(`Sincronización: ${r.created} altas, ${r.updated} actualizados, ${r.deactivated} desactivados.`);
      await loadAdminDashboard();
    }catch(ex){toast(ex.message)}
    finally{b.disabled=false;b.textContent="Sincronizar estudiantes"}
  });

  $("#adminLogoutBtn").addEventListener("click",async()=>{
    try{if(adminState.token) await bridge().call("adminLogout",{token:adminState.token})}catch(_){}
    sessionStorage.removeItem("eoe_admin_session"); adminState.token=null; adminState.data=null;
    $("#adminView").classList.add("hidden"); $("#loginView").classList.remove("hidden"); setMode("admin");
  });

  $("#adminChangePasswordBtn").addEventListener("click",()=>$("#adminPasswordDialog").showModal());
  $("#closeAdminPasswordDialog").addEventListener("click",()=>$("#adminPasswordDialog").close());
  $("#cancelAdminPassword").addEventListener("click",()=>$("#adminPasswordDialog").close());
  $("#adminPasswordForm").addEventListener("submit",async e=>{
    e.preventDefault(); clearError($("#adminPasswordError"));
    const current=$("#currentAdminPassword").value, next=$("#newAdminPassword").value, confirm=$("#confirmAdminPassword").value;
    if(next!==confirm){showError($("#adminPasswordError"),"Las contraseñas nuevas no coinciden.");return}
    try{
      await bridge().call("adminChangePassword",{token:adminState.token,currentPassword:current,newPassword:next});
      $("#adminPasswordDialog").close(); e.currentTarget.reset(); toast("Contraseña actualizada");
    }catch(ex){showError($("#adminPasswordError"),ex.message)}
  });

  async function restoreAdmin(){
    const token=sessionStorage.getItem("eoe_admin_session");
    if(!token || !bridge()) return;
    adminState.token=token;
    try{ await loadAdminDashboard(); }
    catch(_){ sessionStorage.removeItem("eoe_admin_session"); adminState.token=null; }
  }

  window.addEventListener("eoe:bridge-ready",restoreAdmin);
  if(window.EOE_BRIDGE) restoreAdmin();
})();