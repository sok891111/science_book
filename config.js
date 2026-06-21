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

  // 1화 — qr-ch1.png와 연결되는 로컬 mp4 영상
  ch1: {
    title: "1화 · 조선의 영웅, 하늘로 사라지다!",
    type: "mp4",
    src: "source/videos/video1.mp4"
  },

  // 2화 — 비행기 영상
  ch2: {
    title: "4화 · 로켓이 하늘로 날아간다고?!",
    type: "mp4",
    src: "source/videos/video2.mp4"
  },

  // 3화 — 배와 부력 영상
  ch3: {
    title: "5화 · 나는 왜 날아가지 않지?!",
    type: "mp4",
    src: "source/videos/video3.mp4"
  },

  ch4: {
    title: "6화 · 뜨거워라 마찰열!",
    type: "mp4",
    src: "source/videos/video4.mp4"
  },

  ch5: {
    title: "7화 · 전기야 흘러라!",
    type: "mp4",
    src: "source/videos/video5.mp4"
  },

  ch6: {
    title: "8화 · 찌릿 정전기!",
    type: "mp4",
    src: "source/videos/video6.mp4"
  },

  ch7: {
    title: "9화 · 전기를 만들어라 - 발전!",
    type: "mp4",
    src: "source/videos/video7.mp4"
  },
};
