const analysisUi={
cnr:{copy:'⧉ Kopiraj pitanje',copied:'✓ Kopirano',open:'☷ Sva pitanja i odgovori',title:'Sva pitanja i odgovori',search:'Pretraga pitanja i odgovora na svim jezicima',copyAll:'⧉ Kopiraj spisak',count:n=>`${n} pitanja`,correct:'Tačan odgovor',close:'Zatvori',language:'Jezik spiska'},
ru:{copy:'⧉ Скопировать вопрос',copied:'✓ Скопировано',open:'☷ Все вопросы и ответы',title:'Все вопросы и ответы',search:'Поиск вопросов и ответов на всех языках',copyAll:'⧉ Скопировать список',count:n=>`${n} ${n%10===1&&n%100!==11?'вопрос':n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?'вопроса':'вопросов'}`,correct:'Правильный ответ',close:'Закрыть',language:'Язык списка'},
en:{copy:'⧉ Copy question',copied:'✓ Copied',open:'☷ All questions and answers',title:'All questions and answers',search:'Search questions and answers in all languages',copyAll:'⧉ Copy list',count:n=>`${n} questions`,correct:'Correct answer',close:'Close',language:'List language'},
de:{copy:'⧉ Frage kopieren',copied:'✓ Kopiert',open:'☷ Alle Fragen und Antworten',title:'Alle Fragen und Antworten',search:'Fragen und Antworten in allen Sprachen suchen',copyAll:'⧉ Liste kopieren',count:n=>`${n} Fragen`,correct:'Richtige Antwort',close:'Schließen',language:'Sprache der Liste'}
};
let analysisLanguage=language;
const localizedQuestion=(q,lang=language)=>({cnr:[q.question,q.options],ru:[q.questionRu,q.optionsRu],en:[q.questionEn,q.optionsEn],de:[q.questionDe,q.optionsDe]}[lang]);
const normalizeSearch=text=>String(text).toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const searchableQuestion=q=>normalizeSearch([q.id,q.question,...q.options,q.questionRu,...q.optionsRu,q.questionEn,...q.optionsEn,q.questionDe,...q.optionsDe].join(' '));
const questionText=(q,lang=language)=>{const [title,answers]=localizedQuestion(q,lang);return `#${q.id}\n${title}\n${answers.map((answer,index)=>`${letters[index]}. ${answer}${index===q.correct?' ✓':''}`).join('\n')}\n${analysisUi[lang].correct}: ${letters[q.correct]}`};
async function copyText(text,button,lang=language){try{await navigator.clipboard.writeText(text)}catch{const area=document.createElement('textarea');area.value=text;document.body.append(area);area.select();document.execCommand('copy');area.remove()}const label=button.textContent;button.textContent=analysisUi[lang].copied;setTimeout(()=>button.textContent=label,1400)}
function translateDialog(){const x=analysisUi[analysisLanguage];$('analysis-language').value=analysisLanguage;$('analysis-language').ariaLabel=x.language;$('analysis-title').textContent=x.title;$('analysis-search').placeholder=x.search;$('copy-all').textContent=x.copyAll;$('close-analysis').ariaLabel=x.close;renderAnalysis()}
function translateAnalysis(){const x=analysisUi[language];$('copy-current').textContent=x.copy;$('open-analysis').textContent=x.open}
function renderAnalysis(){const query=normalizeSearch($('analysis-search').value.trim());const visible=questions.filter(q=>!query||searchableQuestion(q).includes(query));$('analysis-count').textContent=analysisUi[analysisLanguage].count(visible.length);$('analysis-list').replaceChildren(...visible.map(q=>{const [title,answers]=localizedQuestion(q,analysisLanguage);const article=document.createElement('article');article.className='analysis-item';const heading=document.createElement('h3');heading.textContent=`#${q.id} · ${title}`;const list=document.createElement('ol');list.type='A';answers.forEach((answer,index)=>{const li=document.createElement('li');li.textContent=answer;if(index===q.correct){li.className='analysis-correct';li.insertAdjacentText('beforeend',' ✓')}list.append(li)});article.append(heading,list);return article}))}
$('copy-current').onclick=()=>{const q=current();if(q)copyText(questionText(q),$('copy-current'))};
$('open-analysis').onclick=()=>{analysisLanguage=language;translateDialog();$('analysis-dialog').showModal();$('analysis-search').focus()};
$('close-analysis').onclick=()=>$('analysis-dialog').close();
$('analysis-dialog').onclick=e=>{if(e.target===$('analysis-dialog'))$('analysis-dialog').close()};
$('analysis-search').oninput=renderAnalysis;
$('analysis-language').onchange=e=>{analysisLanguage=e.target.value;translateDialog()};
$('copy-all').onclick=()=>copyText(questions.map(q=>questionText(q,analysisLanguage)).join('\n\n'),$('copy-all'),analysisLanguage);
document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',translateAnalysis));
translateAnalysis();
