const analysisUi={
cnr:{copy:'⧉ Kopiraj pitanje',copied:'✓ Kopirano',open:'☷ Sva pitanja i odgovori',title:'Sva pitanja i odgovori',search:'Pretraga po broju ili tekstu',copyAll:'⧉ Kopiraj spisak',count:n=>`${n} pitanja`,correct:'Tačan odgovor',close:'Zatvori'},
ru:{copy:'⧉ Скопировать вопрос',copied:'✓ Скопировано',open:'☷ Все вопросы и ответы',title:'Все вопросы и ответы',search:'Поиск по номеру или тексту',copyAll:'⧉ Скопировать список',count:n=>`${n} ${n%10===1&&n%100!==11?'вопрос':n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?'вопроса':'вопросов'}`,correct:'Правильный ответ',close:'Закрыть'},
en:{copy:'⧉ Copy question',copied:'✓ Copied',open:'☷ All questions and answers',title:'All questions and answers',search:'Search by number or text',copyAll:'⧉ Copy list',count:n=>`${n} questions`,correct:'Correct answer',close:'Close'},
de:{copy:'⧉ Frage kopieren',copied:'✓ Kopiert',open:'☷ Alle Fragen und Antworten',title:'Alle Fragen und Antworten',search:'Nach Nummer oder Text suchen',copyAll:'⧉ Liste kopieren',count:n=>`${n} Fragen`,correct:'Richtige Antwort',close:'Schließen'}
};
const localizedQuestion=q=>({cnr:[q.question,q.options],ru:[q.questionRu,q.optionsRu],en:[q.questionEn,q.optionsEn],de:[q.questionDe,q.optionsDe]}[language]);
const questionText=q=>{const [title,answers]=localizedQuestion(q);return `#${q.id}\n${title}\n${answers.map((answer,index)=>`${letters[index]}. ${answer}${index===q.correct?' ✓':''}`).join('\n')}\n${analysisUi[language].correct}: ${letters[q.correct]}`};
async function copyText(text,button){try{await navigator.clipboard.writeText(text)}catch{const area=document.createElement('textarea');area.value=text;document.body.append(area);area.select();document.execCommand('copy');area.remove()}const label=button.textContent;button.textContent=analysisUi[language].copied;setTimeout(()=>button.textContent=label,1400)}
function translateAnalysis(){const x=analysisUi[language];$('copy-current').textContent=x.copy;$('open-analysis').textContent=x.open;$('analysis-title').textContent=x.title;$('analysis-search').placeholder=x.search;$('copy-all').textContent=x.copyAll;$('close-analysis').ariaLabel=x.close;if($('analysis-dialog').open)renderAnalysis()}
function renderAnalysis(){const query=$('analysis-search').value.trim().toLocaleLowerCase();const visible=questions.filter(q=>{const [title,answers]=localizedQuestion(q);return !query||String(q.id).includes(query)||[title,...answers].join(' ').toLocaleLowerCase().includes(query)});$('analysis-count').textContent=analysisUi[language].count(visible.length);$('analysis-list').replaceChildren(...visible.map(q=>{const [title,answers]=localizedQuestion(q);const article=document.createElement('article');article.className='analysis-item';const heading=document.createElement('h3');heading.textContent=`#${q.id} · ${title}`;const list=document.createElement('ol');list.type='A';answers.forEach((answer,index)=>{const li=document.createElement('li');li.textContent=answer;if(index===q.correct){li.className='analysis-correct';li.insertAdjacentText('beforeend',' ✓')}list.append(li)});article.append(heading,list);return article}))}
$('copy-current').onclick=()=>{const q=current();if(q)copyText(questionText(q),$('copy-current'))};
$('open-analysis').onclick=()=>{renderAnalysis();$('analysis-dialog').showModal();$('analysis-search').focus()};
$('close-analysis').onclick=()=>$('analysis-dialog').close();
$('analysis-dialog').onclick=e=>{if(e.target===$('analysis-dialog'))$('analysis-dialog').close()};
$('analysis-search').oninput=renderAnalysis;
$('copy-all').onclick=()=>copyText(questions.map(questionText).join('\n\n'),$('copy-all'));
document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',translateAnalysis));
translateAnalysis();
