/* 확인된 자료만 입력하세요. 타입·시안·견적·접수 설정은 이 파일에서 관리합니다. */
window.SSANGYONG_DATA = {
  apartmentId: 'ssangyong_sky', apartmentName: '서면쌍용스윗닷홈', measurementId: 'G-BH516Y53QM',
  // 원본 로고를 받으면 {src:'./assets/logo.webp',width:...,height:...} 지정.
  logo: null,
  // 사용자가 제공한 대문 이미지. 타입별 실내 3D 시안과 구분합니다.
  hero: {src:'./assets/gate-1600.webp',srcset:'./assets/gate-800.webp 800w, ./assets/gate-1600.webp 1600w',width:1600,height:900,alt:'서면쌍용스윗닷홈스카이 대문과 조경 — 제공 이미지'},
  contact: {
    endpoint:'https://api.web3forms.com/submit', accessKey:'',
    recipient:'1906interior@naver.com', recipientVerified:false,
    privacyApproved:false, retention:''
  },
  types: [
    {id:'114B',label:'114㎡ A,B(34평)',description:'114㎡ A,B(34평)을 위한 5가지 3D 제안 시안입니다. 우드톤부터 스톤 마감까지, 원하는 분위기를 비교해보세요.',images:[{"src":"./assets/114ab-1-1600.webp","srcset":"./assets/114ab-1-640.webp 640w, ./assets/114ab-1-1600.webp 1600w","width":1600,"height":900,"alt":"114㎡ A,B(34평) 우드 바닥과 밝은 주방 · 3D 제안 시안"},{"src":"./assets/114ab-2-1600.webp","srcset":"./assets/114ab-2-640.webp 640w, ./assets/114ab-2-1600.webp 1600w","width":1600,"height":900,"alt":"114㎡ A,B(34평) 스톤 바닥과 주방 · 3D 제안 시안"},{"src":"./assets/114ab-3-1600.webp","srcset":"./assets/114ab-3-640.webp 640w, ./assets/114ab-3-1600.webp 1600w","width":1600,"height":900,"alt":"114㎡ A,B(34평) 우드 루버 포인트 공간 · 3D 제안 시안"},{"src":"./assets/114ab-4-1600.webp","srcset":"./assets/114ab-4-640.webp 640w, ./assets/114ab-4-1600.webp 1600w","width":1600,"height":900,"alt":"114㎡ A,B(34평) 밝은 우드톤 공간 · 3D 제안 시안"},{"src":"./assets/114ab-5-1600.webp","srcset":"./assets/114ab-5-640.webp 640w, ./assets/114ab-5-1600.webp 1600w","width":1600,"height":900,"alt":"114㎡ A,B(34평) 헤링본 바닥과 클래식 몰딩 공간 · 3D 제안 시안"}],estimate:{price:'상담 후 안내',included:'상담 후 안내',excluded:'상담 후 안내',vat:'상담 후 안내'}},
    {id:'114C',label:'114㎡C(34평)',description:'114㎡C(34평) 전용 3D 제안 시안을 준비하고 있습니다. 원하는 공간과 공사 범위를 상담해주세요.',images:[],estimate:{price:'상담 후 안내',included:'상담 후 안내',excluded:'상담 후 안내',vat:'상담 후 안내'}},
    {id:'144',label:'144㎡(44평)',description:'144㎡(44평) 전용 3D 제안 시안을 준비하고 있습니다. 원하는 공간과 공사 범위를 상담해주세요.',images:[],estimate:{price:'상담 후 안내',included:'상담 후 안내',excluded:'상담 후 안내',vat:'상담 후 안내'}},
    {id:'170',label:'170㎡(51평)',description:'170㎡(51평) 전용 3D 제안 시안을 준비하고 있습니다. 원하는 공간과 공사 범위를 상담해주세요.',images:[],estimate:{price:'상담 후 안내',included:'상담 후 안내',excluded:'상담 후 안내',vat:'상담 후 안내'}}
  ]
};
// images例: {src:'./assets/114b-living-1200.webp',srcset:'./assets/114b-living-640.webp 640w, ./assets/114b-living-1200.webp 1200w',width:1200,height:900,alt:'거실 3D 제안 시안'}
// accessKey: 해당 이메일을 인증한 Web3Forms 공개 form access key만 입력. 비밀 API 키 금지.
