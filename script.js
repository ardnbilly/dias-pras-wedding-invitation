// --- FITUR SALIN REKENING (KODE ACUAN WORK) ---
const buttonsSalin = document.querySelectorAll(".salin");

buttonsSalin.forEach(btn => {
  btn.addEventListener("click", function () {
    const norek = btn.getAttribute("data-norek");

    // Fallback manual pakai tempInput (Cara lama yang ampuh)
    const tempInput = document.createElement("input");
    tempInput.value = norek;
    document.body.appendChild(tempInput);
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // Untuk iPhone/iOS
    document.execCommand("copy");
    document.body.removeChild(tempInput);

    // Feedback kepada user
    const teksAsli = btn.innerText;
    btn.innerText = "Tersalin!";
    btn.style.backgroundColor = "#4CAF50"; // Hijau
    btn.style.color = "white";

    setTimeout(() => {
      btn.innerText = teksAsli;
      btn.style.backgroundColor = ""; // Kembali ke CSS asli
      btn.style.color = "";
    }, 1500);
  });
});

// 1. Registrasi Plugin
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  // --- FITUR NAMA TAMU DINAMIS ---
  const urlParams = new URLSearchParams(window.location.search);
  const namaTamu = urlParams.get("to"); // Mengambil text setelah '?to='
  const guestElement = document.querySelector(".name-guest");

  if (guestElement && namaTamu) {
    // Mengubah tanda plus (+) atau %20 menjadi spasi biasa
    guestElement.innerText = decodeURIComponent(namaTamu);
  } else if (guestElement) {
    // Nama default jika link tidak ada parameter '?to='
    guestElement.innerText = "Nama Tamu";
  }

  const music = document.getElementById("wedding-music");
  const btnOpen = document.getElementById("open-btn");
  const home = document.querySelector(".home-section");
  const utama = document.getElementById("utama");

  // Setting Awal: Sembunyikan utama
  gsap.set(utama, { display: "none", opacity: 0 });

  // --- 2. ANIMASI HOME (STABIL) ---
  const tlHome = gsap.timeline({
    defaults: { ease: "power2.out", duration: 0.8 }
  });

  tlHome
    .from(".top-ornamen1", { y: -50, opacity: 0 })
    .from(".bottom-ornamen1", { y: 50, opacity: 0 }, "-=0.6")
    .from(
      ".home-section h1, .home-section p, .home-section button",
      {
        y: 20,
        opacity: 0,
        stagger: 0.1
      },
      "-=0.5"
    );

  // --- 3. TRANSISI BUKA (DIRECT REVEAL) ---
  if (btnOpen) {
    btnOpen.addEventListener("click", () => {
      // Putar musik
      if (music) music.play().catch(() => {});

      // Langsung transisi
      gsap.to(home, {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          home.style.display = "none";
          utama.style.display = "block";
          utama.style.opacity = 1;

          window.scrollTo(0, 0);

          // Pemicu semua animasi konten & wavy secara instan
          initContentAnimations();
          initFloatingOrnaments();

          // Refresh posisi scroll agar reveal terdeteksi dengan benar
          ScrollTrigger.refresh();
        }
      });
    });
  }
});

// --- 4. FUNGSI ANIMASI KONTEN (REVEAL SATU-SATU) ---
function initContentAnimations() {
  const s1Elements = document.querySelectorAll(
    ".section1-top *, .char, .ornamen-2, .ornamen-3, .copy-ornamen-3"
  );

  if (s1Elements.length > 0) {
    s1Elements.forEach((el, index) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play reverse play reverse"
        },
        opacity: 0,
        scale: 0.98,
        y: 20,
        duration: 2.5,
        delay: index * 0.5,
        ease: "expo.out"
      });
    });
  }

  const standardElements = document.querySelectorAll(
    ".section2 h1, .section2 h2, .section2 p, .section2 button, " +
      ".section3 h1, .section3 h2, .section3 p, " +
      ".section4 .border, .section4 h1, .section4 h2, .section4 p, .section4 button, " +
      ".section5 .wedding-gift, .section5 .card, .section5 h1, .lihat-lokasi"
  );

  if (standardElements.length > 0) {
    standardElements.forEach(el => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 95%",
          toggleActions: "play reverse play reverse"
        },
        y: 35,
        opacity: 0,
        duration: 2,
        ease: "power2.out",
        clearProps: "all"
      });
    });
  }
}

// --- 5. EFEK WAVY ATAS-BAWAH (HANYA CHAR, ORNAMEN 3 & 4) ---
function initFloatingOrnaments() {
  const wavyItems = document.querySelectorAll(
    ".ornamen-3, .copy-ornamen-3, .ornamen3-section2, .ornamen4-section2, [class*='ornamen3-'], [class*='ornamen4-'], .ornamen1-section3, .ornamen2-section3, .ornamen1-section5, .copy-ornamen1-section5, .ornamen2-section5, .copy-ornamen2-section5"
  );

  if (wavyItems.length > 0) {
    wavyItems.forEach((item, index) => {
      gsap.to(item, {
        y: 15,
        duration: 3 + (index % 3),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.1
      });
    });
  }
}

document.addEventListener("visibilitychange", () => {
  const music = document.getElementById("wedding-music");
  if (!music) return;

  if (document.hidden) {
    // Musik mati saat tamu buka WA atau pindah tab
    music.pause();
  } else {
    // Musik lanjut lagi saat tamu balik ke undangan
    // Cek dulu apakah halaman 'utama' sudah terbuka (bukan di home)
    const utama = document.getElementById("utama");
    if (utama && utama.style.display === "block") {
      music.play().catch(() => {});
    }
  }
});
