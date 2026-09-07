// ── Changelog page ────────────────────────────────────────────────────────────
(function(){
  const s=qs('#s-changelog');
  if(!s)return;
  const header=mk('div','cl-header');
  header.innerHTML=`<div class="cl-title">更新日誌</div><div class="cl-subtitle">記錄每次版本更新的功能、修復與資料異動${CL.length?' · 最新版本 '+CL[0].version+' · '+CL[0].date:''}</div>`;
  s.appendChild(header);
  const TYPES=['全部','功能','修復','資料','改善'];
  let activeType='全部';
  const filterBar=mk('div','cl-filters');
  const tBtns={};
  TYPES.forEach(t=>{
    const b=mk('button','cl-filter-btn');b.textContent=t;
    if(t==='全部')b.classList.add('on');
    b.onclick=()=>{activeType=t;Object.entries(tBtns).forEach(([k,btn])=>btn.classList.toggle('on',k===t));render();};
    tBtns[t]=b;filterBar.appendChild(b);
  });
  s.appendChild(filterBar);
  const listEl=mk('div','');s.appendChild(listEl);
  function render(){
    listEl.innerHTML='';
    CL.forEach(ver=>{
      const filtered=activeType==='全部'?ver.entries:ver.entries.filter(e=>e.type===activeType);
      if(!filtered.length)return;
      const grp=mk('div','cl-version-group');
      const hdr=mk('div','cl-version-header');
      hdr.innerHTML=`<span class="cl-version-date">${ver.date}</span><span class="cl-version-tag">${ver.version}</span>`;
      grp.appendChild(hdr);
      filtered.forEach(e=>{
        const row=mk('div','cl-entry');
        const badge=mk('span','cl-badge cl-badge-'+e.type);badge.textContent=e.type;
        const body=mk('div','cl-entry-body');
        body.innerHTML=`<div class="cl-entry-title">${e.title}</div>${e.desc?'<div class="cl-entry-desc">'+e.desc+'</div>':''}`;
        row.append(badge,body);grp.appendChild(row);
      });
      listEl.appendChild(grp);
    });
    if(!listEl.children.length)listEl.innerHTML='<div style="padding:40px;text-align:center;color:var(--txd)">此類型尚無紀錄</div>';
  }
  render();
})();
