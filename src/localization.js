export const languages = ["en", "id"];

const dictionary = {
  en: {
    opening: {
      eyebrow: "ARCHITECTURE / SCIENCE",
      title: "RUMAH LONTIOK",
      subtitle: "Living Architecture of Kampar",
      description:
        "Explore how traditional architecture responds to climate, airflow, and everyday life.",
      begin: "Begin Experience",
      meta: "AR / Architecture / Science / Local Wisdom",
      nextHint: "A spatial learning experience about house, climate, and culture.",
    },
    loading: {
      title: "RUMAH LONTIOK",
      subtitle: "Preparing your experience",
      tasks: ["Loading model", "Loading AR target", "Preparing audio"],
    },
    onboarding: {
      title: "Point your camera at the Rumah Lontiok image.",
      findTitle: "Find the image",
      findBody: "in your digital book",
      searching: "Searching...",
      free: "Explore freely",
      guided: "Take a guided tour",
      guidedTime: "~ 3 min",
    },
    error: {
      cameraTitle: "Camera access is needed",
      cameraBody:
        "To experience Rumah Lontiok in AR, allow camera access in your browser.",
      targetTitle: "AR target unavailable",
      targetBody: "We could not load the tracking image.",
      retry: "Try Again",
      preview: "Preview without camera",
    },
    hud: {
      place: "Kampar / Riau",
      language: "Language",
      soundOn: "Sound On",
      soundOff: "Sound Off",
      more: "More",
      reset: "Reset experience",
      guided: "Guided tour",
      imageLost: "Simulate image lost",
      targetFound: "Target found",
      targetLost: "Image lost",
      targetLostBody: "Point your camera back at the page.",
      dismiss: "Dismiss",
    },
    modes: {
      discover: {
        index: "01",
        label: "Discover",
        title: "DISCOVER",
        body: "Touch a living point to learn from the house.",
      },
      structure: {
        index: "02",
        label: "Structure",
        title: "STRUCTURE",
        body: "Understand how the house is assembled.",
      },
      air: {
        index: "03",
        label: "Air",
        title: "AIR",
        body: "How does the house breathe?",
      },
      climate: {
        index: "04",
        label: "Climate",
        title: "CLIMATE",
        body: "See how form, shade, and airflow support comfort.",
      },
    },
    hotspots: {
      window: {
        title: "Window Opening",
        eyebrow: "Natural Ventilation",
        storyTitle: "Breathing through architecture",
        body:
          "Openings allow air to move across the room and support natural ventilation.",
        listen: "Listen",
        explore: "Explore airflow",
      },
      raisedFloor: {
        title: "Raised Floor",
        eyebrow: "Living with climate",
        storyTitle: "Space below the house",
        body:
          "The raised floor keeps the living area away from damp ground and lets air move below.",
        listen: "Listen",
        explore: "Explore structure",
      },
      roof: {
        title: "Curved Roof",
        eyebrow: "Cultural identity",
        storyTitle: "A form shaped by meaning",
        body:
          "The roof profile gives the house its identity while helping shade the interior.",
        listen: "Listen",
        explore: "View climate",
      },
    },
    structure: {
      assembly: "ASSEMBLY",
      whole: "Whole",
      exploded: "Exploded",
      labels: {
        roof: "Roof Structure",
        frontWall: "Living Space",
        sideWalls: "Wall Panels",
        floor: "Raised Floor",
        foundation: "Foundation",
      },
      parts: {
        roof: {
          title: "Roof Structure",
          body:
            "The roof creates shade and gives the house its expressive silhouette.",
        },
        frontWall: {
          title: "Living Space",
          body:
            "The central room is organized for everyday life, gathering, and airflow.",
        },
        sideWalls: {
          title: "Wall Panels",
          body:
            "Wall panels define the room while openings keep the interior breathable.",
        },
        floor: {
          title: "Raised Floor",
          body:
            "The elevated floor separates the home from ground moisture and heat.",
        },
        foundation: {
          title: "Foundation",
          body:
            "Posts lift the structure and make the house responsive to its environment.",
        },
      },
    },
    airflow: {
      start: "Start airflow",
      caption: "Conceptual airflow visualization",
      stages: [
        {
          index: "01",
          title: "Air enters through openings.",
        },
        {
          index: "02",
          title: "Cross ventilation moves air through the interior.",
        },
        {
          index: "03",
          title: "Warm air is gradually replaced.",
        },
      ],
    },
    climate: {
      legendCool: "COOLER",
      legendWarm: "WARMER",
      disclaimer:
        "Illustrative thermal visualization. Not a physical temperature measurement.",
      hotspots: {
        crossVentilation: {
          title: "Cross Ventilation",
          body:
            "Cross ventilation can support a more comfortable indoor environment.",
        },
        shadedInterior: {
          title: "Shaded Interior",
          body:
            "Deep shade helps reduce direct solar exposure inside the living space.",
        },
        roofExposure: {
          title: "Roof Exposure",
          body:
            "The roof receives heat first, while the interior remains visually protected.",
        },
      },
    },
    guided: {
      progress: "Guided experience",
      previous: "Previous",
      continue: "Continue",
      steps: [
        {
          title: "Meet Rumah Lontiok",
          body:
            "Begin with the house as a cultural object, not only as a building form.",
        },
        {
          title: "Look inside",
          body:
            "Separate the main parts to understand how the structure is assembled.",
        },
        {
          title: "How air enters",
          body:
            "Openings invite outside air into the raised timber living space.",
        },
        {
          title: "How air moves",
          body:
            "Air travels through the interior and exits through another opening.",
        },
        {
          title: "Architecture and comfort",
          body:
            "Shade, ventilation, and elevation work together as environmental knowledge.",
        },
        {
          title: "Local wisdom",
          body:
            "Generations of local knowledge shaped a home that responds to culture, climate, and everyday life.",
        },
      ],
    },
    closing: {
      eyebrow: "LOCAL WISDOM",
      title: "Architecture is more than form.",
      body:
        "Rumah Lontiok shows how generations of local knowledge shaped a home that responds to culture, climate, and everyday life.",
      exploreAgain: "Explore Again",
      learnMore: "Learn More",
    },
    audio: {
      narration: "Narration",
      listen: "Listen",
    },
  },
  id: {
    opening: {
      eyebrow: "ARSITEKTUR / SAINS",
      title: "RUMAH LONTIOK",
      subtitle: "Arsitektur Hidup dari Kampar",
      description:
        "Jelajahi bagaimana arsitektur tradisional merespons iklim, aliran udara, dan kehidupan sehari-hari.",
      begin: "Mulai Pengalaman",
      meta: "AR / Arsitektur / Sains / Kearifan Lokal",
      nextHint: "Pengalaman belajar spasial tentang rumah, iklim, dan budaya.",
    },
    loading: {
      title: "RUMAH LONTIOK",
      subtitle: "Menyiapkan pengalaman",
      tasks: ["Memuat model", "Memuat target AR", "Menyiapkan audio"],
    },
    onboarding: {
      title: "Arahkan kamera ke gambar Rumah Lontiok.",
      findTitle: "Temukan gambar",
      findBody: "di buku digital Anda",
      searching: "Mencari...",
      free: "Jelajah bebas",
      guided: "Ikuti tur terpandu",
      guidedTime: "~ 3 menit",
    },
    error: {
      cameraTitle: "Akses kamera dibutuhkan",
      cameraBody:
        "Untuk mengalami Rumah Lontiok dalam AR, izinkan akses kamera di browser Anda.",
      targetTitle: "Target AR tidak tersedia",
      targetBody: "Gambar pelacakan tidak dapat dimuat.",
      retry: "Coba Lagi",
      preview: "Pratinjau tanpa kamera",
    },
    hud: {
      place: "Kampar / Riau",
      language: "Bahasa",
      soundOn: "Suara Aktif",
      soundOff: "Suara Mati",
      more: "Lainnya",
      reset: "Ulangi pengalaman",
      guided: "Tur terpandu",
      imageLost: "Simulasikan gambar hilang",
      targetFound: "Target ditemukan",
      targetLost: "Gambar hilang",
      targetLostBody: "Arahkan kembali kamera ke halaman.",
      dismiss: "Tutup",
    },
    modes: {
      discover: {
        index: "01",
        label: "Jelajah",
        title: "JELAJAH",
        body: "Sentuh titik hidup untuk belajar dari rumah.",
      },
      structure: {
        index: "02",
        label: "Struktur",
        title: "STRUKTUR",
        body: "Pahami bagaimana rumah ini tersusun.",
      },
      air: {
        index: "03",
        label: "Udara",
        title: "UDARA",
        body: "Bagaimana rumah ini bernapas?",
      },
      climate: {
        index: "04",
        label: "Iklim",
        title: "IKLIM",
        body: "Lihat bagaimana bentuk, naungan, dan udara mendukung kenyamanan.",
      },
    },
    hotspots: {
      window: {
        title: "Bukaan Jendela",
        eyebrow: "Ventilasi Alami",
        storyTitle: "Bernapas lewat arsitektur",
        body:
          "Bukaan memungkinkan udara bergerak melintasi ruang dan mendukung ventilasi alami.",
        listen: "Dengarkan",
        explore: "Jelajahi udara",
      },
      raisedFloor: {
        title: "Lantai Panggung",
        eyebrow: "Hidup bersama iklim",
        storyTitle: "Ruang di bawah rumah",
        body:
          "Lantai yang ditinggikan menjauhkan ruang hidup dari tanah lembap dan membiarkan udara bergerak di bawahnya.",
        listen: "Dengarkan",
        explore: "Jelajahi struktur",
      },
      roof: {
        title: "Atap Melengkung",
        eyebrow: "Identitas budaya",
        storyTitle: "Bentuk yang bermakna",
        body:
          "Profil atap memberi identitas pada rumah sekaligus membantu menaungi ruang dalam.",
        listen: "Dengarkan",
        explore: "Lihat iklim",
      },
    },
    structure: {
      assembly: "RAKITAN",
      whole: "Utuh",
      exploded: "Terurai",
      labels: {
        roof: "Struktur Atap",
        frontWall: "Ruang Hidup",
        sideWalls: "Panel Dinding",
        floor: "Lantai Panggung",
        foundation: "Fondasi",
      },
      parts: {
        roof: {
          title: "Struktur Atap",
          body:
            "Atap menciptakan naungan dan memberi siluet ekspresif pada rumah.",
        },
        frontWall: {
          title: "Ruang Hidup",
          body:
            "Ruang utama diatur untuk kehidupan sehari-hari, berkumpul, dan aliran udara.",
        },
        sideWalls: {
          title: "Panel Dinding",
          body:
            "Panel dinding membentuk ruang, sementara bukaan menjaga interior tetap bernapas.",
        },
        floor: {
          title: "Lantai Panggung",
          body:
            "Lantai yang terangkat memisahkan rumah dari kelembapan dan panas tanah.",
        },
        foundation: {
          title: "Fondasi",
          body:
            "Tiang mengangkat struktur dan membuat rumah responsif terhadap lingkungannya.",
        },
      },
    },
    airflow: {
      start: "Mulai aliran udara",
      caption: "Visualisasi aliran udara konseptual",
      stages: [
        {
          index: "01",
          title: "Udara masuk melalui bukaan.",
        },
        {
          index: "02",
          title: "Ventilasi silang membawa udara melalui interior.",
        },
        {
          index: "03",
          title: "Udara hangat perlahan tergantikan.",
        },
      ],
    },
    climate: {
      legendCool: "LEBIH SEJUK",
      legendWarm: "LEBIH HANGAT",
      disclaimer:
        "Visualisasi termal ilustratif. Bukan pengukuran suhu fisik.",
      hotspots: {
        crossVentilation: {
          title: "Ventilasi Silang",
          body:
            "Ventilasi silang dapat mendukung lingkungan dalam ruang yang lebih nyaman.",
        },
        shadedInterior: {
          title: "Interior Teduh",
          body:
            "Naungan dalam membantu mengurangi paparan matahari langsung di ruang hidup.",
        },
        roofExposure: {
          title: "Paparan Atap",
          body:
            "Atap menerima panas lebih dulu, sementara interior tetap terlindungi secara visual.",
        },
      },
    },
    guided: {
      progress: "Pengalaman terpandu",
      previous: "Sebelumnya",
      continue: "Lanjutkan",
      steps: [
        {
          title: "Mengenal Rumah Lontiok",
          body:
            "Mulai dari rumah sebagai objek budaya, bukan hanya bentuk bangunan.",
        },
        {
          title: "Melihat ke dalam",
          body:
            "Pisahkan bagian utama untuk memahami bagaimana strukturnya tersusun.",
        },
        {
          title: "Bagaimana udara masuk",
          body:
            "Bukaan mengundang udara luar masuk ke ruang hidup kayu yang terangkat.",
        },
        {
          title: "Bagaimana udara bergerak",
          body:
            "Udara bergerak melalui interior dan keluar lewat bukaan lain.",
        },
        {
          title: "Arsitektur dan kenyamanan",
          body:
            "Naungan, ventilasi, dan elevasi bekerja bersama sebagai pengetahuan lingkungan.",
        },
        {
          title: "Kearifan lokal",
          body:
            "Pengetahuan lokal lintas generasi membentuk rumah yang merespons budaya, iklim, dan keseharian.",
        },
      ],
    },
    closing: {
      eyebrow: "KEARIFAN LOKAL",
      title: "Arsitektur lebih dari sekadar bentuk.",
      body:
        "Rumah Lontiok menunjukkan bagaimana pengetahuan lokal lintas generasi membentuk hunian yang merespons budaya, iklim, dan kehidupan sehari-hari.",
      exploreAgain: "Jelajahi Lagi",
      learnMore: "Pelajari Lagi",
    },
    audio: {
      narration: "Narasi",
      listen: "Dengarkan",
    },
  },
};

export function makeTranslator(language) {
  const active = dictionary[language] ? language : "en";
  return function translate(path) {
    const value = path.split(".").reduce((result, key) => {
      if (result && Object.prototype.hasOwnProperty.call(result, key)) {
        return result[key];
      }
      return undefined;
    }, dictionary[active]);

    return value === undefined ? path : value;
  };
}
