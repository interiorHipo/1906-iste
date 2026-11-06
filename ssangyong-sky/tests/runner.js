'use strict';
const output = document.getElementById('results');
const frame = document.getElementById('app');
const delay = ms=>new Promise(r=>setTimeout(r,ms));
let passed=0;
function check(value,label) { if(!value) throw new Error(label); output.textContent += 'PASS '+label+'\n'; passed++; }
function load(url) { return new Promise(resolve=>{frame.onload=resolve;frame.src=url;}); }
async function until(predicate) {for(let i=0;i<100;i++){if(predicate())return;await delay(30);}throw new Error('wait timeout');}
document.getElementById('run').onclick = async()=>{
 if(location.hostname!=='127.0.0.1'){output.textContent='로컬 전용 테스트입니다.';return;}
 passed=0;output.textContent='';
 try{
 await load('/__qa/1906-iste/ssangyong-sky/?utm_source=flyer&utm_medium=qr&utm_campaign=ssangyong_sky&name=PII_SENTINEL');
 let w=frame.contentWindow,d=w.document,$=id=>d.getElementById(id);
 const events=name=>w.dataLayer.filter(x=>x[0]==='event'&&x[1]===name);
 check(events('page_view').length===1,'page_view 1회');
 check(events('ssangyong_sky_qr_landing').length===1,'QR 캠페인 이벤트 1회');
 check(events('select_apartment_type').length===0,'초기 렌더는 타입 선택으로 집계하지 않음');
 check(!JSON.stringify(w.dataLayer).includes('PII_SENTINEL'),'URL 임의 개인정보 GA 제외');
 check(d.querySelectorAll('script[src*="googletagmanager"]').length===0,'로컬에서 실제 GA 전송 없음');
 await until(()=>$('designImage').complete);
 check(w.performance.getEntriesByType('resource').filter(x=>x.name.includes('/__qa/image/')).every(x=>x.name.includes('114B-1')),'최초 이미지 요청은 현재 타입/현재 이미지만');
 $('tab-144').click();
 check($('formType').value==='144'&&$('typeTitle').textContent==='144㎡(44평)','타입 변경 → 양식·제목 자동 반영');
 $('formType').value='170';$('formType').dispatchEvent(new w.Event('change'));
 check($('typeTitle').textContent==='170㎡(51평)','양식 타입 수동 변경 → 표시 일치');
 await until(()=>$('openViewer').disabled===false);
 $('nextImage').click();await until(()=>$('openViewer').disabled===false);
 check($('imageCounter').textContent==='2 / 2','다음 이미지');
 $('openViewer').click();check($('viewer').open,'확대 보기');
 check(events('view_design_image').length===1&&events('view_design_image')[0][2].type_id==='170','확대 이벤트 타입·1회');
 $('viewer').dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
 check($('viewerCounter').textContent==='1 / 2','확대 이미지 키보드 이동·순환');
 $('closeViewer').click();check(!$('viewer').open,'확대 닫기');
 $('tab-170').focus();$('tab-170').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Home',bubbles:true}));
 check($('formType').value==='114B'&&d.activeElement.id==='tab-114B','타입 키보드 Home과 초점');
 w.SSANGYONG_DATA.types[0].images[0].src='/__qa/image/missing.svg';$('tab-114B').click();
 await until(()=>!$('imageError').hidden);check($('openViewer').disabled,'이미지 실패 안내·확대 비활성');
 w.SSANGYONG_DATA.types[0].images[0].src='/__qa/image/retry.svg';$('retryImage').click();await until(()=>!$('openViewer').disabled);check($('imageError').hidden,'이미지 다시 불러오기');
 let requests=[],resolveFetch;
 w.fetch=async(url,opts)=>{requests.push({url,body:JSON.parse(opts.body)});return await new Promise(r=>resolveFetch=r);};
 const submit=()=>$('contactForm').dispatchEvent(new w.Event('submit',{cancelable:true,bubbles:true}));
 submit();check($('nameError').textContent&&$('phoneError').textContent&&$('consentError').textContent&&requests.length===0,'필수 입력·동의 검증과 전송 차단');
 $('name').value='검증용 이름';$('phone').value='010-12';$('consent').checked=true;submit();check(requests.length===0&&$('phone').getAttribute('aria-invalid')==='true','연락처 오류 필드 안내');
 $('phone').value='010 1234-5678';$('formType').value='';submit();check($('typeError').textContent&&requests.length===0,'타입 필수 검증');
 $('formType').value='144';$('contactForm').elements.message.value='MOCK_ONLY_PRIVATE_MESSAGE';
 $('contactForm').elements.botcheck.checked=true;submit();check(requests.length===0,'허니팟 스팸 차단');$('contactForm').elements.botcheck.checked=false;
 submit();submit();check(requests.length===1&&$('submitButton').disabled,'전송 중 중복 제출 차단');
 check(requests[0].body.phone==='01012345678'&&requests[0].body.type==='144㎡(44평)'&&requests[0].body.subject.endsWith('144㎡(44평)')&&requests[0].body.submitted_at.includes('Asia/Seoul'),'이메일 연락처 정규화·타입·제목·한국 시간');
 resolveFetch({ok:false,json:async()=>({success:false})});await until(()=>!$('submitButton').disabled);
 check($('name').value==='검증용 이름'&&$('formStatus').textContent.includes('실패')&&events('generate_lead').length===0,'실패 시 입력 유지·성공 이벤트 없음');
 submit();resolveFetch({ok:true,json:async()=>({success:false})});await until(()=>!$('submitButton').disabled);check(events('generate_lead').length===0,'HTTP 200만으로 완료 표시하지 않음');
 submit();resolveFetch({ok:true,json:async()=>({success:true})});await until(()=>!$('submitButton').disabled);
 check(events('generate_lead').length===1&&events('generate_lead')[0][2].type_id==='144'&&$('formStatus').textContent.includes('접수되었습니다'),'서비스 성공 응답만 접수 완료·lead 1회');
 check(!JSON.stringify(w.dataLayer).includes('01012345678')&&!JSON.stringify(w.dataLayer).includes('MOCK_ONLY_PRIVATE_MESSAGE')&&!JSON.stringify(w.dataLayer).includes('검증용 이름'),'GA 이벤트에 상담 개인정보 없음');
 check(events('click_phone').length===0,'전화 클릭 이전 통화 이벤트 없음');
 const phone=d.querySelector('a[href^="tel:"]');phone.addEventListener('click',e=>e.preventDefault());phone.click();check(events('click_phone').length===1,'전화 클릭 이벤트 1회 (실제 전화 없음)');
 w.SSANGYONG_DATA.contact.recipientVerified=false;$('name').value='검증';$('phone').value='01012345678';$('consent').checked=true;const count=requests.length;submit();check(requests.length===count&&$('formStatus').textContent.includes('전송되지'),'수신 설정 미완료 전송 차단');
 await load('/1906-iste/ssangyong-sky/');w=frame.contentWindow;d=w.document;$=id=>d.getElementById(id);
 check(!$('setupNotice')&&!$('designImage').hidden&&$('imageCounter').textContent==='1 / 7','실제 데이터는 114 A,B 시안 7장·상단 준비 안내 삭제');
 for(const [id,price] of [['114B','4,760만원'],['114C','4,760만원'],['144','6,100만원'],['170','7,200만원']]){
  $('tab-'+id).click();$('openIncluded').click();
  check($('includedDialog').open&&$('includedTotal').textContent===price&&$('estimatePrice').textContent===price&&d.querySelectorAll('.included-list li').length===9,'타입별 견적·포함공사 합계 '+id);
  $('closeIncluded').click();
 }
 check(!d.body.textContent.includes('144.73')&&!d.body.textContent.includes('360'),'잘못된 면적·제외 기능 없음');
 for(const width of [320,390,768,1440]){frame.style.width=width+'px';await delay(80);check(d.documentElement.scrollWidth<=d.documentElement.clientWidth,'가로 넘침 없음 '+width+'px');}
 await load('/1906-iste/');w=frame.contentWindow;d=w.document;
 check(d.querySelector('h1').textContent.includes('전포한라비발디'),'기존 전포 페이지 렌더');
 d.querySelectorAll('.type-tab')[2].click();check(d.getElementById('typeName').textContent==='111B','기존 전포 타입 선택');
 d.getElementById('openViewer').click();check(!d.getElementById('viewerModal').hidden,'기존 전포 확대');
 d.querySelector('[data-close-viewer]').click();check(d.getElementById('viewerModal').hidden,'기존 전포 닫기');
 output.textContent+='\nALL PASSED: '+passed;
 }catch(e){output.textContent+='\nFAIL '+e.stack;}
};
