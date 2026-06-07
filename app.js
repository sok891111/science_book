/* =========================================================
   마법과학 AR — 메인 로직
   흐름: 시작화면 → 카메라(QR스캔) → 영상재생 → 끝나면 다시 스캔
   ========================================================= */

(() => {
  "use strict";

  // --- 화면 요소들 ---
  const screens = {
    start: document.getElementById("screen-start"),
    scan: document.getElementById("screen-scan"),
    player: document.getElementById("screen-player"),
  };
  const scanStatus = document.getElementById("scan-status");
  const playGate = document.getElementById("play-gate");
  const playTitle = document.getElementById("play-title");
  const mp4 = document.getElementById("mp4-player");
  const ytContainer = document.getElementById("yt-player");

  let html5qr = null;       // QR 스캐너 인스턴스
  let ytPlayer = null;      // 유튜브 플레이어
  let ytApiReady = false;
  let isScanning = false;
  let currentItem = null;   // 현재 재생할 영상 정보

  // --- 화면 전환 ---
  function show(name) {
    Object.values(screens).forEach((s) => s.classList.remove("active"));
    screens[name].classList.add("active");
  }

  /* =======================  스캔(카메라)  ======================= */

  async function startScanner() {
    show("scan");
    scanStatus.textContent = "";
    if (!html5qr) html5qr = new Html5Qrcode("reader", { verbose: false });

    const config = {
      fps: 10,
      qrbox: { width: 240, height: 240 },
      aspectRatio: 1.0,
      rememberLastUsedCamera: true,
    };

    try {
      await html5qr.start(
        { facingMode: "environment" }, // 뒷면 카메라
        config,
        onScanSuccess,
        () => {} // 인식 실패(매 프레임)는 무시
      );
      isScanning = true;
    } catch (err) {
      scanStatus.textContent =
        "카메라를 열 수 없어요 😢 (권한 허용 / https 주소인지 확인해주세요)";
      console.error(err);
    }
  }

  async function stopScanner() {
    if (html5qr && isScanning) {
      try {
        await html5qr.stop();
      } catch (e) {
        /* ignore */
      }
      isScanning = false;
    }
  }

  function onScanSuccess(decodedText) {
    const code = parseCode(decodedText);
    const item = VIDEO_MAP[code];

    if (!item) {
      scanStatus.textContent = `'${code}' 영상을 찾을 수 없어요. 다른 QR을 비춰보세요.`;
      return; // 계속 스캔
    }
    if (item.type === "youtube" && (!item.id || item.id === "YOUTUBE_VIDEO_ID_HERE")) {
      scanStatus.textContent = `'${code}' 영상이 아직 준비되지 않았어요.`;
      return;
    }

    // 인식 성공 → 스캐너 끄고 재생 준비
    stopScanner().then(() => openPlayer(item));
  }

  // QR 내용에서 코드만 추출 (그냥 "ch1" 이거나, 주소 끝 #ch1 / ?code=ch1 형태 모두 허용)
  function parseCode(text) {
    let t = (text || "").trim();
    if (t.includes("#")) t = t.split("#").pop();
    if (t.includes("code=")) t = t.split("code=").pop().split("&")[0];
    if (t.includes("/")) t = t.split("/").pop();
    return t.trim();
  }

  /* =======================  재생  ======================= */

  function openPlayer(item) {
    currentItem = item;
    show("player");
    // iOS는 사용자가 한 번 눌러야 소리가 나옴 → '재생' 버튼(게이트) 표시
    playTitle.textContent = item.title || "영상";
    playGate.style.display = "flex";
    mp4.style.display = "none";
    ytContainer.style.display = "none";
  }

  function actuallyPlay() {
    if (!currentItem) return;
    playGate.style.display = "none";

    if (currentItem.type === "mp4") {
      ytContainer.style.display = "none";
      mp4.style.display = "block";
      mp4.src = currentItem.src;
      mp4.currentTime = 0;
      mp4.play().catch((e) => console.warn("재생 대기", e));
      mp4.onended = returnToScanner;
    } else if (currentItem.type === "youtube") {
      mp4.style.display = "none";
      ytContainer.style.display = "block";
      playYouTube(currentItem.id);
    }
  }

  function playYouTube(videoId) {
    const startIt = () => {
      if (ytPlayer) {
        ytPlayer.loadVideoById(videoId);
        ytPlayer.playVideo();
      } else {
        ytPlayer = new YT.Player("yt-player", {
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            rel: 0,           // 다른 채널 추천영상 최소화
            modestbranding: 1,
            playsinline: 1,
            fs: 1,
          },
          events: {
            onReady: (e) => e.target.playVideo(),
            onStateChange: (e) => {
              if (e.data === YT.PlayerState.ENDED) returnToScanner();
            },
          },
        });
      }
    };
    if (ytApiReady) startIt();
    else pendingYouTube = startIt; // API 로드 후 실행
  }

  function stopPlayback() {
    try {
      mp4.pause();
      mp4.removeAttribute("src");
      mp4.load();
    } catch (e) {}
    if (ytPlayer) {
      try {
        ytPlayer.stopVideo();
      } catch (e) {}
    }
    currentItem = null;
  }

  function returnToScanner() {
    stopPlayback();
    startScanner();
  }

  /* =======================  유튜브 API 로드  ======================= */

  let pendingYouTube = null;
  window.onYouTubeIframeAPIReady = function () {
    ytApiReady = true;
    if (pendingYouTube) {
      const fn = pendingYouTube;
      pendingYouTube = null;
      fn();
    }
  };
  function loadYouTubeApi() {
    if (document.getElementById("yt-api")) return;
    const tag = document.createElement("script");
    tag.id = "yt-api";
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  }

  /* =======================  버튼 연결  ======================= */

  document.getElementById("btn-open-camera").addEventListener("click", () => {
    loadYouTubeApi(); // 미리 준비
    startScanner();
  });

  document.getElementById("btn-play").addEventListener("click", actuallyPlay);

  document.getElementById("btn-back-from-scan").addEventListener("click", () => {
    stopScanner().then(() => show("start"));
  });

  document.getElementById("btn-back-from-player").addEventListener("click", () => {
    returnToScanner();
  });

  // 서비스워커(오프라인) 등록 — 있으면 등록, 없으면 무시
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  }
})();
