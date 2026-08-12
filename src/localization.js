export const languages = [
  { code: "en", short: "EN", label: "English" },
  { code: "id", short: "ID", label: "Indonesia" },
  { code: "ko", short: "KO", label: "한국어" },
  { code: "zh-TW", short: "TW", label: "繁體中文" },
];

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
    paths: {
      eyebrow: "CHOOSE A LEARNING PATH",
      title: "Start with intention.",
      body:
        "Select how you want to meet Rumah Lontiok before the camera opens.",
      back: "Back",
      items: {
        explore: {
          label: "Explore AR",
          title: "Move freely through the house.",
          body:
            "Open the AR scene and discover cultural details through quiet hotspots.",
          action: "Start exploring",
        },
        guided: {
          label: "Guided Lesson",
          title: "Follow a focused 3 min story.",
          body:
            "A sequenced walkthrough connects form, airflow, climate, and local wisdom.",
          action: "Begin lesson",
        },
        lab: {
          label: "Interactive Lab",
          title: "Make a prediction first.",
          body:
            "Choose a science mission, answer a quick challenge, then test the idea in AR.",
          action: "Open lab",
        },
        quiz: {
          label: "Interactive Quiz",
          title: "Check what you understand.",
          body:
            "7 random questions with a timer, A-D options, multi-answer rounds, and a final score.",
          action: "Start quiz",
        },
      },
    },
    lab: {
      eyebrow: "INTERACTIVE LAB",
      title: "Choose a question to investigate.",
      body:
        "A short prediction gives the AR experience a learning goal before the scan begins.",
      missionsTitle: "Mission",
      startAr: "Continue to AR",
      changePath: "Change path",
      correct: "Good prediction.",
      incorrect: "Try another prediction.",
      feedbackIntro: "Learning note",
      missions: {
        air: {
          label: "Airflow",
          title: "How does air move through the house?",
          body:
            "Predict which architectural element helps the room breathe before you visualize airflow.",
          question: "Which feature best supports cross ventilation?",
          modeHint: "Your AR scene will open in Air mode.",
          choices: [
            {
              id: "opposite-openings",
              title: "Openings on opposite sides",
              body: "Air can enter and leave through different sides.",
              correct: true,
            },
            {
              id: "closed-wall",
              title: "A fully closed wall",
              body: "This blocks movement instead of guiding it.",
              correct: false,
            },
            {
              id: "low-floor",
              title: "A floor directly on the ground",
              body: "This does not create the same airflow opportunity.",
              correct: false,
            },
          ],
          insight:
            "Openings on more than one side allow air to pass across the interior instead of stopping inside.",
        },
        structure: {
          label: "Structure",
          title: "Why is the house lifted from the ground?",
          body:
            "Predict the value of the raised floor before you separate the house into parts.",
          question: "What does the raised floor help the house respond to?",
          modeHint: "Your AR scene will open in Structure mode.",
          choices: [
            {
              id: "ground-moisture",
              title: "Ground moisture and airflow below",
              body: "Elevation separates the living floor from damp ground.",
              correct: true,
            },
            {
              id: "paint-color",
              title: "Only exterior color",
              body: "Color can carry meaning, but it is not the structural reason.",
              correct: false,
            },
            {
              id: "room-count",
              title: "More rooms automatically",
              body: "The floor height does not by itself create more rooms.",
              correct: false,
            },
          ],
          insight:
            "The raised floor supports climate response by separating daily life from heat, dampness, and ground conditions.",
        },
        climate: {
          label: "Climate",
          title: "Where does comfort come from?",
          body:
            "Predict how shade and airflow work together before viewing the thermal layer.",
          question: "Which combination best supports a comfortable interior?",
          modeHint: "Your AR scene will open in Climate mode.",
          choices: [
            {
              id: "shade-airflow",
              title: "Shade plus moving air",
              body: "The interior benefits from both protection and ventilation.",
              correct: true,
            },
            {
              id: "direct-sun",
              title: "More direct sun inside",
              body: "Direct sun can increase heat gain in the living space.",
              correct: false,
            },
            {
              id: "sealed-room",
              title: "A sealed room with no openings",
              body: "A sealed room limits natural air movement.",
              correct: false,
            },
          ],
          insight:
            "Comfort is not one feature. Shade, elevation, and moving air work together as environmental knowledge.",
        },
      },
    },
    xray: {
      menu: "Cultural layers",
      eyebrow: "X-RAY CULTURAL LAYERS",
      title: "See the house in layers.",
      body:
        "Move from architecture to airflow, climate, daily life, and local wisdom without leaving the AR scene.",
      auto: "Cinematic reveal",
      layers: {
        normal: {
          label: "Normal",
          title: "Rumah Lontiok as a whole",
          body: "The house appears as a complete cultural and environmental object.",
        },
        architecture: {
          label: "Architecture",
          title: "Timber structure",
          body: "An x-ray view reveals roof, walls, raised floor, and posts as one system.",
        },
        airflow: {
          label: "Airflow",
          title: "How the house breathes",
          body: "Openings guide air through the interior as a conceptual ventilation path.",
        },
        climate: {
          label: "Climate",
          title: "Shade and comfort",
          body: "A refined thermal layer shows how shade, elevation, and air support comfort.",
        },
        dailyLife: {
          label: "Daily Life",
          title: "Architecture for everyday living",
          body: "The raised living space supports gathering, rest, and daily movement.",
        },
        wisdom: {
          label: "Local Wisdom",
          title: "Knowledge shaped into form",
          body: "Culture, climate, and craft are held together in the house's design.",
        },
      },
      annotations: {
        architecture: ["Roof frame", "Raised timber floor", "Foundation posts"],
        airflow: ["Inlet opening", "Cross ventilation", "Exit path"],
        climate: ["Deep shade", "Cooler interior", "Roof exposure"],
        dailyLife: ["Gathering space", "Threshold", "Daily circulation"],
        wisdom: ["Craft knowledge", "Climate response", "Cultural identity"],
      },
    },
    causeEffect: {
      menu: "Cause & effect",
      eyebrow: "CAUSE & EFFECT LAB",
      title: "Change one element. Watch the house respond.",
      body:
        "These controls are conceptual learning tools, not physical simulation results.",
      openings: "Openings",
      floorHeight: "Floor height",
      roofShade: "Roof shade",
      low: "Low",
      medium: "Medium",
      wide: "Wide",
      raised: "Raised",
      short: "Short",
      deep: "Deep",
      feedback: {
        openings:
          "Wider openings increase the visible airflow path through the room.",
        floorHeight:
          "A raised floor separates daily life from ground moisture and lets air move below.",
        roofShade:
          "Deeper shade lowers the illustrative heat layer across the living space.",
      },
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
      startScan: "Start scanning",
      changePath: "Change path",
      pathTitle: "Learning path selected",
      pathBody: "When you are ready, find the Rumah Lontiok image.",
    },
    target: {
      mode: "Target mode",
      simulated: "Simulated",
      real: "Real target",
      simulatedBody: "Auto-detects after a short delay for presentation.",
      realBody: "Use the generated target image on another screen or printed page.",
      openTarget: "Open target image",
      realNote:
        "Real tracking is ready for MindAR once assets/targets/rumah-lontiok.mind is compiled.",
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
      home: "Home",
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
      quiz: {
        index: "05",
        label: "Quiz",
        title: "QUIZ",
        body: "Test what you discovered across the AR layers.",
      },
    },
    quiz: {
      eyebrow: "INTERACTIVE QUIZ",
      title: "Play the knowledge check.",
      body: "Answer questions about structure, airflow, climate, and local wisdom.",
      shuffleNote: "{count} random questions drawn from a bank of {total}.",
      progress: "Question",
      correct: "Correct",
      incorrect: "Review this idea",
      timeUp: "Time is up",
      timer: "Timer",
      points: "pt",
      submit: "Submit answer",
      selectOne: "Choose one answer.",
      selectMultiple: "More than one answer is correct.",
      continue: "Continue",
      finish: "Finish quiz",
      restart: "Restart quiz",
      score: "Score",
      correctAnswers: "Correct answers",
      grade: "Grade",
      gradeScale: "0-100 scale",
      accuracy: "accuracy",
      answerReview: "Answer review",
      reviewCorrect: "Correct",
      reviewIncorrect: "Needs review",
      resultStrong: "Strong work. You connected structure, airflow, climate, and local wisdom into one picture.",
      resultGood: "Good progress. A few ideas need another pass before the concept feels complete.",
      resultRetry: "Revisit the AR layers, then retry: a new set of questions is drawn every attempt.",
      back: "Back",
      completeTitle: "Quiz results",
      completeBody:
        "Your score summarizes how well you connected the clues with the learning concepts.",
      types: {
        single: "Multiple choice",
        picture: "Picture choice",
        trueFalse: "True / False",
        multi: "Multiple answers",
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
      summaryTitle: "Learning Summary",
      summary: {
        discovered: {
          title: "What I discovered",
          body:
            "Rumah Lontiok is both a cultural home and an environmental learning system.",
        },
        architecture: {
          title: "Architecture lesson",
          body:
            "Structure, elevation, and shade are assembled to respond to place.",
        },
        science: {
          title: "Science lesson",
          body:
            "Air movement and heat comfort can be understood through visible cause and effect.",
        },
        wisdom: {
          title: "Cultural wisdom",
          body:
            "Local knowledge turns climate response into meaningful architectural form.",
        },
      },
    },
    audio: {
      narration: "Narration",
      listen: "Listen",
    },
    share: {
      title: "Learn Rumah Lontiok AR",
      message:
        "Come learn Rumah Lontiok through an interactive AR experience about architecture, airflow, climate, and local wisdom.",
      cta: "Share",
      heading: "Share Rumah Lontiok AR",
      body: "Invite friends to explore architecture, science, and local wisdom in one interactive learning experience.",
      native: "Share from device",
      whatsapp: "WhatsApp",
      facebook: "Facebook",
      x: "X",
      telegram: "Telegram",
      copy: "Copy link",
      copied: "Link copied",
      close: "Close",
      previewNote:
        "Thumbnail previews appear in WhatsApp or social feeds after this page is hosted on a public URL.",
    },
    language: {
      label: "Language",
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
    paths: {
      eyebrow: "PILIH JALUR BELAJAR",
      title: "Mulai dengan tujuan.",
      body:
        "Pilih cara Anda mengenal Rumah Lontiok sebelum kamera dibuka.",
      back: "Kembali",
      items: {
        explore: {
          label: "Explore AR",
          title: "Jelajahi rumah dengan bebas.",
          body:
            "Buka adegan AR dan temukan detail budaya melalui hotspot yang tenang.",
          action: "Mulai jelajah",
        },
        guided: {
          label: "Pelajaran Terpandu",
          title: "Ikuti cerita fokus 3 menit.",
          body:
            "Alur bertahap menghubungkan bentuk, aliran udara, iklim, dan kearifan lokal.",
          action: "Mulai pelajaran",
        },
        lab: {
          label: "Lab Interaktif",
          title: "Buat prediksi lebih dulu.",
          body:
            "Pilih misi sains, jawab tantangan singkat, lalu uji gagasannya di AR.",
          action: "Buka lab",
        },
        quiz: {
          label: "Kuis Interaktif",
          title: "Cek pemahaman Anda.",
          body:
            "7 soal acak dengan timer, opsi A-D, ronde multi-jawaban, dan skor akhir.",
          action: "Mulai kuis",
        },
      },
    },
    lab: {
      eyebrow: "LAB INTERAKTIF",
      title: "Pilih pertanyaan untuk diselidiki.",
      body:
        "Prediksi singkat memberi tujuan belajar pada pengalaman AR sebelum proses scan dimulai.",
      missionsTitle: "Misi",
      startAr: "Lanjut ke AR",
      changePath: "Ganti jalur",
      correct: "Prediksi tepat.",
      incorrect: "Coba prediksi lain.",
      feedbackIntro: "Catatan belajar",
      missions: {
        air: {
          label: "Aliran Udara",
          title: "Bagaimana udara bergerak melalui rumah?",
          body:
            "Prediksi elemen arsitektur yang membantu ruang bernapas sebelum visualisasi aliran udara.",
          question: "Fitur mana yang paling mendukung ventilasi silang?",
          modeHint: "Adegan AR akan dibuka di mode Udara.",
          choices: [
            {
              id: "opposite-openings",
              title: "Bukaan pada sisi berlawanan",
              body: "Udara dapat masuk dan keluar melalui sisi berbeda.",
              correct: true,
            },
            {
              id: "closed-wall",
              title: "Dinding tertutup penuh",
              body: "Ini menghambat gerak udara, bukan mengarahkannya.",
              correct: false,
            },
            {
              id: "low-floor",
              title: "Lantai langsung di atas tanah",
              body: "Ini tidak memberi peluang aliran udara yang sama.",
              correct: false,
            },
          ],
          insight:
            "Bukaan di lebih dari satu sisi memungkinkan udara melintasi interior, bukan berhenti di dalam.",
        },
        structure: {
          label: "Struktur",
          title: "Mengapa rumah diangkat dari tanah?",
          body:
            "Prediksi nilai lantai panggung sebelum bagian rumah dipisahkan.",
          question: "Apa yang dibantu oleh lantai panggung?",
          modeHint: "Adegan AR akan dibuka di mode Struktur.",
          choices: [
            {
              id: "ground-moisture",
              title: "Kelembapan tanah dan udara di bawah",
              body: "Elevasi memisahkan ruang hidup dari tanah lembap.",
              correct: true,
            },
            {
              id: "paint-color",
              title: "Hanya warna luar",
              body: "Warna bisa bermakna, tetapi bukan alasan strukturalnya.",
              correct: false,
            },
            {
              id: "room-count",
              title: "Ruangan otomatis lebih banyak",
              body: "Tinggi lantai tidak otomatis menambah jumlah ruang.",
              correct: false,
            },
          ],
          insight:
            "Lantai panggung mendukung respons iklim dengan memisahkan aktivitas harian dari panas, lembap, dan kondisi tanah.",
        },
        climate: {
          label: "Iklim",
          title: "Dari mana kenyamanan muncul?",
          body:
            "Prediksi bagaimana naungan dan udara bekerja bersama sebelum melihat lapisan termal.",
          question: "Kombinasi mana yang paling mendukung interior nyaman?",
          modeHint: "Adegan AR akan dibuka di mode Iklim.",
          choices: [
            {
              id: "shade-airflow",
              title: "Naungan dan udara bergerak",
              body: "Interior terbantu oleh perlindungan sekaligus ventilasi.",
              correct: true,
            },
            {
              id: "direct-sun",
              title: "Lebih banyak matahari langsung",
              body: "Matahari langsung dapat menambah panas di ruang hidup.",
              correct: false,
            },
            {
              id: "sealed-room",
              title: "Ruang tertutup tanpa bukaan",
              body: "Ruang tertutup membatasi gerak udara alami.",
              correct: false,
            },
          ],
          insight:
            "Kenyamanan bukan berasal dari satu fitur. Naungan, elevasi, dan udara bergerak bekerja bersama sebagai pengetahuan lingkungan.",
        },
      },
    },
    xray: {
      menu: "Layer budaya",
      eyebrow: "X-RAY LAYER BUDAYA",
      title: "Lihat rumah dalam beberapa lapisan.",
      body:
        "Berpindah dari arsitektur ke udara, iklim, kehidupan harian, dan kearifan lokal tanpa meninggalkan AR.",
      auto: "Reveal sinematik",
      layers: {
        normal: {
          label: "Normal",
          title: "Rumah Lontiok sebagai kesatuan",
          body: "Rumah tampil sebagai objek budaya dan lingkungan yang utuh.",
        },
        architecture: {
          label: "Arsitektur",
          title: "Struktur kayu",
          body: "Tampilan x-ray memperlihatkan atap, dinding, lantai panggung, dan tiang sebagai satu sistem.",
        },
        airflow: {
          label: "Udara",
          title: "Bagaimana rumah bernapas",
          body: "Bukaan mengarahkan udara melalui interior sebagai jalur ventilasi konseptual.",
        },
        climate: {
          label: "Iklim",
          title: "Naungan dan kenyamanan",
          body: "Lapisan termal halus menunjukkan bagaimana naungan, elevasi, dan udara mendukung kenyamanan.",
        },
        dailyLife: {
          label: "Keseharian",
          title: "Arsitektur untuk hidup sehari-hari",
          body: "Ruang hidup panggung mendukung berkumpul, beristirahat, dan bergerak setiap hari.",
        },
        wisdom: {
          label: "Kearifan",
          title: "Pengetahuan yang menjadi bentuk",
          body: "Budaya, iklim, dan keterampilan menyatu dalam rancangan rumah.",
        },
      },
      annotations: {
        architecture: ["Rangka atap", "Lantai kayu panggung", "Tiang fondasi"],
        airflow: ["Bukaan masuk", "Ventilasi silang", "Jalur keluar"],
        climate: ["Naungan dalam", "Interior lebih sejuk", "Paparan atap"],
        dailyLife: ["Ruang berkumpul", "Ambang masuk", "Sirkulasi harian"],
        wisdom: ["Pengetahuan kriya", "Respons iklim", "Identitas budaya"],
      },
    },
    causeEffect: {
      menu: "Sebab akibat",
      eyebrow: "LAB SEBAB AKIBAT",
      title: "Ubah satu elemen. Lihat rumah merespons.",
      body:
        "Kontrol ini adalah alat belajar konseptual, bukan hasil simulasi fisik.",
      openings: "Bukaan",
      floorHeight: "Tinggi lantai",
      roofShade: "Naungan atap",
      low: "Rendah",
      medium: "Sedang",
      wide: "Lebar",
      raised: "Panggung",
      short: "Pendek",
      deep: "Dalam",
      feedback: {
        openings:
          "Bukaan lebih lebar memperkuat jalur aliran udara yang terlihat melalui ruang.",
        floorHeight:
          "Lantai panggung memisahkan aktivitas harian dari kelembapan tanah dan memberi ruang udara di bawah.",
        roofShade:
          "Naungan lebih dalam menurunkan lapisan panas ilustratif pada ruang hidup.",
      },
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
      startScan: "Mulai scan",
      changePath: "Ganti jalur",
      pathTitle: "Jalur belajar dipilih",
      pathBody: "Saat siap, temukan gambar Rumah Lontiok.",
    },
    target: {
      mode: "Mode target",
      simulated: "Simulasi",
      real: "Target riil",
      simulatedBody: "Terdeteksi otomatis setelah jeda singkat untuk presentasi.",
      realBody: "Gunakan target image di layar lain atau halaman cetak.",
      openTarget: "Buka target image",
      realNote:
        "Tracking riil siap dihubungkan ke MindAR setelah assets/targets/rumah-lontiok.mind dikompilasi.",
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
      home: "Home",
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
      quiz: {
        index: "05",
        label: "Kuis",
        title: "KUIS",
        body: "Uji apa yang sudah Anda temukan di seluruh layer AR.",
      },
    },
    quiz: {
      eyebrow: "KUIS INTERAKTIF",
      title: "Mainkan cek pemahaman.",
      body: "Jawab soal tentang struktur, aliran udara, iklim, dan kearifan lokal.",
      shuffleNote: "{count} soal acak diambil dari bank {total} soal.",
      progress: "Pertanyaan",
      correct: "Tepat",
      incorrect: "Tinjau kembali ide ini",
      timeUp: "Waktu habis",
      timer: "Timer",
      points: "poin",
      submit: "Kunci jawaban",
      selectOne: "Pilih satu jawaban.",
      selectMultiple: "Jawaban benar lebih dari satu.",
      continue: "Lanjut",
      finish: "Selesaikan kuis",
      restart: "Ulangi kuis",
      score: "Skor",
      correctAnswers: "Jawaban benar",
      grade: "Nilai",
      gradeScale: "Skala 0-100",
      accuracy: "akurasi",
      answerReview: "Review jawaban",
      reviewCorrect: "Benar",
      reviewIncorrect: "Perlu review",
      resultStrong: "Bagus. Anda berhasil merangkai struktur, aliran udara, iklim, dan kearifan lokal jadi satu gambaran.",
      resultGood: "Progres sudah baik. Beberapa konsep masih perlu ditinjau agar pemahaman lebih utuh.",
      resultRetry: "Tinjau kembali lapisan AR, lalu coba lagi: setiap percobaan mengambil set soal yang baru.",
      back: "Kembali",
      completeTitle: "Hasil quiz",
      completeBody:
        "Skor Anda merangkum seberapa baik petunjuk terhubung dengan konsep belajar.",
      types: {
        single: "Pilihan ganda",
        picture: "Pilihan bergambar",
        trueFalse: "Benar / Salah",
        multi: "Jawaban lebih dari 1",
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
      summaryTitle: "Ringkasan Belajar",
      summary: {
        discovered: {
          title: "Yang saya temukan",
          body:
            "Rumah Lontiok adalah rumah budaya sekaligus sistem pembelajaran lingkungan.",
        },
        architecture: {
          title: "Pelajaran arsitektur",
          body:
            "Struktur, elevasi, dan naungan dirakit untuk merespons tempat.",
        },
        science: {
          title: "Pelajaran sains",
          body:
            "Gerak udara dan kenyamanan panas dapat dipahami melalui sebab akibat yang terlihat.",
        },
        wisdom: {
          title: "Kearifan budaya",
          body:
            "Pengetahuan lokal mengubah respons iklim menjadi bentuk arsitektur yang bermakna.",
        },
      },
    },
    audio: {
      narration: "Narasi",
      listen: "Dengarkan",
    },
    share: {
      title: "Belajar Rumah Lontiok AR",
      message:
        "Ayo belajar Rumah Lontiok melalui pengalaman AR interaktif tentang arsitektur, aliran udara, iklim, dan kearifan lokal Kampar.",
      cta: "Bagikan",
      heading: "Bagikan Rumah Lontiok AR",
      body: "Ajak teman belajar arsitektur, sains, dan kearifan lokal dalam satu pengalaman interaktif.",
      native: "Bagikan dari perangkat",
      whatsapp: "WhatsApp",
      facebook: "Facebook",
      x: "X",
      telegram: "Telegram",
      copy: "Salin tautan",
      copied: "Tautan disalin",
      close: "Tutup",
      previewNote:
        "Thumbnail akan muncul di WhatsApp atau media sosial setelah halaman ini memakai URL publik.",
    },
    language: {
      label: "Bahasa",
    },
  },
};

const localizationOverrides = {
  ko: {
    opening: {
      eyebrow: "건축 / 과학",
      subtitle: "캄파르의 살아 있는 건축",
      description:
        "전통 건축이 기후, 공기의 흐름, 일상생활에 어떻게 반응하는지 살펴보세요.",
      begin: "경험 시작",
      meta: "AR / 건축 / 과학 / 지역 지혜",
      nextHint: "집, 기후, 문화가 만나는 공간 학습 경험입니다.",
    },
    paths: {
      eyebrow: "학습 경로 선택",
      title: "목적을 가지고 시작하세요.",
      body: "카메라를 열기 전에 Rumah Lontiok을 만나는 방식을 선택하세요.",
      back: "뒤로",
      items: {
        explore: {
          label: "AR 탐색",
          title: "집을 자유롭게 둘러보세요.",
          body: "AR 장면을 열고 조용한 핫스팟으로 문화적 디테일을 발견합니다.",
          action: "탐색 시작",
        },
        guided: {
          label: "가이드 수업",
          title: "약 3분의 집중 스토리를 따라가세요.",
          body:
            "형태, 공기 흐름, 기후, 지역 지혜를 단계적으로 연결합니다.",
          action: "수업 시작",
        },
        lab: {
          label: "인터랙티브 랩",
          title: "먼저 예측해 보세요.",
          body:
            "과학 미션을 고르고 짧은 질문에 답한 뒤 AR에서 확인합니다.",
          action: "랩 열기",
        },
      },
    },
    lab: {
      eyebrow: "인터랙티브 랩",
      title: "탐구할 질문을 선택하세요.",
      body:
        "짧은 예측은 스캔 전에 AR 경험에 학습 목표를 만들어 줍니다.",
      missionsTitle: "미션",
      startAr: "AR로 계속",
      changePath: "경로 변경",
      correct: "좋은 예측입니다.",
      incorrect: "다른 예측을 선택해 보세요.",
      feedbackIntro: "학습 노트",
      missions: {
        air: {
          label: "공기 흐름",
          title: "공기는 집 안에서 어떻게 움직일까요?",
          body:
            "공기 흐름을 보기 전에 어떤 건축 요소가 공간을 숨 쉬게 하는지 예측해 보세요.",
          question: "교차 환기에 가장 도움이 되는 요소는 무엇일까요?",
          modeHint: "AR 장면은 공기 모드로 열립니다.",
          choices: [
            {
              id: "opposite-openings",
              title: "서로 마주 보는 개구부",
              body: "공기가 서로 다른 쪽으로 들어오고 나갈 수 있습니다.",
              correct: true,
            },
            {
              id: "closed-wall",
              title: "완전히 닫힌 벽",
              body: "공기의 움직임을 이끌기보다 막습니다.",
              correct: false,
            },
            {
              id: "low-floor",
              title: "땅에 바로 닿은 바닥",
              body: "같은 방식의 공기 흐름 기회를 만들지 못합니다.",
              correct: false,
            },
          ],
          insight:
            "둘 이상의 면에 열린 부분이 있으면 공기가 내부를 가로질러 지나갈 수 있습니다.",
        },
        structure: {
          label: "구조",
          title: "왜 집은 땅에서 들어 올려져 있을까요?",
          body:
            "집의 부재를 분리해 보기 전에 높은 바닥의 의미를 예측해 보세요.",
          question: "높은 바닥은 집이 무엇에 대응하도록 도울까요?",
          modeHint: "AR 장면은 구조 모드로 열립니다.",
          choices: [
            {
              id: "ground-moisture",
              title: "지면 습기와 아래쪽 공기 흐름",
              body: "높이는 생활 공간을 습한 지면과 분리합니다.",
              correct: true,
            },
            {
              id: "paint-color",
              title: "외부 색상만",
              body: "색에는 의미가 있을 수 있지만 구조적 이유는 아닙니다.",
              correct: false,
            },
            {
              id: "room-count",
              title: "방이 자동으로 늘어남",
              body: "바닥 높이만으로 방의 수가 늘어나지는 않습니다.",
              correct: false,
            },
          ],
          insight:
            "높은 바닥은 열, 습기, 지면 조건으로부터 일상생활을 분리해 기후 대응을 돕습니다.",
        },
        climate: {
          label: "기후",
          title: "쾌적함은 어디에서 올까요?",
          body:
            "열 시각화를 보기 전에 그늘과 공기 흐름이 어떻게 함께 작동하는지 예측해 보세요.",
          question: "쾌적한 내부를 가장 잘 돕는 조합은 무엇일까요?",
          modeHint: "AR 장면은 기후 모드로 열립니다.",
          choices: [
            {
              id: "shade-airflow",
              title: "그늘과 움직이는 공기",
              body: "내부는 보호와 환기의 도움을 함께 받습니다.",
              correct: true,
            },
            {
              id: "direct-sun",
              title: "더 많은 직사광선",
              body: "직사광선은 생활 공간의 열을 높일 수 있습니다.",
              correct: false,
            },
            {
              id: "sealed-room",
              title: "개구부 없는 밀폐된 방",
              body: "밀폐된 방은 자연스러운 공기 이동을 제한합니다.",
              correct: false,
            },
          ],
          insight:
            "쾌적함은 하나의 요소가 아니라 그늘, 높이, 움직이는 공기가 함께 만드는 환경 지식입니다.",
        },
      },
    },
    loading: {
      subtitle: "경험을 준비하는 중",
      tasks: ["모델 불러오기", "AR 타깃 불러오기", "오디오 준비"],
    },
    onboarding: {
      title: "카메라를 Rumah Lontiok 이미지에 맞추세요.",
      findTitle: "이미지 찾기",
      findBody: "디지털 책 안에서",
      searching: "검색 중...",
      free: "자유 탐색",
      guided: "가이드 투어",
      guidedTime: "약 3분",
      startScan: "스캔 시작",
      changePath: "경로 변경",
      pathTitle: "선택된 학습 경로",
      pathBody: "준비가 되면 Rumah Lontiok 이미지를 찾으세요.",
    },
    error: {
      cameraTitle: "카메라 접근이 필요합니다",
      cameraBody:
        "AR로 Rumah Lontiok을 경험하려면 브라우저에서 카메라 접근을 허용하세요.",
      targetTitle: "AR 타깃을 사용할 수 없습니다",
      targetBody: "추적 이미지를 불러올 수 없습니다.",
      retry: "다시 시도",
      preview: "카메라 없이 미리보기",
    },
    hud: {
      place: "캄파르 / 리아우",
      language: "언어",
      soundOn: "소리 켜짐",
      soundOff: "소리 꺼짐",
      more: "더보기",
      reset: "경험 재설정",
      guided: "가이드 투어",
      imageLost: "이미지 분실 시뮬레이션",
      targetFound: "타깃 발견",
      targetLost: "이미지를 잃었습니다",
      targetLostBody: "카메라를 다시 페이지로 향하게 하세요.",
      dismiss: "닫기",
    },
    modes: {
      discover: {
        index: "01",
        label: "발견",
        title: "발견",
        body: "살아 있는 지점을 터치해 집에서 배우세요.",
      },
      structure: {
        index: "02",
        label: "구조",
        title: "구조",
        body: "집이 어떻게 조립되는지 이해합니다.",
      },
      air: {
        index: "03",
        label: "공기",
        title: "공기",
        body: "이 집은 어떻게 숨을 쉴까요?",
      },
      climate: {
        index: "04",
        label: "기후",
        title: "기후",
        body: "형태, 그늘, 공기 흐름이 쾌적함을 어떻게 돕는지 봅니다.",
      },
    },
    hotspots: {
      window: {
        title: "창 개구부",
        eyebrow: "자연 환기",
        storyTitle: "건축을 통해 숨 쉬기",
        body:
          "개구부는 공기가 공간을 가로질러 움직이도록 하며 자연 환기를 돕습니다.",
        listen: "듣기",
        explore: "공기 흐름 탐색",
      },
      raisedFloor: {
        title: "높은 바닥",
        eyebrow: "기후와 함께 사는 방식",
        storyTitle: "집 아래의 공간",
        body:
          "높은 바닥은 생활 공간을 습한 지면에서 분리하고 아래쪽 공기 흐름을 만듭니다.",
        listen: "듣기",
        explore: "구조 탐색",
      },
      roof: {
        title: "곡선 지붕",
        eyebrow: "문화적 정체성",
        storyTitle: "의미가 담긴 형태",
        body:
          "지붕의 윤곽은 집의 정체성을 만들고 내부에 그늘을 제공합니다.",
        listen: "듣기",
        explore: "기후 보기",
      },
    },
    structure: {
      assembly: "조립",
      whole: "전체",
      exploded: "분리",
      labels: {
        roof: "지붕 구조",
        frontWall: "생활 공간",
        sideWalls: "벽 패널",
        floor: "높은 바닥",
        foundation: "기초",
      },
      parts: {
        roof: {
          title: "지붕 구조",
          body: "지붕은 그늘을 만들고 집에 표현적인 실루엣을 제공합니다.",
        },
        frontWall: {
          title: "생활 공간",
          body: "중앙 공간은 일상생활, 모임, 공기 흐름을 위해 구성됩니다.",
        },
        sideWalls: {
          title: "벽 패널",
          body: "벽 패널은 공간을 정의하고 개구부는 내부가 숨 쉬도록 돕습니다.",
        },
        floor: {
          title: "높은 바닥",
          body: "들린 바닥은 집을 지면의 습기와 열로부터 분리합니다.",
        },
        foundation: {
          title: "기초",
          body: "기둥은 구조를 들어 올려 집이 환경에 반응하도록 합니다.",
        },
      },
    },
    airflow: {
      start: "공기 흐름 시작",
      caption: "개념적 공기 흐름 시각화",
      stages: [
        { index: "01", title: "공기가 개구부로 들어옵니다." },
        { index: "02", title: "교차 환기가 내부를 가로질러 공기를 움직입니다." },
        { index: "03", title: "따뜻한 공기가 점차 교체됩니다." },
      ],
    },
    climate: {
      legendCool: "더 시원함",
      legendWarm: "더 따뜻함",
      disclaimer: "열 시각화는 설명용이며 실제 온도 측정이 아닙니다.",
      hotspots: {
        crossVentilation: {
          title: "교차 환기",
          body: "교차 환기는 더 쾌적한 실내 환경을 도울 수 있습니다.",
        },
        shadedInterior: {
          title: "그늘진 내부",
          body: "깊은 그늘은 생활 공간 안의 직접적인 햇빛 노출을 줄입니다.",
        },
        roofExposure: {
          title: "지붕 노출",
          body: "지붕이 먼저 열을 받는 동안 내부는 시각적으로 보호됩니다.",
        },
      },
    },
    guided: {
      progress: "가이드 경험",
      previous: "이전",
      continue: "계속",
      steps: [
        {
          title: "Rumah Lontiok 만나기",
          body: "집을 단순한 건물이 아니라 문화적 대상으로 바라봅니다.",
        },
        {
          title: "안쪽 들여다보기",
          body: "주요 부재를 분리해 구조가 어떻게 조립되는지 이해합니다.",
        },
        {
          title: "공기가 들어오는 방식",
          body: "개구부는 외부 공기를 높은 목조 생활 공간으로 들입니다.",
        },
        {
          title: "공기가 움직이는 방식",
          body: "공기는 내부를 지나 다른 개구부로 빠져나갑니다.",
        },
        {
          title: "건축과 쾌적함",
          body: "그늘, 환기, 높이는 환경 지식으로 함께 작동합니다.",
        },
        {
          title: "지역 지혜",
          body:
            "세대를 거친 지역 지식은 문화, 기후, 일상생활에 반응하는 집을 만들었습니다.",
        },
      ],
    },
    closing: {
      eyebrow: "지역 지혜",
      title: "건축은 형태 그 이상입니다.",
      body:
        "Rumah Lontiok은 세대를 거친 지역 지식이 문화, 기후, 일상생활에 반응하는 집을 어떻게 만들었는지 보여줍니다.",
      exploreAgain: "다시 탐색",
      learnMore: "더 알아보기",
    },
    audio: {
      narration: "내레이션",
      listen: "듣기",
    },
    language: {
      label: "언어",
    },
  },
  "zh-TW": {
    opening: {
      eyebrow: "建築 / 科學",
      subtitle: "來自甘巴爾的生活建築",
      description:
        "探索傳統建築如何回應氣候、空氣流動與日常生活。",
      begin: "開始體驗",
      meta: "AR / 建築 / 科學 / 在地智慧",
      nextHint: "關於住宅、氣候與文化的空間學習體驗。",
    },
    paths: {
      eyebrow: "選擇學習路徑",
      title: "帶著目的開始。",
      body: "在開啟相機之前，選擇你想認識 Rumah Lontiok 的方式。",
      back: "返回",
      items: {
        explore: {
          label: "AR 探索",
          title: "自由走進這座房子。",
          body: "開啟 AR 場景，透過安靜的熱點發現文化細節。",
          action: "開始探索",
        },
        guided: {
          label: "引導課程",
          title: "跟隨約 3 分鐘的聚焦故事。",
          body:
            "循序連結形式、空氣流動、氣候與在地智慧。",
          action: "開始課程",
        },
        lab: {
          label: "互動實驗室",
          title: "先做一個預測。",
          body:
            "選擇科學任務，回答短題，再到 AR 中驗證想法。",
          action: "開啟實驗室",
        },
      },
    },
    lab: {
      eyebrow: "互動實驗室",
      title: "選擇要探究的問題。",
      body:
        "短暫的預測能在掃描前，為 AR 體驗建立清楚的學習目標。",
      missionsTitle: "任務",
      startAr: "繼續前往 AR",
      changePath: "更換路徑",
      correct: "很好的預測。",
      incorrect: "試試另一個預測。",
      feedbackIntro: "學習筆記",
      missions: {
        air: {
          label: "空氣流動",
          title: "空氣如何穿過這座房子？",
          body:
            "在觀看氣流之前，先預測哪個建築元素幫助空間呼吸。",
          question: "哪項特徵最能支持交叉通風？",
          modeHint: "AR 場景將以空氣模式開啟。",
          choices: [
            {
              id: "opposite-openings",
              title: "相對兩側的開口",
              body: "空氣可以從不同側進入與離開。",
              correct: true,
            },
            {
              id: "closed-wall",
              title: "完全封閉的牆",
              body: "這會阻擋空氣，而不是引導空氣。",
              correct: false,
            },
            {
              id: "low-floor",
              title: "直接貼地的地板",
              body: "這不會創造同樣的空氣流動機會。",
              correct: false,
            },
          ],
          insight:
            "不只一側有開口時，空氣能穿越室內，而不是停留在其中。",
        },
        structure: {
          label: "結構",
          title: "為什麼房子要被抬離地面？",
          body:
            "在拆解房屋結構之前，先預測高架地板的價值。",
          question: "高架地板幫助房子回應什麼？",
          modeHint: "AR 場景將以結構模式開啟。",
          choices: [
            {
              id: "ground-moisture",
              title: "地面濕氣與下方空氣流動",
              body: "抬高能讓生活空間遠離潮濕地面。",
              correct: true,
            },
            {
              id: "paint-color",
              title: "只有外觀顏色",
              body: "顏色可以有意義，但不是結構原因。",
              correct: false,
            },
            {
              id: "room-count",
              title: "房間自動變多",
              body: "地板高度本身不會自動增加房間數量。",
              correct: false,
            },
          ],
          insight:
            "高架地板透過分離日常生活與熱、濕氣、地面條件，支持氣候回應。",
        },
        climate: {
          label: "氣候",
          title: "舒適感從何而來？",
          body:
            "在觀看熱感視覺層之前，先預測遮蔭與氣流如何共同作用。",
          question: "哪個組合最能支持舒適的室內環境？",
          modeHint: "AR 場景將以氣候模式開啟。",
          choices: [
            {
              id: "shade-airflow",
              title: "遮蔭加上流動空氣",
              body: "室內同時受益於保護與通風。",
              correct: true,
            },
            {
              id: "direct-sun",
              title: "更多直射陽光進入室內",
              body: "直射陽光可能增加生活空間的熱量。",
              correct: false,
            },
            {
              id: "sealed-room",
              title: "沒有開口的密閉房間",
              body: "密閉空間限制自然空氣流動。",
              correct: false,
            },
          ],
          insight:
            "舒適不是單一特徵造成的，而是遮蔭、抬高與流動空氣共同形成的環境知識。",
        },
      },
    },
    loading: {
      subtitle: "正在準備體驗",
      tasks: ["載入模型", "載入 AR 目標", "準備音訊"],
    },
    onboarding: {
      title: "請將相機對準 Rumah Lontiok 圖片。",
      findTitle: "尋找圖片",
      findBody: "在你的數位書中",
      searching: "搜尋中...",
      free: "自由探索",
      guided: "進行引導導覽",
      guidedTime: "約 3 分鐘",
      startScan: "開始掃描",
      changePath: "更換路徑",
      pathTitle: "已選擇學習路徑",
      pathBody: "準備好後，尋找 Rumah Lontiok 圖片。",
    },
    error: {
      cameraTitle: "需要相機權限",
      cameraBody:
        "若要以 AR 體驗 Rumah Lontiok，請在瀏覽器中允許相機權限。",
      targetTitle: "AR 目標無法使用",
      targetBody: "無法載入追蹤圖片。",
      retry: "再試一次",
      preview: "不用相機預覽",
    },
    hud: {
      place: "甘巴爾 / 廖內",
      language: "語言",
      soundOn: "聲音開啟",
      soundOff: "聲音關閉",
      more: "更多",
      reset: "重置體驗",
      guided: "引導導覽",
      imageLost: "模擬圖片遺失",
      targetFound: "找到目標",
      targetLost: "圖片遺失",
      targetLostBody: "請將相機重新對準頁面。",
      dismiss: "關閉",
    },
    modes: {
      discover: {
        index: "01",
        label: "探索",
        title: "探索",
        body: "觸碰動態點位，從這座房子中學習。",
      },
      structure: {
        index: "02",
        label: "結構",
        title: "結構",
        body: "理解這座房子如何被組裝。",
      },
      air: {
        index: "03",
        label: "空氣",
        title: "空氣",
        body: "這座房子如何呼吸？",
      },
      climate: {
        index: "04",
        label: "氣候",
        title: "氣候",
        body: "觀察形式、遮蔭與空氣如何支持舒適。",
      },
    },
    hotspots: {
      window: {
        title: "窗戶開口",
        eyebrow: "自然通風",
        storyTitle: "透過建築呼吸",
        body:
          "開口讓空氣穿越空間，並支持自然通風。",
        listen: "聆聽",
        explore: "探索氣流",
      },
      raisedFloor: {
        title: "高架地板",
        eyebrow: "與氣候共處",
        storyTitle: "房子下方的空間",
        body:
          "高架地板讓生活空間遠離潮濕地面，也讓空氣在下方移動。",
        listen: "聆聽",
        explore: "探索結構",
      },
      roof: {
        title: "弧形屋頂",
        eyebrow: "文化身份",
        storyTitle: "由意義塑造的形式",
        body:
          "屋頂輪廓賦予房子身份，同時幫助室內遮蔭。",
        listen: "聆聽",
        explore: "觀看氣候",
      },
    },
    structure: {
      assembly: "組裝",
      whole: "完整",
      exploded: "拆解",
      labels: {
        roof: "屋頂結構",
        frontWall: "生活空間",
        sideWalls: "牆板",
        floor: "高架地板",
        foundation: "基礎",
      },
      parts: {
        roof: {
          title: "屋頂結構",
          body: "屋頂創造遮蔭，也賦予房子富有表情的輪廓。",
        },
        frontWall: {
          title: "生活空間",
          body: "中央空間為日常生活、聚會與空氣流動而組織。",
        },
        sideWalls: {
          title: "牆板",
          body: "牆板定義室內空間，而開口讓內部保持可呼吸。",
        },
        floor: {
          title: "高架地板",
          body: "抬高的地板讓家與地面濕氣和熱量分離。",
        },
        foundation: {
          title: "基礎",
          body: "柱子抬起結構，使房子能回應周圍環境。",
        },
      },
    },
    airflow: {
      start: "開始氣流",
      caption: "概念性氣流視覺化",
      stages: [
        { index: "01", title: "空氣從開口進入。" },
        { index: "02", title: "交叉通風讓空氣穿過室內。" },
        { index: "03", title: "溫暖空氣逐漸被替換。" },
      ],
    },
    climate: {
      legendCool: "較涼",
      legendWarm: "較暖",
      disclaimer: "熱感視覺化僅供說明，並非實際溫度測量。",
      hotspots: {
        crossVentilation: {
          title: "交叉通風",
          body: "交叉通風能支持更舒適的室內環境。",
        },
        shadedInterior: {
          title: "遮蔭室內",
          body: "深遮蔭有助於減少生活空間中的直接日照。",
        },
        roofExposure: {
          title: "屋頂受熱",
          body: "屋頂最先承受熱量，而室內在視覺上仍受到保護。",
        },
      },
    },
    guided: {
      progress: "引導體驗",
      previous: "上一步",
      continue: "繼續",
      steps: [
        {
          title: "認識 Rumah Lontiok",
          body: "從文化物件的角度開始，而不只是建築形式。",
        },
        {
          title: "向內觀看",
          body: "分離主要部件，理解結構如何組裝。",
        },
        {
          title: "空氣如何進入",
          body: "開口邀請外部空氣進入高架木造生活空間。",
        },
        {
          title: "空氣如何移動",
          body: "空氣穿過室內，並從另一個開口離開。",
        },
        {
          title: "建築與舒適",
          body: "遮蔭、通風與抬高共同形成環境知識。",
        },
        {
          title: "在地智慧",
          body:
            "世代累積的在地知識塑造出回應文化、氣候與日常生活的家。",
        },
      ],
    },
    closing: {
      eyebrow: "在地智慧",
      title: "建築不只是形式。",
      body:
        "Rumah Lontiok 展示了世代累積的在地知識如何塑造一座回應文化、氣候與日常生活的家。",
      exploreAgain: "再次探索",
      learnMore: "了解更多",
    },
    audio: {
      narration: "旁白",
      listen: "聆聽",
    },
    language: {
      label: "語言",
    },
  },
};

Object.entries(localizationOverrides).forEach(([language, overrides]) => {
  dictionary[language] = mergeDeep(dictionary.en, overrides);
});

function mergeDeep(base, overrides) {
  if (Array.isArray(overrides)) {
    return overrides.map((item) =>
      item && typeof item === "object" ? mergeDeep({}, item) : item,
    );
  }

  if (overrides && typeof overrides === "object") {
    const result = { ...base };
    Object.entries(overrides).forEach(([key, value]) => {
      result[key] = mergeDeep(base?.[key], value);
    });
    return result;
  }

  return overrides ?? base;
}

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
