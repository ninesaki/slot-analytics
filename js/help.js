// ── Start Here / Guide page ───────────────────────────────────────────────────
window.navTo=function(id){const b=qs('[data-s="'+id+'"]');if(b)b.click();};
(function(){
  const s=qs('#s-guide');

  // ── Hero ──────────────────────────────────────────────────────────────────
  const hero=mk('div','gh-hero');
  hero.innerHTML=`
    <div class="gh-hero-eyebrow">Start Here — 第一次打開請從這裡開始</div>
    <div class="gh-hero-title">SlotAnalytics 使用教學</div>
    <div class="gh-hero-desc">
      這份工具幫你<b>系統化進行 slot 競品分析</b>、追蹤研究進度、產出可直接餵給 Claude 的研究 Prompt。
      資料涵蓋 ${D.meta.total_games.toLocaleString()} 款遊戲，來源包含 CGN、SlotCatalog、BigWinBoard。
    </div>
    <div style="font-size:12px;font-weight:700;color:var(--txd);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px">推薦使用流程</div>
    <div class="gh-flow">
      <span class="gh-flow-step">找題目</span><span class="gh-flow-arrow">›</span>
      <span class="gh-flow-step">加入研究板</span><span class="gh-flow-arrow">›</span>
      <span class="gh-flow-step">收素材</span><span class="gh-flow-arrow">›</span>
      <span class="gh-flow-step">產 Prompt</span><span class="gh-flow-arrow">›</span>
      <span class="gh-flow-step">整理結果</span><span class="gh-flow-arrow">›</span>
      <span class="gh-flow-step">定期備份</span>
    </div>`;
  s.appendChild(hero);

  // ── Intro ─────────────────────────────────────────────────────────────────
  const intro=mk('div','gh-intro');
  intro.innerHTML=`<div class="gh-intro-title">這份工具能幫你做什麼</div>
    <div class="gh-intro-grid">
      ${['找出值得研究的新興廠商','判斷系列作、換皮款與機制變體','篩選特定機制或題材的競品',
         '追蹤研究進度、截圖、影片與筆記','產出可餵給 Claude 的結構化 Prompt','整理成分享會或 review 素材'].map(t=>
        `<div class="guide-feature">${t}</div>`).join('')}
    </div>`;
  s.appendChild(intro);

  // ── Section helper ────────────────────────────────────────────────────────
  const H=title=>{const d=mk('div','guide-section-title');d.textContent=title;s.appendChild(d);};

  // ── Scenarios — left-nav + right panel ───────────────────────────────────
  H('我現在想做什麼？');
  const SCENARIOS=[
    {n:'1',title:'找新的分享會題目',
     desc:'想找下次分享會的主角。從新興廠商雷達出發，批次加入候選遊戲，再用 Prompt 快速篩出值得深入的對象。',
     dest:'radar',destLabel:'新興廠商雷達',
     steps:['到新興廠商雷達，查看 Emerging Target / High Priority 清單',
            '優先看標有 Small but Active、Style Candidate、Needs Check 的廠商',
            '點「+ 近期」將該廠商近期高分遊戲批次加入研究工作台',
            '補上加入原因與研究目的（新興廠商、分享會候選）',
            '到研究工作台，用「快速掃描版」或「分享會版」Prompt 篩出前 3 款'],
     prompts:['快速掃描版','分享會版']},
    {n:'2',title:'分析一個系列是不是換皮',
     desc:'懷疑某個遊戲系列中有純換皮的款式。從系列偵測頁出發，確認哪些是真換皮、哪些有機制差異。',
     dest:'series',destLabel:'系列研究 / 換皮判斷',
     steps:['到系列研究 / 換皮判斷，搜尋想分析的系列名稱',
            '確認 series_type：true_series / naming_pattern / mechanic_family / theme_family',
            '找出哪些款屬於 Mechanic Variant、Branch Type 或 Needs Check',
            '用批次加入按鈕把值得研究的遊戲全部加入研究工作台',
            '到研究工作台，用「系列差異版」Prompt 拆解異同'],
     prompts:['系列差異版']},
    {n:'3',title:'找特定機制的競品',
     desc:'已知某個機制（如 Cluster Pays、Megaways），想找用了這個機制的所有競品遊戲。',
     dest:'mechanic',destLabel:'機制探索 + 遊戲瀏覽',
     steps:['到機制探索，確認該機制的使用量、趨勢與常見搭配',
            '到遊戲瀏覽，在搜尋欄輸入機制名稱篩選',
            '搭配年份、provider、ecosystem 進一步縮小範圍',
            '依分數排序，選出候選後加入研究工作台',
            '先用「快速掃描版」挑出 top 3，再用「單款深度拆解版」深入'],
     prompts:['快速掃描版','單款深度拆解版']},
    {n:'4',title:'深入研究一款遊戲',
     desc:'已確定要深入分析某款遊戲，需要系統化收集截圖、拆解機制，並產出完整的研究 Prompt。',
     dest:'games',destLabel:'遊戲瀏覽 + 研究工作台',
     steps:['在遊戲瀏覽找到該遊戲，點「+」加入研究工作台',
            '在研究工作台點「編輯」，補上加入原因、研究目的、影片 URL',
            '找 demo 或 YouTube 影片，收集截圖並勾選 checklist',
            '將狀態設為「已截圖」或「已拆機制」',
            '用「單款深度拆解版」Prompt 丟給 Claude，並人工補充觀察'],
     prompts:['單款深度拆解版']},
    {n:'5',title:'準備分享會素材',
     desc:'已有一批研究完成的遊戲，想整理成分享會簡報。確認素材齊備，選出 3~6 款，產出分享會 Prompt。',
     dest:'workbench',destLabel:'研究工作台',
     steps:['切換到「可分享」分頁，找狀態已達可分享的遊戲',
            '確認 Base Game、Info Page、Free Spins、Big Win、Special Mechanic 截圖齊備',
            '選出 3～6 款，到 Prompt 產出分頁切換到「分享會版」',
            '勾選遊戲後產出 Prompt，丟給 Claude 生成分享大綱',
            '人工補充圖片位置、觀察重點與討論問題'],
     prompts:['分享會版']},
  ];
  const PCLS={'快速掃描版':'rt-active','系列差異版':'rt-eco','單款深度拆解版':'rt-new','分享會版':'rt-style'};

  const scLayout=mk('div','gsc-layout');
  const scNav=mk('div','gsc-nav');
  const scPanel=mk('div','gsc-panel');

  function showScenario(idx){
    scNav.querySelectorAll('.gsc-nav-item').forEach((el,i)=>el.classList.toggle('gsc-active',i===idx));
    const sc=SCENARIOS[idx];
    scPanel.innerHTML=`
      <div class="gsc-badge">情境 ${sc.n} / ${SCENARIOS.length}</div>
      <div class="gsc-title">${sc.title}</div>
      <div class="gsc-desc">${sc.desc}</div>
      <div class="gsc-label">建議前往</div>
      <button class="gsc-dest-btn" onclick="navTo('${sc.dest}')">${sc.destLabel} →</button>
      <div class="gsc-label">操作步驟</div>
      <ol class="gsc-steps">${sc.steps.map(st=>`<li class="gsc-step">${st}</li>`).join('')}</ol>
      <div class="gsc-label">適合 Prompt 類型</div>
      <div class="gsc-prompts">${sc.prompts.map(p=>`<span class="radar-tag ${PCLS[p]||'rt-check'}" style="font-size:13px;padding:4px 10px">${p}</span>`).join('')}</div>`;
  }

  SCENARIOS.forEach((sc,i)=>{
    const btn=mk('button','gsc-nav-item');
    btn.innerHTML=`<span class="gsc-nav-num">${sc.n}</span><span>${sc.title}</span>`;
    btn.addEventListener('click',()=>showScenario(i));
    scNav.appendChild(btn);
  });
  scLayout.appendChild(scNav);scLayout.appendChild(scPanel);
  s.appendChild(scLayout);
  showScenario(0);

  // ── Page comparison cards ─────────────────────────────────────────────────
  H('頁面功能對照表');
  const PAGE_ROWS=[
    ['總覽','快速掌握整體資料量、全局趨勢、更新時間','剛打開 Dashboard 或確認資料更新後','前往雷達、系列研究或遊戲瀏覽','overview'],
    ['新興廠商雷達','找 2024–2026 新興、小型、風格特殊廠商','想找分享會題目、新廠商、新風格','加入研究工作台','radar'],
    ['系列研究 / 換皮判斷','判斷系列中的純換皮、加強款、機制變體、分支玩法','想分析 Le Slots、Big Bass、Book 類系列','批次加入研究工作台','series'],
    ['遊戲瀏覽','搜尋特定遊戲、provider、mechanic、theme','已有明確查詢目標','加入研究工作台或匯出 CSV','games'],
    ['機制探索','看機制使用量、常見搭配與年份趨勢','想研究某個玩法或機制','到遊戲瀏覽搜尋該機制','mechanic'],
    ['生態系分析','查看 provider_group、RGS、publisher 相關資訊','想理解小廠背後的發行或技術生態','人工確認 Unknown / Needs Check 資料','ecosystem'],
    ['資料實驗室','檢查資料完整度、來源分布、生態系缺漏','維護資料或補 mapping 設定','人工補資料或更新 PROVIDER_ALIASES','datalab'],
    ['研究工作台','管理研究任務、追蹤截圖、寫筆記、產出 Prompt','準備試玩、截圖、分析、分享會','用 Prompt Builder 產出 Claude Prompt','workbench'],
  ];
  const ptGrid=mk('div','gpt-grid');
  PAGE_ROWS.forEach(([page,usage,when_,next,navId])=>{
    const card=mk('div','gpt-card');
    card.innerHTML=`<span class="guide-dest" onclick="navTo('${navId}')">${page}</span>
      <div class="gpt-usage">${usage}</div>
      <div class="gpt-when">${when_}</div>
      <div class="gpt-next">下一步：${next}</div>`;
    ptGrid.appendChild(card);
  });
  s.appendChild(ptGrid);

  // ── Workbench field guide ─────────────────────────────────────────────────
  H('研究工作台 — 欄位說明');
  const wbCard=mk('div','card');wbCard.style.cssText='margin-bottom:20px;padding:24px 28px';
  wbCard.innerHTML=`
    <div class="wb-grid">
      <div>
        <div class="wb-label">加入原因 added_reason</div>
        <div style="font-size:13px;color:var(--txm);line-height:1.7;margin-bottom:10px">用一句話記錄為什麼要研究這款。建議具體說明來源或目的，方便之後回顧。</div>
        <div style="font-size:12px;color:var(--txd);padding:10px 14px;background:var(--sfh);border:1px solid var(--bd);line-height:1.9">
          例：「Le Slots Series 疑似機制變體」<br>
          例：「新興廠商雷達 High Priority」<br>
          例：「題材美術特殊，適合分享會觀察」
        </div>
        <div class="wb-label" style="margin-top:18px">研究目的 research_goal（複選）</div>
        <div style="display:flex;flex-wrap:wrap;gap:5px">
          ${['玩法機制','系列差異','美術','FX','UI','題材','新興廠商','RGS/Publisher 生態','分享會候選']
            .map(g=>`<span class="radar-tag rt-active" style="cursor:default;font-size:12px;padding:3px 9px">${g}</span>`).join('')}
        </div>
      </div>
      <div>
        <div class="wb-label">研究狀態 research_status</div>
        ${[['候選','剛加入，還沒開始研究','var(--txd)'],
           ['待試玩','已決定要找 demo / video','var(--am)'],
           ['已截圖','素材已收集完成','var(--bl)'],
           ['已拆機制','規則與流程已看完','var(--vi)'],
           ['已美術分析','角色、背景、符號、UI 已看完','var(--vi)'],
           ['已 FX 分析','轉場、爆發、節奏、特效已看完','var(--vi)'],
           ['可分享','可整理成分享會內容','var(--gn)'],
           ['已歸檔','研究完成或決定不繼續','var(--txd)']
          ].map(([st,desc,col])=>
            `<div class="wb-status-row">
              <span class="wb-status-name" style="color:${col}">${st}</span>
              <span class="wb-status-desc">${desc}</span>
            </div>`).join('')}
      </div>
    </div>
    <div style="margin-top:22px;border-top:1px solid var(--bd);padding-top:18px">
      <div class="wb-label">截圖 Checklist — 建議收集項目</div>
      <div style="display:flex;flex-wrap:wrap;gap:7px;margin-bottom:12px">
        ${['Base Game','Info Page','Feature Trigger','Free Spins','Big Win','Bonus Buy','Special Mechanic']
          .map(k=>`<span class="ss-badge ss-miss" style="font-size:12px;padding:4px 10px">${k}</span>`).join('')}
      </div>
      <div class="guide-callout" style="margin:0;font-size:13px">
        <b>美術 / FX 分享最低限度：</b>
        ${['Base Game','Info Page','Free Spins','Big Win','Special Mechanic']
          .map(k=>`<span class="ss-badge ss-done" style="margin:0 3px;font-size:12px;padding:3px 8px">${k}</span>`).join('')}
      </div>
    </div>`;
  s.appendChild(wbCard);

  // ── Prompt guide — cards ──────────────────────────────────────────────────
  H('Prompt 類型選擇指南');
  const PROMPT_ROWS=[
    ['快速掃描版','rt-active','有一批候選，不確定哪幾款值得深入研究','3 ～ 20','共同點、異常點、推薦前 3 款、建議確認事項'],
    ['系列差異版','rt-eco','分析同系列或命名套路，判斷換皮程度','3 款以上','共同骨架、每款差異、換皮 / 加強 / 變體 / 分支分類'],
    ['單款深度拆解版','rt-new','已決定研究單一遊戲（只能選 1 款）','僅限 1','一句話玩法、主副 TAG、盤面 / Bonus 流程、美術 / FX / UI 觀察點'],
    ['分享會版','rt-style','要整理成團隊分享或討論素材','3 ～ 6','研究背景、選題理由、觀察重點、討論問題、建議展示順序'],
  ];
  const gpGrid=mk('div','gp-grid');
  PROMPT_ROWS.forEach(([name,cls,when_,count,output])=>{
    const card=mk('div','gp-card');
    card.innerHTML=`<span class="radar-tag ${cls}" style="font-size:13px;padding:5px 11px">${name}</span>
      <div class="gp-when">${when_}</div>
      <div class="gp-count">${count} <span class="gp-count-label">款</span></div>
      <div class="gp-output">產出：${output}</div>`;
    gpGrid.appendChild(card);
  });
  s.appendChild(gpGrid);

  // ── Weekly flow — horizontal steps ───────────────────────────────────────
  H('推薦固定工作流');
  const FLOW=[
    {title:'找題目',sub:'前往新興廠商雷達或系列研究 / 換皮判斷，找有潛力的研究對象',nav:'radar'},
    {title:'加入研究板',sub:'把候選遊戲加入研究工作台，補加入原因與研究目的',nav:'workbench'},
    {title:'收素材',sub:'找 demo、影片、規則頁，補 source / video URL，勾截圖 checklist',nav:null},
    {title:'產 Prompt',sub:'選對應的 Prompt 類型，勾選遊戲後產出，丟給 Claude',nav:'workbench'},
    {title:'整理結果',sub:'將 Claude 輸出整理回 Notion、簡報或報告，補充觀察',nav:null},
    {title:'定期備份',sub:'從研究工作台 FAB 匯出 JSON / CSV 到本機（localStorage 清除後消失）',nav:null},
  ];
  const wfLayout=mk('div','wf-layout');
  FLOW.forEach(({title,sub,nav},i)=>{
    const step=mk('div','wf-step');
    step.innerHTML=`<div class="wf-step-num">Step ${i+1}</div>
      <div class="wf-step-title">${title}</div>
      <div class="wf-step-desc">${sub}</div>
      ${nav?`<span class="wf-step-link" onclick="navTo('${nav}')">前往 ${title} →</span>`:''}`;
    wfLayout.appendChild(step);
  });
  s.appendChild(wfLayout);

  // ── Warnings ──────────────────────────────────────────────────────────────
  H('注意事項 / 資料限制');
  const WARNS=[
    'Dashboard 的自動分類（換皮、系列、生態系）是研究輔助工具，<b>不是最終結論</b>，請搭配人工確認。',
    'Ecosystem / RGS / Publisher 若顯示 <b>Unknown</b> 或 <b>Needs Check</b>，需要人工查找才能信任。',
    'Series / Reskin Detector 根據名稱相似度、mechanics、themes 與手動規則推測，<b>仍建議實際試玩或看規則頁確認</b>。',
    '換皮 / 加強款 / 機制變體的分類界線模糊，建議搭配影片或規則頁確認，且分類可能隨資料更新而調整。',
    '<b>研究工作台資料存在 localStorage</b>，換瀏覽器或清除瀏覽資料後會消失 — 重要資料請定期從 FAB 匯出 JSON / CSV 備份。',
    '若要讓其他人使用這份 Dashboard，請提醒他們<b>先閱讀使用教學頁面</b>，並告知自動分類有其限制。',
  ];
  const warnCard=mk('div','guide-callout guide-warn');warnCard.style.marginBottom='32px';
  warnCard.innerHTML=`<div style="font-size:15px;font-weight:700;color:var(--rd);margin-bottom:14px">使用前請了解以下限制</div>
    ${WARNS.map(w=>`<div class="gw-item"><span class="gw-icon">&#9651;</span><span class="gw-text">${w}</span></div>`).join('')}`;
  s.appendChild(warnCard);
})();
