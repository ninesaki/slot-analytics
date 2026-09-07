// ── Reel Profile ─────────────────────────────────────────────────────────────
(function(){
  const s=qs('#s-reel');
  const r=D.reel;
  s.innerHTML=`
    <div class="sh"><div class="st">輪軸分析</div><div class="ss">輪軸配置隨時間的演變趨勢</div></div>
    <div class="g2" style="margin-bottom:16px">
      <div class="card">
        <div class="ct">整體輪軸分布</div>
        <div id="reel-overall"></div>
      </div>
      <div class="card">
        <div class="ct">輪軸數年份趨勢</div>
        <div id="reel-trend"></div>
      </div>
    </div>`;

  // Top 3 快速洞察
  const reelTot=r.overall.reduce((s,[,v])=>s+v,0)||1;
  s.insertBefore(top3Row([
    top3Card('最常見輪軸配置 Top 3', r.overall.slice(0,3).map(([k,v])=>({label:k+' 軸',value:v.toLocaleString()+'款',sub:(v/reelTot*100).toFixed(1)+'%'}))),
    top3Card('次要輪軸配置', r.overall.slice(3,6).map(([k,v])=>({label:k+' 軸',value:v.toLocaleString()+'款',sub:(v/reelTot*100).toFixed(1)+'%'}))),
    top3Card('最新年度主流輪軸', (()=>{const yrs=Object.keys(r.by_year).sort();const lastYr=r.by_year[yrs[yrs.length-1]]||{};return Object.entries(lastYr).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k,v])=>({label:k+' 軸',value:v+'款',sub:yrs[yrs.length-1]+'年'}));})()),
  ]), s.firstChild);

  // Overall distribution
  const tot=r.overall.reduce((s,[,v])=>s+v,0)||1;
  const maxV=Math.max(...r.overall.map(([,v])=>v),1);
  const REEL_COLORS={'3':'var(--vi)','4':'var(--bl)','5':'var(--am)','6':'var(--gn)','7':'#e05252','8':'#ff9040'};
  const overallDiv=qs('#reel-overall');
  r.overall.forEach(([reels,count])=>{
    const row=mk('div','reel-row');
    const col=REEL_COLORS[reels]||'var(--txm)';
    row.innerHTML=`<div class="reel-label" style="color:${col}">${reels} 軸</div><div class="reel-bar"><div class="reel-fill" style="width:${count/maxV*100}%;background:${col}"></div></div><div class="reel-val">${count.toLocaleString()} <span style="color:var(--txd)">(${(count/tot*100).toFixed(0)}%)</span></div>`;
    overallDiv.appendChild(row);
  });

  // Stacked area chart by year
  const reelYears=Object.keys(r.by_year).sort();
  const reelTypes=r.overall.map(([k])=>k);
  if(reelYears.length>1&&reelTypes.length>0){
    const ds=reelTypes.map(rt=>({
      label:rt+' 軸',
      color:REEL_COLORS[rt]||'var(--txm)',
      values:Object.fromEntries(reelYears.map(y=>[y,r.by_year[y]?.[rt]||0]))
    }));
    const trendDiv=qs('#reel-trend');
    trendDiv.appendChild(lineChart(ds,reelYears,{h:200}));
    const leg=mk('div','lc-legend');
    ds.forEach(d=>{leg.innerHTML+=`<span style="color:${d.color}">■ ${d.label}</span>`;});
    trendDiv.appendChild(leg);
  }
})();
