// ── Layout Analysis (盤面尺寸分析, Phase 6B) ────────────────────────────────────
// Replaces the old Reel Count-only "輪軸分析" (this file, assets/js/reel-analysis.js,
// loaded via the __JS_REEL__ placeholder — see Phase 3A's JS_MODULES list in
// dashboard.py). D.reel (built at generation time from games.reels/sc.reels)
// is left untouched and reused below as a small secondary block; everything
// else here is a fresh build computed client-side from D.games' existing
// reels/rows/mechanics_leaf fields, per this phase's audit findings.
(function(){
  const s=qs('#s-reel');
  if(!s)return;

  // Canonical mechanics_leaf tags (Phase 2B leaf layer, already normalized)
  // whose games have a per-spin variable reel/row configuration — audited
  // against real data: Megaways/xWays/InfiniReels/Megaclusters games do
  // carry numeric reels+rows values in the DB, but those describe a maximum
  // (e.g. "6 reels, up to 7 rows"), not the actual fixed grid, so reporting
  // them as a literal "6×7" Fixed Grid would misrepresent the game (see
  // report's audit section). Reelset Changing games switch to an entirely
  // different reel configuration at trigger points (per its own changelog
  // definition), so the same applies. This is membership in an existing,
  // already-reviewed canonical tag set — not a new taxonomy and not a guess
  // from paylines/name/mechanic-implied rows (all explicitly banned).
  const VARIABLE_TAGS=new Set(['Megaways','xWays','InfiniReels','Megaclusters','Reelset Changing']);

  // Single classification pass over D.games, shared by every sub-section
  // below (Top Layouts / yearly trend / Provider×Layout / drilldown) so
  // nothing here re-scans the full game list more than once.
  const total=D.games.length;
  const fixedGames=[],variableGames=[],unknownGames=[];
  const layoutCounts={};          // "5×3" -> count (Fixed only)
  const layoutScoreSum={};        // "5×3" -> {sum,count}
  const layoutProviderCounts={};  // "5×3" -> {provider: count}
  const layoutByYear={};          // "5×3" -> {year: count}
  const yearFixedTotal={};        // year -> count of Fixed-classified games that year (trend denominator)
  D.games.forEach(g=>{
    const leaf=g.mechanics_leaf||[];
    if(leaf.some(m=>VARIABLE_TAGS.has(m))){variableGames.push(g);return;}
    if(g.reels&&g.rows){
      const label=`${g.reels}×${g.rows}`;
      g._layout=label;
      fixedGames.push(g);
      layoutCounts[label]=(layoutCounts[label]||0)+1;
      if(g.score!=null){
        const e=layoutScoreSum[label]||{sum:0,count:0};
        e.sum+=Number(g.score);e.count++;layoutScoreSum[label]=e;
      }
      const prov=g.provider_normalized||g.provider_raw||'Unknown';
      const pc=layoutProviderCounts[label]||{};pc[prov]=(pc[prov]||0)+1;layoutProviderCounts[label]=pc;
      const yr=g.year;
      if(yr){
        const yc=layoutByYear[label]||{};yc[yr]=(yc[yr]||0)+1;layoutByYear[label]=yc;
        yearFixedTotal[yr]=(yearFixedTotal[yr]||0)+1;
      }
    }else{
      unknownGames.push(g);
    }
  });
  const fixedTotal=fixedGames.length,variableTotal=variableGames.length,unknownTotal=unknownGames.length;

  // Deterministic order: count desc, name asc tie-break. Built from a sorted
  // array, never from object key insertion order (see determinism note
  // repeated across every phase in this codebase).
  const topLayouts=Object.keys(layoutCounts)
    .map(label=>({label,count:layoutCounts[label]}))
    .sort((a,b)=>b.count-a.count||a.label.localeCompare(b.label));

  function avgScoreFor(label){
    const e=layoutScoreSum[label];
    return e&&e.count?e.sum/e.count:null;
  }
  function topProviderFor(label){
    const pc=layoutProviderCounts[label]||{};
    const names=Object.keys(pc).sort((a,b)=>pc[b]-pc[a]||a.localeCompare(b));
    return names.length?{name:names[0],count:pc[names[0]]}:null;
  }
  function layoutGames(label){
    return fixedGames.filter(g=>g._layout===label)
      .sort((a,b)=>{
        const sa=a.score!=null?Number(a.score):-Infinity,sb=b.score!=null?Number(b.score):-Infinity;
        if(sb!==sa)return sb-sa;
        if(a.name!==b.name)return a.name<b.name?-1:1;
        return a.id-b.id;
      });
  }

  // ── Header ──────────────────────────────────────────────────────────────
  const header=mk('div','sh');
  header.innerHTML=`<div class="st">盤面尺寸分析</div><div class="ss">依「Reels × Rows」統計盤面尺寸（Layout Analysis）；Megaways / xWays / Reelset Changing 等變動盤面機制另計為 Variable Grid，不會被強制套用一個固定尺寸。</div>`;
  s.appendChild(header);

  const summary=mk('div','card');
  summary.style.cssText='margin-bottom:16px;padding:14px 18px;font-size:13px;line-height:1.9';
  summary.innerHTML=`共 ${total.toLocaleString()} 款遊戲中：
    <b style="color:var(--gn)">Fixed Grid</b> ${fixedTotal.toLocaleString()}（${(fixedTotal/total*100).toFixed(1)}%）、
    <b style="color:var(--am)">Variable Grid</b> ${variableTotal.toLocaleString()}（${(variableTotal/total*100).toFixed(1)}%）、
    <b style="color:var(--txd)">資料不足</b> ${unknownTotal.toLocaleString()}（${(unknownTotal/total*100).toFixed(1)}%，缺 reels 或 rows 資料）。
    <br><span style="font-size:11px;color:var(--txd)">Rows 資料目前僅來自 SlotCatalog（BigWinBoard 尚未提供此欄位），涵蓋率因此低於 Reels 本身；下方所有「占比」皆以 Fixed Grid 的 ${fixedTotal.toLocaleString()} 款為分母，不使用全部遊戲數。</span>`;
  s.appendChild(summary);

  // ── Top Layouts ───────────────────────────────────────────────────────────
  const topCard=mk('div','card');
  topCard.style.cssText='margin-bottom:16px;padding:16px 18px';
  topCard.innerHTML=`<div style="font-size:14px;font-weight:700;margin-bottom:4px">常見盤面尺寸</div>
    <div style="font-size:11px;color:var(--txd);margin-bottom:10px">點擊列可展開該尺寸的遊戲清單</div>`;
  const topTableWrap=mk('div','');topTableWrap.style.cssText='max-height:420px;overflow-y:auto';
  let topTableHtml='<table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr style="border-bottom:1px solid var(--bd)">'
    +'<th style="text-align:left;padding:4px 6px">Layout</th><th style="text-align:right;padding:4px 6px">遊戲數</th>'
    +'<th style="text-align:right;padding:4px 6px">占 Fixed Grid %</th><th style="text-align:right;padding:4px 6px">平均 Score</th>'
    +'<th style="text-align:left;padding:4px 6px">主要 Provider</th></tr></thead><tbody>';
  topLayouts.forEach(row=>{
    const pct=(row.count/fixedTotal*100).toFixed(1);
    const avg=avgScoreFor(row.label);
    const tp=topProviderFor(row.label);
    topTableHtml+=`<tr data-layout="${row.label}" style="border-bottom:1px solid var(--bd);cursor:pointer" title="點擊查看此尺寸的遊戲">`
      +`<td style="padding:4px 6px;text-decoration:underline dotted;text-underline-offset:2px">${row.label}</td>`
      +`<td style="text-align:right;padding:4px 6px">${row.count.toLocaleString()}</td>`
      +`<td style="text-align:right;padding:4px 6px">${pct}%</td>`
      +`<td style="text-align:right;padding:4px 6px">${avg!=null?avg.toFixed(1):'—'}</td>`
      +`<td style="padding:4px 6px">${tp?`${tp.name}（${tp.count}）`:'—'}</td></tr>`;
  });
  topTableHtml+='</tbody></table>';
  topTableWrap.innerHTML=topTableHtml;
  topCard.appendChild(topTableWrap);
  const drillPanel=mk('div','');drillPanel.id='layout-drill-panel';
  drillPanel.style.cssText='display:none;margin-top:14px;padding-top:14px;border-top:1px solid var(--bd)';
  topCard.appendChild(drillPanel);
  s.appendChild(topCard);

  let activeDrillLayout=null;
  function highlightDrillRow(label){
    topTableWrap.querySelectorAll('tr[data-layout]').forEach(tr=>{
      tr.style.background=(label&&tr.dataset.layout===label)?'var(--sfh)':'';
    });
  }
  function fillDrillPanel(label){
    const gs=layoutGames(label);
    drillPanel.innerHTML='';
    const hdr=mk('div','');hdr.style.cssText='display:flex;justify-content:space-between;align-items:center;margin-bottom:8px';
    hdr.innerHTML=`<div style="font-size:13px;font-weight:700">${label} · 共 ${gs.length.toLocaleString()} 款</div>`;
    drillPanel.appendChild(hdr);
    if(gs.length>200){
      const note=mk('div','');note.style.cssText='font-size:11px;color:var(--txd);margin-bottom:8px';
      note.textContent=`依 Score 排序僅顯示前 200 款（共 ${gs.length.toLocaleString()} 款）`;
      drillPanel.appendChild(note);
    }
    const list=mk('div','');list.style.cssText='max-height:260px;overflow-y:auto';
    gs.slice(0,200).forEach(g=>{
      const row=mk('div','');
      row.style.cssText='display:flex;justify-content:space-between;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--bd);font-size:12px';
      const left=mk('span','',`${g.name} <span style="color:var(--txd)">· ${g.provider_normalized||g.provider_raw||'Unknown'} · ${g.year||'—'}</span>`);
      const right=mk('span','');right.style.cssText='display:flex;align-items:center;gap:8px;white-space:nowrap';
      const scoreSpan=mk('span','');scoreSpan.style.color='var(--txd)';scoreSpan.textContent=g.score!=null?Number(g.score).toFixed(1):'—';
      right.appendChild(scoreSpan);
      // Phase 6A's shared Game Detail — reused as-is, no second Detail view.
      const detBtn=mk('button','gc-btn');detBtn.style.cssText='font-size:10px;padding:2px 6px';
      detBtn.textContent='詳情';
      detBtn.onclick=()=>window.openGameDetail(g.id);
      right.appendChild(detBtn);
      row.append(left,right);
      list.appendChild(row);
    });
    drillPanel.appendChild(list);
  }
  topTableWrap.querySelector('table tbody').addEventListener('click',e=>{
    const tr=e.target.closest('tr[data-layout]');
    if(!tr)return;
    const label=tr.dataset.layout;
    if(activeDrillLayout===label){
      drillPanel.style.display='none';drillPanel.innerHTML='';
      activeDrillLayout=null;highlightDrillRow(null);
      return;
    }
    activeDrillLayout=label;
    fillDrillPanel(label);
    drillPanel.style.display='block';
    highlightDrillRow(label);
  });

  // ── Yearly trend for top layouts ────────────────────────────────────────
  // Explicit chronological array (never Set/object-key iteration) ending at
  // the latest year that actually has Fixed-classified data.
  const yearsWithData=Object.keys(yearFixedTotal).map(Number).filter(y=>yearFixedTotal[y]>0);
  if(yearsWithData.length){
    const maxYear=Math.max(...yearsWithData);
    const trendYears=[];
    for(let y=maxYear-4;y<=maxYear;y++)trendYears.push(y);
    const trendLayouts=topLayouts.slice(0,5);

    const trendCard=mk('div','card');
    trendCard.style.cssText='margin-bottom:16px;padding:16px 18px';
    trendCard.innerHTML=`<div style="font-size:14px;font-weight:700;margin-bottom:4px">年度趨勢（Top 5 Layout）</div>
      <div style="font-size:11px;color:var(--txd);margin-bottom:10px">數值為「該年此 layout 遊戲數 ／ 該年 Fixed Grid 有效遊戲數」的滲透率，不是 raw count。</div>`;
    let trendHtml='<table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr style="border-bottom:1px solid var(--bd)"><th style="text-align:left;padding:4px 6px">Layout</th>';
    trendYears.forEach(y=>{trendHtml+=`<th style="text-align:right;padding:4px 6px">${y}</th>`;});
    trendHtml+='</tr></thead><tbody>';
    trendLayouts.forEach(row=>{
      trendHtml+=`<tr style="border-bottom:1px solid var(--bd)"><td style="padding:4px 6px">${row.label}</td>`;
      trendYears.forEach(y=>{
        const denom=yearFixedTotal[y]||0;
        const cnt=(layoutByYear[row.label]||{})[y]||0;
        const pct=denom?(cnt/denom*100).toFixed(1)+'%':'N/A';
        trendHtml+=`<td style="text-align:right;padding:4px 6px">${pct}</td>`;
      });
      trendHtml+='</tr>';
    });
    trendHtml+='</tbody></table>';
    trendCard.innerHTML+=trendHtml;
    s.appendChild(trendCard);
  }

  // ── Provider × Layout ────────────────────────────────────────────────────
  const provCard=mk('div','card');
  provCard.style.cssText='margin-bottom:16px;padding:16px 18px';
  provCard.innerHTML=`<div style="font-size:14px;font-weight:700;margin-bottom:10px">Provider × Layout</div>`;
  const provSel=document.createElement('select');
  provSel.style.cssText='background:var(--sfh);color:var(--tx);border:1px solid var(--bd);padding:6px 10px;font-family:inherit;font-size:13px;margin-bottom:10px';
  topLayouts.slice(0,15).forEach(row=>{
    const opt=document.createElement('option');opt.value=opt.textContent=row.label;
    provSel.appendChild(opt);
  });
  provCard.appendChild(provSel);
  const provTableWrap=mk('div','');provCard.appendChild(provTableWrap);
  function renderProvTable(label){
    const pc=layoutProviderCounts[label]||{};
    const denom=layoutCounts[label]||0;
    const names=Object.keys(pc).sort((a,b)=>pc[b]-pc[a]||a.localeCompare(b)).slice(0,8);
    let html='<table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr style="border-bottom:1px solid var(--bd)"><th style="text-align:left;padding:4px 6px">Provider</th><th style="text-align:right;padding:4px 6px">遊戲數</th><th style="text-align:right;padding:4px 6px">占此 Layout %</th></tr></thead><tbody>';
    names.forEach(name=>{
      html+=`<tr style="border-bottom:1px solid var(--bd)"><td style="padding:4px 6px">${name}</td><td style="text-align:right;padding:4px 6px">${pc[name]}</td><td style="text-align:right;padding:4px 6px">${(pc[name]/denom*100).toFixed(1)}%</td></tr>`;
    });
    html+='</tbody></table>';
    provTableWrap.innerHTML=html;
  }
  if(topLayouts.length){
    provSel.value=topLayouts[0].label;
    renderProvTable(topLayouts[0].label);
  }
  provSel.addEventListener('change',()=>renderProvTable(provSel.value));
  s.appendChild(provCard);

  // ── Reel Count (secondary; kept for reference, no longer the primary
  // view — see report section 九). Reuses the pre-existing .reel-row/-bar/
  // -fill/-val CSS from the old Reel Profile card so this still looks native
  // rather than dropping in a plain table for the demoted view. ───────────
  const RD=D.reel;
  if(RD&&RD.overall&&RD.overall.length){
    const reelCard=mk('div','card');
    reelCard.style.cssText='padding:16px 18px;opacity:.85';
    reelCard.innerHTML=`<div style="font-size:13px;font-weight:700;margin-bottom:8px;color:var(--txd)">其他統計 — Reel Count（轉軸數，不含盤面高度）</div><div id="reel-overall-secondary"></div>`;
    s.appendChild(reelCard);
    const reelTot=RD.overall.reduce((sum,[,v])=>sum+v,0)||1;
    const maxV=Math.max(...RD.overall.map(([,v])=>v),1);
    const REEL_COLORS={'3':'var(--vi)','4':'var(--bl)','5':'var(--am)','6':'var(--gn)','7':'#e05252','8':'#ff9040'};
    const overallDiv=qs('#reel-overall-secondary',reelCard);
    [...RD.overall].sort((a,b)=>b[1]-a[1]).forEach(([reels,count])=>{
      const row=mk('div','reel-row');
      const col=REEL_COLORS[reels]||'var(--txm)';
      row.innerHTML=`<div class="reel-label" style="color:${col}">${reels} 軸</div><div class="reel-bar"><div class="reel-fill" style="width:${count/maxV*100}%;background:${col}"></div></div><div class="reel-val">${count.toLocaleString()} <span style="color:var(--txd)">(${(count/reelTot*100).toFixed(0)}%)</span></div>`;
      overallDiv.appendChild(row);
    });
  }
})();
