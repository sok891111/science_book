/* =========================================================
   마법과학 AR — 영상 목록 설정 파일
   ---------------------------------------------------------
   QR 코드 안에는 아래의 "코드"(예: ch1, ch2)만 넣으면 됩니다.
   앱이 코드를 보고 여기 적힌 영상을 찾아 재생해요.

   👉 영상이 바뀌어도 이 파일만 고치면 됩니다. (QR/책 다시 인쇄 X)

   각 항목 형식:
     코드: { title: "화면에 보일 제목", type: "youtube" | "mp4", ... }
       - youtube 일 때:  id: "유튜브영상ID"      (주소 watch?v=  뒤의 값)
       - mp4 일 때:      src: "videos/파일.mp4"  (또는 인터넷 주소)
   ========================================================= */

const VIDEO_MAP = {

  // ✅ 바로 테스트용 데모 (인터넷 공개 샘플 영상) — 그대로 두고 'demo' QR로 확인
  demo: {
    title: "데모 영상 (테스트용)",
    type: "mp4",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },

  // 1화 — 유튜브에 영상 올린 뒤, 아래 id를 실제 영상 ID로 바꾸세요.
  ch1: {
    title: "1화 · 조선의 영웅, 하늘로 사라지다!",
    type: "youtube",
    id: "YOUTUBE_VIDEO_ID_HERE"
  },

  // 2화 — 비행기 영상
  ch2: {
    title: "2화 · 비행기는 무슨 도술이냐?!",
    type: "youtube",
    id: "YOUTUBE_VIDEO_ID_HERE"
  },

  // 3화 — 배와 부력 영상
  ch3: {
    title: "3화 · 배는 왜 안 가라앉지?!",
    type: "youtube",
    id: "YOUTUBE_VIDEO_ID_HERE"
  },

};
