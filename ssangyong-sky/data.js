/* 확인된 자료만 입력하세요. 타입·시안·견적·접수 설정은 이 파일에서 관리합니다. */
window.SSANGYONG_DATA = {
  apartmentId: 'ssangyong_sky', apartmentName: '서면쌍용스윗닷홈', measurementId: 'G-BH516Y53QM',
  // 원본 로고를 받으면 {src:'./assets/logo.webp',width:...,height:...} 지정.
  logo: null,
  // 실제 서면쌍용 대표 시안만 지정. images와 같은 구조.
  hero: null,
  contact: {
    endpoint:'https://api.web3forms.com/submit', accessKey:'',
    recipient:'1906interior@naver.com', recipientVerified:false,
    privacyApproved:false, retention:''
  },
  types: [
    {id:'114B',label:'114㎡B(34평)',description:'114㎡B(34평) 전용 3D 제안 시안을 준비하고 있습니다. 원하는 공간과 공사 범위를 상담해주세요.',images:[],estimate:{price:'상담 후 안내',included:'상담 후 안내',excluded:'상담 후 안내',vat:'상담 후 안내'}},
    {id:'114C',label:'114㎡C(34평)',description:'114㎡C(34평) 전용 3D 제안 시안을 준비하고 있습니다. 원하는 공간과 공사 범위를 상담해주세요.',images:[],estimate:{price:'상담 후 안내',included:'상담 후 안내',excluded:'상담 후 안내',vat:'상담 후 안내'}},
    {id:'144',label:'144㎡(44평)',description:'144㎡(44평) 전용 3D 제안 시안을 준비하고 있습니다. 원하는 공간과 공사 범위를 상담해주세요.',images:[],estimate:{price:'상담 후 안내',included:'상담 후 안내',excluded:'상담 후 안내',vat:'상담 후 안내'}},
    {id:'170',label:'170㎡(51평)',description:'170㎡(51평) 전용 3D 제안 시안을 준비하고 있습니다. 원하는 공간과 공사 범위를 상담해주세요.',images:[],estimate:{price:'상담 후 안내',included:'상담 후 안내',excluded:'상담 후 안내',vat:'상담 후 안내'}}
  ]
};
// images例: {src:'./assets/114b-living-1200.webp',srcset:'./assets/114b-living-640.webp 640w, ./assets/114b-living-1200.webp 1200w',width:1200,height:900,alt:'거실 3D 제안 시안'}
// accessKey: 해당 이메일을 인증한 Web3Forms 공개 form access key만 입력. 비밀 API 키 금지.
