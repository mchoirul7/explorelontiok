/**
 * Quiz question bank for Rumah Lontiok AR.
 *
 * The bank holds every question in one place (bilingual: en + id, other
 * languages fall back to en, matching the dictionary merge in localization.js).
 * Each attempt draws a random subset so the quiz feels different every replay.
 *
 * Not every question is picture based: `visual` is optional on both the
 * question and its choices, and the UI renders a text-only layout when it is
 * missing.
 */

export const QUIZ_QUESTION_COUNT = 7;

const tx = (en, id) => ({ en, id });
const c = (en, id, correct = false, visual = "") => ({ label: tx(en, id), correct, visual });

const BANK = [
  /* ---------------------------------------------------------------- structure */
  {
    id: "stilt-purpose",
    type: "single",
    time: 25,
    prompt: tx(
      "Why is Rumah Lontiok built on tall posts?",
      "Mengapa Rumah Lontiok dibangun di atas tiang tinggi?",
    ),
    feedback: tx(
      "Elevation keeps the living floor away from damp soil and rising water while letting air move underneath.",
      "Elevasi menjauhkan lantai hunian dari tanah lembap dan air yang naik, sekaligus membiarkan udara bergerak di bawahnya.",
    ),
    choices: [
      c(
        "To keep the floor away from damp ground and floodwater",
        "Agar lantai terhindar dari tanah lembap dan air banjir",
        true,
      ),
      c("To make the house look taller than its neighbours", "Agar rumah terlihat lebih tinggi dari tetangga"),
      c("To reduce the amount of timber needed", "Agar kebutuhan kayu menjadi lebih sedikit"),
      c("To block wind from entering the house", "Agar angin tidak bisa masuk ke rumah"),
    ],
  },
  {
    id: "joint-system",
    type: "single",
    time: 25,
    prompt: tx(
      "How are the main timber members of a traditional Malay house usually connected?",
      "Bagaimana batang kayu utama rumah tradisional Melayu biasanya disambung?",
    ),
    hint: tx("Think about repair and replacement.", "Pikirkan soal perbaikan dan penggantian."),
    feedback: tx(
      "Interlocking joints with timber pegs let members be taken apart, repaired, and replaced without destroying the frame.",
      "Sambungan takik dengan pasak kayu memungkinkan batang dibongkar, diperbaiki, dan diganti tanpa merusak rangka.",
    ),
    choices: [
      c("Interlocking joints held by timber pegs", "Sambungan takik yang dikunci pasak kayu", true),
      c("Poured concrete around every joint", "Cor beton di setiap titik sambungan"),
      c("Steel plates bolted on both sides", "Pelat baja yang dibaut di kedua sisi"),
      c("Rope wrapped around the columns", "Tali yang dililitkan pada kolom"),
    ],
  },
  {
    id: "tf-nails",
    type: "trueFalse",
    time: 20,
    prompt: tx(
      "True or false: a peg-and-joint timber frame can be dismantled and reassembled.",
      "Benar atau salah: rangka kayu berpasak dapat dibongkar dan dipasang kembali.",
    ),
    feedback: tx(
      "True. Because the frame is joined rather than glued or cast, damaged members can be swapped out one by one.",
      "Benar. Karena rangka disambung, bukan dilem atau dicor, batang yang rusak bisa diganti satu per satu.",
    ),
    choices: [c("True", "Benar", true), c("False", "Salah")],
  },
  {
    id: "load-path",
    type: "single",
    time: 25,
    prompt: tx(
      "Which path do the loads of the house follow down to the ground?",
      "Beban rumah mengalir ke tanah melalui jalur yang mana?",
    ),
    feedback: tx(
      "Roof to beams, beams to posts, posts to footing: a clear vertical path is what keeps the frame stable.",
      "Atap ke balok, balok ke tiang, tiang ke pondasi: jalur vertikal yang jelas inilah yang menjaga rangka tetap stabil.",
    ),
    choices: [
      c("Roof → beams → posts → footing", "Atap → balok → tiang → pondasi", true),
      c("Roof → wall panels → floor boards", "Atap → panel dinding → papan lantai"),
      c("Ornament → roof → ground", "Ornamen → atap → tanah"),
      c("Floor → roof → posts", "Lantai → atap → tiang"),
    ],
  },
  {
    id: "footing-stone",
    type: "single",
    time: 25,
    prompt: tx(
      "Why do the posts often rest on stone or hardwood footings instead of being buried in soil?",
      "Mengapa tiang sering berdiri di atas batu atau kayu keras, bukan ditanam dalam tanah?",
    ),
    feedback: tx(
      "Keeping timber off wet soil slows decay and termite attack, so the structure lasts much longer.",
      "Menjauhkan kayu dari tanah basah memperlambat pelapukan dan serangan rayap sehingga struktur jauh lebih awet.",
    ),
    choices: [
      c("It keeps the timber dry and slows decay", "Agar kayu tetap kering dan lambat lapuk", true),
      c("It makes the house heavier", "Agar rumah menjadi lebih berat"),
      c("It is only a decorative detail", "Karena hanya detail hiasan semata"),
      c("It stops air from moving under the house", "Agar udara tidak bergerak di bawah rumah"),
    ],
  },
  {
    id: "boat-form",
    type: "single",
    time: 25,
    prompt: tx(
      "The silhouette of Rumah Lontiok is often compared to which object?",
      "Siluet Rumah Lontiok sering dibandingkan dengan benda apa?",
    ),
    hint: tx("Kampar life grew along the river.", "Kehidupan Kampar tumbuh di sepanjang sungai."),
    feedback: tx(
      "The upswept ridge reads like a boat, echoing a community whose life and trade followed the river.",
      "Bubungan yang melengkung ke atas terbaca seperti perahu, menggemakan masyarakat yang hidup dan berniaga lewat sungai.",
    ),
    choices: [
      c("A boat", "Perahu", true),
      c("A wheel", "Roda"),
      c("A ladder", "Tangga"),
      c("A drum", "Gendang"),
    ],
  },
  {
    id: "multi-structure-parts",
    type: "multi",
    time: 35,
    prompt: tx(
      "Select every part that belongs to the load-bearing structure.",
      "Pilih semua bagian yang termasuk struktur pemikul beban.",
    ),
    feedback: tx(
      "Posts, beams, and the roof frame carry load. Carvings and curtains are finishes, not structure.",
      "Tiang, balok, dan rangka atap memikul beban. Ukiran dan tirai adalah elemen akhir, bukan struktur.",
    ),
    choices: [
      c("Timber posts", "Tiang kayu", true),
      c("Main beams", "Balok induk", true),
      c("Roof frame", "Rangka atap", true),
      c("Wall carvings", "Ukiran dinding"),
    ],
  },
  {
    id: "gotong-royong",
    type: "single",
    time: 25,
    prompt: tx(
      "Traditionally, who raises the frame of the house on building day?",
      "Secara tradisional, siapa yang mendirikan rangka rumah pada hari pembangunan?",
    ),
    feedback: tx(
      "Neighbours work together. Mutual help (gotong royong) turns construction into a shared social event.",
      "Para tetangga bekerja bersama. Gotong royong menjadikan pembangunan sebagai peristiwa sosial bersama.",
    ),
    choices: [
      c("Neighbours working together in mutual help", "Para tetangga yang bergotong royong", true),
      c("A single hired contractor", "Satu kontraktor bayaran"),
      c("Only the youngest family member", "Hanya anggota keluarga termuda"),
      c("Machines brought from the city", "Mesin yang didatangkan dari kota"),
    ],
  },
  {
    id: "tf-frame-movement",
    type: "trueFalse",
    time: 20,
    prompt: tx(
      "True or false: a jointed timber frame is completely rigid and never moves.",
      "Benar atau salah: rangka kayu bersambungan bersifat kaku total dan tidak pernah bergerak.",
    ),
    feedback: tx(
      "False. Timber joints allow small movement, which helps the frame absorb wind and settling instead of cracking.",
      "Salah. Sambungan kayu memungkinkan gerak kecil sehingga rangka menyerap tekanan angin dan penurunan tanah, bukan retak.",
    ),
    choices: [c("True", "Benar"), c("False", "Salah", true)],
  },
  {
    id: "picture-raised-floor",
    type: "picture",
    time: 30,
    visual: "raisedQuestion",
    visualLabel: tx(
      "A Rumah Lontiok section showing the space below the floor.",
      "Potongan Rumah Lontiok yang memperlihatkan ruang di bawah lantai.",
    ),
    prompt: tx(
      "Which picture best represents the raised floor idea?",
      "Gambar mana yang paling mewakili konsep lantai panggung?",
    ),
    hint: tx("Look for the house lifted above the ground.", "Cari rumah yang terangkat dari tanah."),
    feedback: tx(
      "Rumah Lontiok uses elevation to separate daily life from damp ground and to let air move below.",
      "Rumah Lontiok memakai elevasi untuk memisahkan aktivitas harian dari tanah lembap dan memberi ruang udara di bawah.",
    ),
    choices: [
      c("House lifted on posts", "Rumah terangkat di atas tiang", true, "raisedHouse"),
      c("House sitting flat on soil", "Rumah menempel langsung di tanah", false, "groundHouse"),
      c("Closed box without air gap", "Kotak tertutup tanpa celah udara", false, "closedBox"),
      c("Roof only without structure", "Atap saja tanpa struktur", false, "roofOnly"),
    ],
  },

  /* ------------------------------------------------- raised floor & undercroft */
  {
    id: "kolong-function",
    type: "single",
    time: 25,
    prompt: tx(
      "What is the main climatic benefit of the open space under the floor?",
      "Apa manfaat iklim utama dari ruang terbuka di bawah lantai?",
    ),
    feedback: tx(
      "Air moving through the undercroft carries moisture away and keeps the floor cooler and drier.",
      "Udara yang bergerak di kolong membawa pergi kelembapan dan menjaga lantai tetap sejuk dan kering.",
    ),
    choices: [
      c("Air moves under the floor and dries it", "Udara bergerak di bawah lantai dan mengeringkannya", true),
      c("It makes the roof lighter", "Membuat atap menjadi lebih ringan"),
      c("It increases indoor humidity", "Meningkatkan kelembapan dalam ruang"),
      c("It blocks sunlight from the garden", "Menghalangi sinar matahari ke halaman"),
    ],
  },
  {
    id: "multi-kolong-use",
    type: "multi",
    time: 35,
    prompt: tx(
      "Select the everyday uses of the shaded space under the house.",
      "Pilih pemanfaatan sehari-hari dari ruang teduh di bawah rumah.",
    ),
    feedback: tx(
      "The undercroft is a shaded working room: storage, craft work, and shelter for animals or tools.",
      "Kolong adalah ruang kerja yang teduh: penyimpanan, kegiatan kerajinan, serta naungan untuk ternak atau perkakas.",
    ),
    choices: [
      c("Storing tools and harvest", "Menyimpan perkakas dan hasil panen", true),
      c("Working in the shade", "Bekerja di tempat teduh", true),
      c("Sheltering livestock", "Menaungi ternak", true),
      c("Housing the main bedroom", "Menempatkan kamar tidur utama"),
    ],
  },
  {
    id: "tf-floor-damp",
    type: "trueFalse",
    time: 20,
    prompt: tx(
      "True or false: a floor built directly on damp soil stays drier than a raised floor.",
      "Benar atau salah: lantai yang dibangun langsung di tanah lembap lebih kering daripada lantai panggung.",
    ),
    feedback: tx(
      "False. Ground moisture rises into the material, so a raised and ventilated floor stays much drier.",
      "Salah. Kelembapan tanah naik ke dalam material, sehingga lantai panggung yang berventilasi jauh lebih kering.",
    ),
    choices: [c("True", "Benar"), c("False", "Salah", true)],
  },
  {
    id: "picture-ground-house",
    type: "picture",
    time: 30,
    visual: "raisedQuestion",
    visualLabel: tx(
      "Comparing houses that touch the ground and houses on posts.",
      "Perbandingan rumah yang menyentuh tanah dan rumah di atas tiang.",
    ),
    prompt: tx(
      "Which picture is the least suitable for wet, flood-prone ground?",
      "Gambar mana yang paling tidak cocok untuk tanah basah dan rawan banjir?",
    ),
    feedback: tx(
      "A house resting straight on soil takes in moisture and is the first to flood.",
      "Rumah yang bertumpu langsung di tanah menyerap kelembapan dan paling cepat terendam.",
    ),
    choices: [
      c("House sitting flat on soil", "Rumah menempel langsung di tanah", true, "groundHouse"),
      c("House lifted on posts", "Rumah terangkat di atas tiang", false, "raisedHouse"),
      c("House with openings on two sides", "Rumah dengan bukaan di dua sisi", false, "crossOpenings"),
      c("House with deep roof shade", "Rumah dengan naungan atap dalam", false, "deepShade"),
    ],
  },
  {
    id: "steps-odd",
    type: "single",
    time: 25,
    prompt: tx(
      "The entrance stair of a traditional Malay house commonly has how many steps?",
      "Tangga masuk rumah tradisional Melayu umumnya memiliki jumlah anak tangga berapa?",
    ),
    feedback: tx(
      "An odd number of steps is the customary choice, a small rule that carries cultural meaning.",
      "Jumlah anak tangga ganjil adalah pilihan adat, aturan kecil yang membawa makna budaya.",
    ),
    choices: [
      c("An odd number", "Jumlah ganjil", true),
      c("Exactly twelve", "Tepat dua belas"),
      c("An even number, always", "Selalu jumlah genap"),
      c("It must match the number of windows", "Harus sama dengan jumlah jendela"),
    ],
  },
  {
    id: "flood-response",
    type: "single",
    time: 25,
    prompt: tx(
      "During a seasonal flood, how does the raised house protect the family?",
      "Saat banjir musiman, bagaimana rumah panggung melindungi keluarga?",
    ),
    feedback: tx(
      "Water passes under the floor while daily life continues above it, so the house works with the river instead of fighting it.",
      "Air lewat di bawah lantai sementara aktivitas tetap berjalan di atasnya, sehingga rumah bekerja bersama sungai, bukan melawannya.",
    ),
    choices: [
      c("Water passes below while living space stays dry", "Air lewat di bawah sementara ruang hidup tetap kering", true),
      c("The roof is lifted off during the flood", "Atap diangkat selama banjir"),
      c("The walls absorb the floodwater", "Dinding menyerap air banjir"),
      c("The posts are removed to lower the house", "Tiang dicabut agar rumah lebih rendah"),
    ],
  },

  /* --------------------------------------------------------- roof & sun shade */
  {
    id: "lontik-meaning",
    type: "single",
    time: 25,
    prompt: tx(
      "The name Lontiok points to which feature of the house?",
      "Nama Lontiok merujuk pada ciri rumah yang mana?",
    ),
    feedback: tx(
      "Lontiok refers to the curve: the roof ridge sweeps upward at both ends, giving the house its signature line.",
      "Lontiok merujuk pada lengkungan: bubungan atap melentik ke atas di kedua ujung dan memberi rumah garis khasnya.",
    ),
    choices: [
      c("The roof ridge that curves upward at both ends", "Bubungan atap yang melentik ke atas di kedua ujung", true),
      c("The colour of the wall panels", "Warna panel dinding"),
      c("The number of rooms inside", "Jumlah ruang di dalamnya"),
      c("The width of the front door", "Lebar pintu depan"),
    ],
  },
  {
    id: "overhang-purpose",
    type: "single",
    time: 25,
    prompt: tx(
      "What is the main job of the wide roof overhang?",
      "Apa tugas utama tritisan atap yang lebar?",
    ),
    feedback: tx(
      "A deep overhang shades the wall and keeps driving rain off the openings, so windows can stay open longer.",
      "Tritisan yang dalam menaungi dinding dan menahan tampias hujan dari bukaan, sehingga jendela bisa lebih lama terbuka.",
    ),
    choices: [
      c("Shading the walls and keeping rain off the openings", "Menaungi dinding dan menahan hujan dari bukaan", true),
      c("Making the roof heavier for stability", "Membuat atap lebih berat agar stabil"),
      c("Collecting sunlight for the interior", "Mengumpulkan cahaya matahari untuk interior"),
      c("Sealing the house from outside air", "Menutup rumah dari udara luar"),
    ],
  },
  {
    id: "roof-material",
    type: "single",
    time: 25,
    prompt: tx(
      "Which roof covering belongs to the traditional palette of the region?",
      "Penutup atap mana yang termasuk khazanah tradisional daerah ini?",
    ),
    feedback: tx(
      "Palm fibre and leaf thatch were the traditional coverings: local, light, and good at buffering heat.",
      "Ijuk dan daun rumbia adalah penutup tradisional: lokal, ringan, dan baik meredam panas.",
    ),
    choices: [
      c("Palm fibre and leaf thatch", "Ijuk dan daun rumbia", true),
      c("Poured concrete slab", "Pelat beton cor"),
      c("Glass panels", "Panel kaca"),
      c("Corrugated plastic sheet", "Lembaran plastik bergelombang"),
    ],
  },
  {
    id: "tf-steep-roof",
    type: "trueFalse",
    time: 20,
    prompt: tx(
      "True or false: a steep roof pitch helps heavy tropical rain drain quickly.",
      "Benar atau salah: kemiringan atap yang curam membantu hujan tropis deras mengalir cepat.",
    ),
    feedback: tx(
      "True. A steep slope sheds water fast, which protects the covering and reduces leaks.",
      "Benar. Kemiringan curam mengalirkan air dengan cepat sehingga melindungi penutup atap dan mengurangi kebocoran.",
    ),
    choices: [c("True", "Benar", true), c("False", "Salah")],
  },
  {
    id: "picture-deep-shade",
    type: "picture",
    time: 30,
    visual: "shadeQuestion",
    visualLabel: tx(
      "Deep roof shade protecting the living space.",
      "Naungan atap dalam melindungi ruang hidup.",
    ),
    prompt: tx(
      "Which picture shows the strongest sun protection for the wall below?",
      "Gambar mana yang menunjukkan perlindungan matahari terkuat bagi dinding di bawahnya?",
    ),
    feedback: tx(
      "A broad, low-reaching roof throws the longest shadow onto the wall and the openings.",
      "Atap yang lebar dan menjorok rendah melemparkan bayangan terpanjang ke dinding dan bukaan.",
    ),
    choices: [
      c("Wide roof with deep shade", "Atap lebar dengan naungan dalam", true, "deepShade"),
      c("Roof only without structure", "Atap saja tanpa struktur", false, "roofOnly"),
      c("Closed box without air gap", "Kotak tertutup tanpa celah udara", false, "closedBox"),
      c("House sitting flat on soil", "Rumah menempel langsung di tanah", false, "groundHouse"),
    ],
  },
  {
    id: "roof-cavity",
    type: "single",
    time: 25,
    prompt: tx(
      "How does the tall roof cavity help comfort inside the room?",
      "Bagaimana rongga atap yang tinggi membantu kenyamanan di dalam ruang?",
    ),
    feedback: tx(
      "Hot air collects high in the cavity and escapes through the gables, so the occupied zone stays cooler.",
      "Udara panas berkumpul di bagian atas rongga lalu keluar lewat sisi atap, sehingga zona penghuni tetap lebih sejuk.",
    ),
    choices: [
      c("Hot air rises into it and leaves the room", "Udara panas naik ke sana dan meninggalkan ruang", true),
      c("It stores rainwater for later", "Menyimpan air hujan untuk nanti"),
      c("It pushes cold air down mechanically", "Mendorong udara dingin ke bawah secara mekanis"),
      c("It seals the room from any air movement", "Menutup ruang dari semua gerakan udara"),
    ],
  },
  {
    id: "multi-roof-benefits",
    type: "multi",
    time: 35,
    prompt: tx(
      "Select every benefit a large tropical roof provides.",
      "Pilih semua manfaat yang diberikan atap tropis berukuran besar.",
    ),
    feedback: tx(
      "A large roof shades, sheds rain, and buffers heat all at once. It does not cool by sealing the house.",
      "Atap besar menaungi, mengalirkan hujan, dan meredam panas sekaligus. Ia tidak mendinginkan dengan cara menutup rapat rumah.",
    ),
    choices: [
      c("Shade for walls and openings", "Naungan untuk dinding dan bukaan", true),
      c("Fast drainage of heavy rain", "Pengaliran cepat hujan deras", true),
      c("A heat buffer above the room", "Peredam panas di atas ruang", true),
      c("An airtight seal around the house", "Penyekat kedap udara di sekeliling rumah"),
    ],
  },
  {
    id: "roof-ornament-apex",
    type: "single",
    time: 25,
    prompt: tx(
      "The crossed carved ornament at the roof apex of Riau Malay houses is known as?",
      "Ornamen ukir bersilang di puncak atap rumah Melayu Riau dikenal dengan sebutan?",
    ),
    feedback: tx(
      "Selembayung crowns the ridge. It marks identity and status while finishing the joint at the apex.",
      "Selembayung memahkotai bubungan. Ia menandai identitas dan status sekaligus merapikan pertemuan di puncak atap.",
    ),
    choices: [
      c("Selembayung", "Selembayung", true),
      c("Umpak", "Umpak"),
      c("Jenjang", "Jenjang"),
      c("Kolong", "Kolong"),
    ],
  },

  /* ------------------------------------------------------- airflow & openings */
  {
    id: "cross-ventilation",
    type: "single",
    time: 25,
    prompt: tx("What does cross ventilation mean?", "Apa yang dimaksud dengan ventilasi silang?"),
    feedback: tx(
      "Air enters one side and leaves the other. Without a second opening the air has nowhere to go.",
      "Udara masuk dari satu sisi dan keluar di sisi lain. Tanpa bukaan kedua, udara tidak punya jalan keluar.",
    ),
    choices: [
      c("Air enters one opening and leaves through another", "Udara masuk lewat satu bukaan dan keluar lewat bukaan lain", true),
      c("Air is pushed by a fan in a closed room", "Udara didorong kipas di ruang tertutup"),
      c("Air is trapped and cooled inside the wall", "Udara terperangkap dan didinginkan di dalam dinding"),
      c("Air moves only through the roof", "Udara hanya bergerak lewat atap"),
    ],
  },
  {
    id: "picture-cross-openings",
    type: "picture",
    time: 30,
    visual: "comfortQuestion",
    visualLabel: tx("Openings placed on opposite sides of the room.", "Bukaan yang ditempatkan di sisi berlawanan ruang."),
    prompt: tx(
      "Which picture shows the best setup for cross ventilation?",
      "Gambar mana yang menunjukkan pengaturan terbaik untuk ventilasi silang?",
    ),
    feedback: tx(
      "Openings on opposite sides give the air a clear path in and out of the room.",
      "Bukaan di sisi berlawanan memberi udara jalur yang jelas untuk masuk dan keluar ruang.",
    ),
    choices: [
      c("Openings on two opposite sides", "Bukaan di dua sisi berlawanan", true, "crossOpenings"),
      c("Sealed room with no openings", "Ruang tertutup tanpa bukaan", false, "sealedRoom"),
      c("Closed box without air gap", "Kotak tertutup tanpa celah udara", false, "closedBox"),
      c("House sitting flat on soil", "Rumah menempel langsung di tanah", false, "groundHouse"),
    ],
  },
  {
    id: "tf-single-opening",
    type: "trueFalse",
    time: 20,
    prompt: tx(
      "True or false: one window on a single wall already produces strong cross ventilation.",
      "Benar atau salah: satu jendela pada satu dinding saja sudah menghasilkan ventilasi silang yang kuat.",
    ),
    feedback: tx(
      "False. Cross ventilation needs an inlet and an outlet, ideally on different sides of the room.",
      "Salah. Ventilasi silang butuh bukaan masuk dan keluar, sebaiknya di sisi ruang yang berbeda.",
    ),
    choices: [c("True", "Benar"), c("False", "Salah", true)],
  },
  {
    id: "stack-effect",
    type: "single",
    time: 25,
    prompt: tx(
      "Warm air inside a room tends to do what?",
      "Udara hangat di dalam ruang cenderung melakukan apa?",
    ),
    feedback: tx(
      "Warm air rises. High openings let it escape while cooler air is drawn in low: the stack effect.",
      "Udara hangat naik. Bukaan tinggi membiarkannya keluar sementara udara lebih sejuk masuk dari bawah: efek cerobong.",
    ),
    choices: [
      c("Rise toward the highest openings", "Naik menuju bukaan tertinggi", true),
      c("Sink toward the floor", "Turun menuju lantai"),
      c("Stay perfectly still", "Diam sepenuhnya"),
      c("Move only sideways", "Bergerak hanya ke samping"),
    ],
  },
  {
    id: "opening-heights",
    type: "single",
    time: 25,
    prompt: tx(
      "Where should the inlet and outlet openings sit for the best air movement?",
      "Di mana sebaiknya bukaan masuk dan keluar diletakkan agar udara bergerak paling baik?",
    ),
    feedback: tx(
      "A low inlet and a high outlet combine breeze and buoyancy, sweeping air across the occupied zone.",
      "Bukaan masuk rendah dan keluar tinggi menggabungkan angin dan daya apung udara, menyapu zona penghuni.",
    ),
    choices: [
      c("Inlet low, outlet high", "Bukaan masuk rendah, keluar tinggi", true),
      c("Both openings at ceiling level", "Kedua bukaan setinggi langit-langit"),
      c("Both openings at floor level", "Kedua bukaan setinggi lantai"),
      c("Both on the same wall, side by side", "Keduanya di dinding yang sama, berdampingan"),
    ],
  },
  {
    id: "vent-lattice",
    type: "single",
    time: 25,
    prompt: tx(
      "What is the purpose of the carved lattice panel above doors and windows?",
      "Apa fungsi panel kisi berukir di atas pintu dan jendela?",
    ),
    feedback: tx(
      "It ventilates continuously. Air keeps moving even when the shutters are closed for rain or privacy.",
      "Ia berventilasi terus-menerus. Udara tetap bergerak walau daun jendela ditutup karena hujan atau privasi.",
    ),
    choices: [
      c("It lets air keep flowing even when shutters are shut", "Membiarkan udara tetap mengalir walau daun jendela ditutup", true),
      c("It is purely structural support", "Semata-mata penopang struktur"),
      c("It stores rainwater", "Menampung air hujan"),
      c("It blocks all light and air", "Menghalangi seluruh cahaya dan udara"),
    ],
  },
  {
    id: "multi-airflow-elements",
    type: "multi",
    time: 35,
    prompt: tx(
      "Select every element that helps air move through the house.",
      "Pilih semua elemen yang membantu udara bergerak melewati rumah.",
    ),
    feedback: tx(
      "Openings on different sides, the ventilated undercroft, and lattice panels all keep air moving.",
      "Bukaan di sisi berbeda, kolong berventilasi, dan panel kisi sama-sama menjaga udara tetap bergerak.",
    ),
    choices: [
      c("Openings on different sides", "Bukaan di sisi yang berbeda", true),
      c("Ventilated space under the floor", "Ruang berventilasi di bawah lantai", true),
      c("Carved lattice above the windows", "Kisi berukir di atas jendela", true),
      c("A sealed wall with no gaps", "Dinding rapat tanpa celah"),
    ],
  },
  {
    id: "tf-airflow-sweat",
    type: "trueFalse",
    time: 20,
    prompt: tx(
      "True or false: moving air feels cooler on the skin even when the temperature is unchanged.",
      "Benar atau salah: udara yang bergerak terasa lebih sejuk di kulit walau suhunya tidak berubah.",
    ),
    feedback: tx(
      "True. Air movement speeds up evaporation from the skin, which is why a breeze feels cooling in humid climates.",
      "Benar. Gerakan udara mempercepat penguapan di kulit, sebab itu embusan angin terasa menyejukkan di iklim lembap.",
    ),
    choices: [c("True", "Benar", true), c("False", "Salah")],
  },
  {
    id: "picture-sealed-room",
    type: "picture",
    time: 30,
    visual: "comfortQuestion",
    visualLabel: tx("Comparing rooms with and without openings.", "Perbandingan ruang dengan dan tanpa bukaan."),
    prompt: tx(
      "Which picture would feel the most stuffy in a humid climate?",
      "Gambar mana yang akan terasa paling pengap di iklim lembap?",
    ),
    feedback: tx(
      "Without openings there is no air exchange, so heat and moisture simply build up inside.",
      "Tanpa bukaan tidak ada pertukaran udara, sehingga panas dan kelembapan menumpuk di dalam.",
    ),
    choices: [
      c("Sealed room with no openings", "Ruang tertutup tanpa bukaan", true, "sealedRoom"),
      c("Openings on two opposite sides", "Bukaan di dua sisi berlawanan", false, "crossOpenings"),
      c("House lifted on posts", "Rumah terangkat di atas tiang", false, "raisedHouse"),
      c("Wide roof with deep shade", "Atap lebar dengan naungan dalam", false, "deepShade"),
    ],
  },
  {
    id: "breeze-orientation",
    type: "single",
    time: 25,
    prompt: tx(
      "To catch the prevailing breeze, the openings should face which direction?",
      "Untuk menangkap angin dominan, bukaan sebaiknya menghadap ke arah mana?",
    ),
    feedback: tx(
      "Read the site first. Openings are placed toward the prevailing wind, not toward a fixed compass point.",
      "Baca tapak lebih dulu. Bukaan diarahkan ke angin dominan setempat, bukan ke satu arah mata angin yang baku.",
    ),
    choices: [
      c("Toward the prevailing wind of the site", "Ke arah angin dominan di tapak", true),
      c("Always due south, everywhere", "Selalu tepat ke selatan, di mana pun"),
      c("Toward the nearest wall", "Ke arah dinding terdekat"),
      c("Away from any wind at all", "Menjauh dari semua angin"),
    ],
  },

  /* ------------------------------------------------------------------ climate */
  {
    id: "climate-type",
    type: "single",
    time: 25,
    prompt: tx(
      "Which climate does Rumah Lontiok respond to?",
      "Rumah Lontiok merespons iklim yang mana?",
    ),
    feedback: tx(
      "Kampar sits in a hot and humid tropical climate: high rainfall, high humidity, and steady warmth all year.",
      "Kampar berada di iklim tropis panas dan lembap: curah hujan tinggi, kelembapan tinggi, dan hangat sepanjang tahun.",
    ),
    choices: [
      c("Hot and humid tropical", "Tropis panas dan lembap", true),
      c("Cold continental", "Kontinental dingin"),
      c("Hot and dry desert", "Gurun panas dan kering"),
      c("Polar", "Kutub"),
    ],
  },
  {
    id: "passive-cooling",
    type: "single",
    time: 25,
    prompt: tx("What is passive cooling?", "Apa itu pendinginan pasif?"),
    feedback: tx(
      "Passive cooling uses form, shade, and airflow rather than machines and energy to keep a room comfortable.",
      "Pendinginan pasif memakai bentuk, naungan, dan aliran udara alih-alih mesin dan energi untuk menjaga kenyamanan ruang.",
    ),
    choices: [
      c("Comfort from form, shade, and airflow without machines", "Kenyamanan dari bentuk, naungan, dan aliran udara tanpa mesin", true),
      c("Cooling produced by an air conditioner", "Pendinginan yang dihasilkan pendingin ruangan"),
      c("Cooling by closing every opening", "Pendinginan dengan menutup semua bukaan"),
      c("Cooling by painting the roof any colour", "Pendinginan dengan mengecat atap warna apa pun"),
    ],
  },
  {
    id: "multi-passive-comfort",
    type: "multi",
    time: 35,
    visual: "comfortQuestion",
    visualLabel: tx(
      "Passive comfort elements around the house.",
      "Elemen kenyamanan pasif di sekitar rumah.",
    ),
    prompt: tx(
      "Select all elements that support passive comfort.",
      "Pilih semua elemen yang mendukung kenyamanan pasif.",
    ),
    feedback: tx(
      "Passive comfort comes from several connected elements: openings, elevation, and shade working together.",
      "Kenyamanan pasif lahir dari beberapa elemen yang terhubung: bukaan, elevasi, dan naungan yang bekerja bersama.",
    ),
    choices: [
      c("Openings on different sides", "Bukaan di sisi yang berbeda", true, "crossOpenings"),
      c("Raised timber floor", "Lantai kayu panggung", true, "raisedHouse"),
      c("Deep roof shade", "Naungan atap yang dalam", true, "deepShade"),
      c("Sealed room with no openings", "Ruang tertutup tanpa bukaan", false, "sealedRoom"),
    ],
  },
  {
    id: "tf-shade-solar",
    type: "trueFalse",
    time: 20,
    prompt: tx(
      "True or false: deeper roof shade can reduce direct solar exposure inside.",
      "Benar atau salah: naungan atap yang lebih dalam dapat mengurangi paparan matahari langsung di dalam.",
    ),
    feedback: tx(
      "True. Deep shade protects the interior from direct sun while airflow keeps the room comfortable.",
      "Benar. Naungan dalam melindungi interior dari matahari langsung sementara aliran udara menjaga ruang tetap nyaman.",
    ),
    choices: [c("True", "Benar", true), c("False", "Salah")],
  },
  {
    id: "rain-management",
    type: "single",
    time: 25,
    prompt: tx(
      "How does the house handle very heavy rainfall?",
      "Bagaimana rumah ini menangani curah hujan yang sangat deras?",
    ),
    feedback: tx(
      "A steep roof plus a wide overhang throws water clear of the wall and away from the foot of the posts.",
      "Atap curam ditambah tritisan lebar melemparkan air menjauh dari dinding dan kaki tiang.",
    ),
    choices: [
      c("Steep pitch and wide overhang throw water clear", "Kemiringan curam dan tritisan lebar melemparkan air menjauh", true),
      c("Flat roof holds the water until it dries", "Atap datar menahan air sampai kering"),
      c("Water is directed into the living room", "Air diarahkan masuk ke ruang keluarga"),
      c("The walls soak up the rain", "Dinding menyerap air hujan"),
    ],
  },
  {
    id: "facade-orientation",
    type: "single",
    time: 25,
    prompt: tx(
      "Why is a long facade often turned away from the east and west sun?",
      "Mengapa fasad panjang sering dihindarkan dari matahari timur dan barat?",
    ),
    feedback: tx(
      "Low morning and afternoon sun strikes east and west walls hardest and is the most difficult to shade.",
      "Matahari pagi dan sore yang rendah menghantam dinding timur dan barat paling keras serta paling sulit dinaungi.",
    ),
    choices: [
      c("Low east and west sun is hardest to shade", "Matahari timur dan barat yang rendah paling sulit dinaungi", true),
      c("Because the north side receives no wind", "Karena sisi utara tidak menerima angin"),
      c("Because rain only comes from the east", "Karena hujan hanya datang dari timur"),
      c("Because the roof cannot span that direction", "Karena atap tidak bisa membentang ke arah itu"),
    ],
  },
  {
    id: "tf-night-cooling",
    type: "trueFalse",
    time: 20,
    prompt: tx(
      "True or false: lightweight timber walls release their heat faster at night than thick masonry.",
      "Benar atau salah: dinding kayu yang ringan melepas panasnya lebih cepat pada malam hari daripada pasangan bata tebal.",
    ),
    feedback: tx(
      "True. Lightweight construction stores little heat, so the room cools down soon after sunset.",
      "Benar. Konstruksi ringan menyimpan sedikit panas sehingga ruang cepat mendingin setelah matahari terbenam.",
    ),
    choices: [c("True", "Benar", true), c("False", "Salah")],
  },
  {
    id: "humidity-strategy",
    type: "single",
    time: 25,
    prompt: tx(
      "In a humid climate, which strategy matters most for comfort?",
      "Di iklim lembap, strategi mana yang paling penting bagi kenyamanan?",
    ),
    feedback: tx(
      "Keep air moving. In humid air, ventilation matters more than storing coolness in heavy material.",
      "Jaga udara tetap bergerak. Di udara lembap, ventilasi lebih penting daripada menyimpan kesejukan dalam material berat.",
    ),
    choices: [
      c("Continuous air movement", "Gerakan udara yang terus-menerus", true),
      c("Thick sealed walls", "Dinding tebal yang rapat"),
      c("Small windows only", "Hanya jendela kecil"),
      c("Dark heat-absorbing surfaces", "Permukaan gelap penyerap panas"),
    ],
  },

  /* --------------------------------------------------------- material & craft */
  {
    id: "main-material",
    type: "single",
    time: 25,
    prompt: tx(
      "What is the primary building material of Rumah Lontiok?",
      "Apa material bangunan utama Rumah Lontiok?",
    ),
    feedback: tx(
      "Local hardwood carries the frame. It is available nearby, workable by hand, and repairable piece by piece.",
      "Kayu keras lokal memikul rangka. Bahannya tersedia di sekitar, mudah dikerjakan tangan, dan bisa diperbaiki sebagian.",
    ),
    choices: [
      c("Local hardwood timber", "Kayu keras lokal", true),
      c("Reinforced concrete", "Beton bertulang"),
      c("Fired clay blocks", "Blok tanah liat bakar"),
      c("Structural steel", "Baja struktural"),
    ],
  },
  {
    id: "wall-panel",
    type: "single",
    time: 25,
    prompt: tx(
      "How are the walls of the house typically built?",
      "Bagaimana dinding rumah ini biasanya dibangun?",
    ),
    feedback: tx(
      "Timber boards are fitted into the frame as light infill panels, so walls can be opened or replaced.",
      "Papan kayu dipasang ke dalam rangka sebagai panel pengisi yang ringan, sehingga dinding bisa dibuka atau diganti.",
    ),
    choices: [
      c("Timber boards fitted into the frame", "Papan kayu yang dipasang ke dalam rangka", true),
      c("Solid load-bearing brickwork", "Pasangan bata pemikul beban masif"),
      c("Poured concrete panels", "Panel beton cor"),
      c("Glass curtain walls", "Dinding tirai kaca"),
    ],
  },
  {
    id: "tf-local-material",
    type: "trueFalse",
    time: 20,
    prompt: tx(
      "True or false: using materials from the surrounding area reduces transport and suits the local climate.",
      "Benar atau salah: memakai material dari lingkungan sekitar mengurangi transportasi dan sesuai dengan iklim setempat.",
    ),
    feedback: tx(
      "True. Local material travels less, is understood by local builders, and has already proven itself in the climate.",
      "Benar. Material lokal menempuh jarak lebih pendek, dikuasai tukang setempat, dan sudah teruji di iklim tersebut.",
    ),
    choices: [c("True", "Benar", true), c("False", "Salah")],
  },
  {
    id: "timber-treatment",
    type: "single",
    time: 25,
    prompt: tx(
      "Which traditional treatment helps timber last longer in a humid climate?",
      "Perlakuan tradisional mana yang membuat kayu lebih awet di iklim lembap?",
    ),
    feedback: tx(
      "Seasoning and soaking the timber before use removes sap and hardens it against insects and rot.",
      "Pengeringan dan perendaman kayu sebelum dipakai membuang getah dan mengeraskannya terhadap serangga dan pelapukan.",
    ),
    choices: [
      c("Seasoning and soaking before use", "Pengeringan dan perendaman sebelum dipakai", true),
      c("Burying it in wet soil", "Menanamnya dalam tanah basah"),
      c("Keeping it permanently under water", "Menyimpannya selamanya di dalam air"),
      c("Leaving it exposed to rain for a year", "Membiarkannya terkena hujan selama setahun"),
    ],
  },
  {
    id: "multi-natural-materials",
    type: "multi",
    time: 35,
    prompt: tx(
      "Select every natural material used in the traditional house.",
      "Pilih semua material alami yang dipakai pada rumah tradisional.",
    ),
    feedback: tx(
      "Timber, palm fibre, and bamboo are the traditional set. Reinforced concrete belongs to modern construction.",
      "Kayu, ijuk, dan bambu adalah rangkaian tradisionalnya. Beton bertulang termasuk konstruksi modern.",
    ),
    choices: [
      c("Timber", "Kayu", true),
      c("Palm fibre thatch", "Atap ijuk", true),
      c("Bamboo", "Bambu", true),
      c("Reinforced concrete", "Beton bertulang"),
    ],
  },
  {
    id: "thatch-benefit",
    type: "single",
    time: 25,
    prompt: tx(
      "Compared with a thin metal sheet, a thatch roof mainly offers what?",
      "Dibandingkan seng tipis, atap ijuk terutama memberikan apa?",
    ),
    feedback: tx(
      "Thatch is a thick, fibrous layer. It slows heat transfer and softens the noise of tropical rain.",
      "Ijuk adalah lapisan tebal berserat. Ia memperlambat perpindahan panas dan meredam bunyi hujan tropis.",
    ),
    choices: [
      c("Slower heat transfer and quieter rain", "Perpindahan panas lebih lambat dan hujan lebih senyap", true),
      c("Higher structural strength", "Kekuatan struktur yang lebih tinggi"),
      c("Complete waterproofing with zero maintenance", "Kedap air total tanpa perawatan"),
      c("Reflection of all sunlight", "Pemantulan seluruh sinar matahari"),
    ],
  },

  /* ----------------------------------------------- ornament, culture & wisdom */
  {
    id: "carving-motif",
    type: "single",
    time: 25,
    prompt: tx(
      "Malay carving motifs are most often inspired by what?",
      "Motif ukiran Melayu paling sering terinspirasi dari apa?",
    ),
    feedback: tx(
      "Plants and nature dominate the motifs, such as the bamboo shoot form, tying the house to its landscape.",
      "Tumbuhan dan alam mendominasi motifnya, seperti bentuk pucuk rebung, yang mengikat rumah pada lanskapnya.",
    ),
    choices: [
      c("Plants and natural forms", "Tumbuhan dan bentuk alam", true),
      c("Machines and engines", "Mesin dan motor"),
      c("City skylines", "Panorama kota"),
      c("Written numerals only", "Hanya angka tertulis"),
    ],
  },
  {
    id: "ornament-meaning",
    type: "single",
    time: 25,
    prompt: tx(
      "What role does ornament play in this house?",
      "Apa peran ornamen pada rumah ini?",
    ),
    feedback: tx(
      "Ornament carries meaning and marks identity, and it is placed where the structure already needs a joint or edge.",
      "Ornamen membawa makna dan menandai identitas, dan diletakkan tepat di tempat struktur memang membutuhkan sambungan atau tepian.",
    ),
    choices: [
      c("It carries meaning and marks identity", "Membawa makna dan menandai identitas", true),
      c("It is added randomly with no meaning", "Ditambahkan acak tanpa makna"),
      c("It replaces structural members", "Menggantikan batang struktur"),
      c("It exists only inside bedrooms", "Hanya ada di dalam kamar tidur"),
    ],
  },
  {
    id: "picture-local-wisdom",
    type: "picture",
    time: 30,
    visual: "wisdomQuestion",
    visualLabel: tx(
      "Architecture, climate, craft, and daily life as one system.",
      "Arsitektur, iklim, kerajinan, dan kehidupan harian sebagai satu sistem.",
    ),
    prompt: tx(
      "What makes Rumah Lontiok a local wisdom lesson?",
      "Apa yang membuat Rumah Lontiok menjadi pelajaran kearifan lokal?",
    ),
    hint: tx("Choose the most complete explanation.", "Pilih penjelasan yang paling utuh."),
    feedback: tx(
      "The strongest answer connects cultural identity with craft, climate response, and everyday life.",
      "Jawaban terkuat menghubungkan identitas budaya dengan kerajinan, respons iklim, dan kehidupan sehari-hari.",
    ),
    choices: [
      c(
        "Culture, craft, climate, and daily life work as one system.",
        "Budaya, kerajinan, iklim, dan kehidupan harian bekerja sebagai satu sistem.",
        true,
        "system",
      ),
      c("It is only decorative and symbolic.", "Rumah ini hanya dekoratif dan simbolik.", false, "ornament"),
      c("It depends on modern mechanical cooling.", "Rumah ini bergantung pada pendingin mekanis modern.", false, "machine"),
      c("It avoids all relationship with climate.", "Rumah ini tidak berhubungan dengan iklim.", false, "noClimate"),
    ],
  },
  {
    id: "house-zones",
    type: "single",
    time: 25,
    prompt: tx(
      "How is the interior of a traditional Malay house usually organised?",
      "Bagaimana interior rumah tradisional Melayu biasanya diatur?",
    ),
    feedback: tx(
      "The plan moves from public to private: guests at the front, family in the middle, service and kitchen at the back.",
      "Denahnya bergerak dari publik ke privat: tamu di depan, keluarga di tengah, area layanan dan dapur di belakang.",
    ),
    choices: [
      c("Guest area in front, family in the middle, kitchen at the back", "Area tamu di depan, keluarga di tengah, dapur di belakang", true),
      c("Kitchen at the front entrance", "Dapur tepat di pintu masuk depan"),
      c("One single room with no zoning", "Satu ruang tunggal tanpa pembagian"),
      c("Bedrooms placed under the floor", "Kamar tidur ditempatkan di bawah lantai"),
    ],
  },
  {
    id: "region",
    type: "single",
    time: 20,
    prompt: tx("Rumah Lontiok comes from which region?", "Rumah Lontiok berasal dari daerah mana?"),
    feedback: tx(
      "Rumah Lontiok is the traditional house of the Kampar people in Riau, along the Kampar river.",
      "Rumah Lontiok adalah rumah tradisional masyarakat Kampar di Riau, di sepanjang Sungai Kampar.",
    ),
    choices: [
      c("Kampar, Riau", "Kampar, Riau", true),
      c("Toraja, Sulawesi", "Toraja, Sulawesi"),
      c("Badui, Banten", "Badui, Banten"),
      c("Sumba, Nusa Tenggara", "Sumba, Nusa Tenggara"),
    ],
  },
  {
    id: "tf-culture-climate",
    type: "trueFalse",
    time: 20,
    prompt: tx(
      "True or false: in this house, cultural meaning and climate response are separate, unrelated things.",
      "Benar atau salah: pada rumah ini, makna budaya dan respons iklim adalah dua hal terpisah yang tidak berhubungan.",
    ),
    feedback: tx(
      "False. The same curved roof that expresses identity also sheds rain and shades the wall.",
      "Salah. Atap melengkung yang sama, yang mengungkapkan identitas, juga mengalirkan hujan dan menaungi dinding.",
    ),
    choices: [c("True", "Benar"), c("False", "Salah", true)],
  },
  {
    id: "multi-local-wisdom",
    type: "multi",
    time: 35,
    prompt: tx(
      "Select every principle of local wisdom this house demonstrates.",
      "Pilih semua prinsip kearifan lokal yang ditunjukkan rumah ini.",
    ),
    feedback: tx(
      "Reading the climate, using nearby materials, and building together are all part of local wisdom. Copying a foreign model is not.",
      "Membaca iklim, memakai material sekitar, dan membangun bersama adalah bagian kearifan lokal. Menyalin model asing bukan.",
    ),
    choices: [
      c("Reading the local climate", "Membaca iklim setempat", true),
      c("Using materials from nearby", "Memakai material dari sekitar", true),
      c("Building together as a community", "Membangun bersama sebagai komunitas", true),
      c("Copying a foreign house model exactly", "Menyalin persis model rumah asing"),
    ],
  },
  {
    id: "modern-lesson",
    type: "single",
    time: 25,
    prompt: tx(
      "What can contemporary tropical design learn from Rumah Lontiok?",
      "Apa yang bisa dipelajari desain tropis masa kini dari Rumah Lontiok?",
    ),
    feedback: tx(
      "Solve comfort with form first: shade, elevation, and airflow reduce how much mechanical cooling is needed at all.",
      "Selesaikan kenyamanan lewat bentuk lebih dulu: naungan, elevasi, dan aliran udara menekan kebutuhan pendinginan mekanis.",
    ),
    choices: [
      c("Solve comfort through form before adding machines", "Selesaikan kenyamanan lewat bentuk sebelum menambah mesin", true),
      c("Always seal buildings and rely on air conditioning", "Selalu menutup rapat bangunan dan bergantung pada AC"),
      c("Ignore rainfall when shaping the roof", "Mengabaikan curah hujan saat membentuk atap"),
      c("Choose materials only by price", "Memilih material hanya berdasarkan harga"),
    ],
  },
  {
    id: "tf-ornament-structure",
    type: "trueFalse",
    time: 20,
    prompt: tx(
      "True or false: carvings are usually placed where the structure already forms a joint or an edge.",
      "Benar atau salah: ukiran biasanya diletakkan di tempat struktur memang membentuk sambungan atau tepian.",
    ),
    feedback: tx(
      "True. Ornament follows the logic of the frame, celebrating the points where members meet.",
      "Benar. Ornamen mengikuti logika rangka, merayakan titik-titik pertemuan antar batang.",
    ),
    choices: [c("True", "Benar", true), c("False", "Salah")],
  },
  {
    id: "preservation",
    type: "single",
    time: 25,
    prompt: tx(
      "What is the most sustainable way to keep a traditional timber house alive?",
      "Apa cara paling lestari untuk menjaga rumah kayu tradisional tetap hidup?",
    ),
    feedback: tx(
      "Regular maintenance and replacing single members keeps the knowledge, the craft, and the building in use.",
      "Perawatan rutin dan penggantian batang satu per satu menjaga pengetahuan, keterampilan, dan bangunannya tetap terpakai.",
    ),
    choices: [
      c("Regular maintenance and replacing members one by one", "Perawatan rutin dan penggantian batang satu per satu", true),
      c("Leaving it untouched until it collapses", "Membiarkannya tanpa sentuhan sampai roboh"),
      c("Encasing the whole house in concrete", "Membungkus seluruh rumah dengan beton"),
      c("Removing the roof to reduce weight", "Melepas atap untuk mengurangi beban"),
    ],
  },
  {
    id: "why-learn-ar",
    type: "single",
    time: 25,
    prompt: tx(
      "Why is AR useful for studying a house like this?",
      "Mengapa AR berguna untuk mempelajari rumah seperti ini?",
    ),
    feedback: tx(
      "AR lets you take the house apart, watch the air move, and see hidden layers that a photograph cannot show.",
      "AR memungkinkan kita membongkar rumah, mengamati udara bergerak, dan melihat lapisan tersembunyi yang tak bisa ditunjukkan foto.",
    ),
    choices: [
      c("It reveals hidden layers and invisible airflow", "Ia menampakkan lapisan tersembunyi dan aliran udara yang tak terlihat", true),
      c("It replaces the need to visit any real building", "Ia menghapus kebutuhan mengunjungi bangunan nyata"),
      c("It changes the actual construction of the house", "Ia mengubah konstruksi rumah yang sebenarnya"),
      c("It makes the house physically cooler", "Ia membuat rumah menjadi lebih sejuk secara fisik"),
    ],
  },
  {
    id: "multi-climate-response",
    type: "multi",
    time: 35,
    prompt: tx(
      "Select every design move that is a direct response to the tropical climate.",
      "Pilih semua langkah desain yang merupakan respons langsung terhadap iklim tropis.",
    ),
    feedback: tx(
      "Elevation, deep shade, and generous openings all answer heat, rain, and humidity together.",
      "Elevasi, naungan dalam, dan bukaan lebar sama-sama menjawab panas, hujan, dan kelembapan.",
    ),
    choices: [
      c("Raising the floor above the ground", "Menaikkan lantai dari permukaan tanah", true),
      c("Extending the roof for deep shade", "Memperpanjang atap untuk naungan dalam", true),
      c("Providing generous openings", "Menyediakan bukaan yang lebar", true),
      c("Sealing every gap in the wall", "Menutup rapat setiap celah dinding"),
    ],
  },
  {
    id: "tf-shape-identity",
    type: "trueFalse",
    time: 20,
    prompt: tx(
      "True or false: the curved roof of Rumah Lontiok is purely decorative and has no practical role.",
      "Benar atau salah: atap melengkung Rumah Lontiok murni dekoratif dan tidak punya peran praktis.",
    ),
    feedback: tx(
      "False. The same form that signals identity also drains rain quickly and shelters the wall below.",
      "Salah. Bentuk yang sama yang menandai identitas juga mengalirkan hujan dengan cepat dan melindungi dinding di bawahnya.",
    ),
    choices: [c("True", "Benar"), c("False", "Salah", true)],
  },
  {
    id: "daily-life-veranda",
    type: "single",
    time: 25,
    prompt: tx(
      "What is the social role of the front veranda?",
      "Apa peran sosial serambi depan?",
    ),
    feedback: tx(
      "The veranda is the threshold between street and home: a shaded place to receive guests and watch the neighbourhood.",
      "Serambi adalah ambang antara jalan dan rumah: tempat teduh untuk menerima tamu dan mengamati lingkungan sekitar.",
    ),
    choices: [
      c("A shaded threshold for receiving guests", "Ambang teduh untuk menerima tamu", true),
      c("A private sleeping room", "Kamar tidur pribadi"),
      c("A sealed storage vault", "Gudang tertutup rapat"),
      c("The main structural support", "Penopang struktur utama"),
    ],
  },
  {
    id: "window-shutter",
    type: "single",
    time: 25,
    prompt: tx(
      "Why do windows use timber shutters rather than fixed glass?",
      "Mengapa jendela memakai daun kayu, bukan kaca mati?",
    ),
    feedback: tx(
      "Shutters can be adjusted through the day, tuning light, rain protection, privacy, and airflow.",
      "Daun jendela bisa diatur sepanjang hari, menyetel cahaya, perlindungan hujan, privasi, dan aliran udara.",
    ),
    choices: [
      c("They can be adjusted for light, rain, and air", "Bisa diatur untuk cahaya, hujan, dan udara", true),
      c("They are stronger than the frame", "Lebih kuat daripada rangka"),
      c("They keep the room permanently dark", "Membuat ruang gelap secara permanen"),
      c("They collect rainwater for the kitchen", "Menampung air hujan untuk dapur"),
    ],
  },
  {
    id: "tf-undercroft-airflow",
    type: "trueFalse",
    time: 20,
    prompt: tx(
      "True or false: closing the undercroft with a solid wall would improve airflow under the house.",
      "Benar atau salah: menutup kolong dengan dinding masif akan memperbaiki aliran udara di bawah rumah.",
    ),
    feedback: tx(
      "False. A solid wall traps humid air under the floor, which is exactly what the open undercroft avoids.",
      "Salah. Dinding masif memerangkap udara lembap di bawah lantai, justru hal yang dihindari oleh kolong terbuka.",
    ),
    choices: [c("True", "Benar"), c("False", "Salah", true)],
  },
  {
    id: "comfort-definition",
    type: "single",
    time: 25,
    prompt: tx(
      "Thermal comfort in a humid tropical room depends most on which combination?",
      "Kenyamanan termal di ruang tropis lembap paling bergantung pada kombinasi yang mana?",
    ),
    feedback: tx(
      "Air temperature, humidity, and air speed together decide how a room feels, which is why breeze matters so much here.",
      "Suhu udara, kelembapan, dan kecepatan udara bersama-sama menentukan rasa ruang, sebab itu embusan angin sangat berarti di sini.",
    ),
    choices: [
      c("Temperature, humidity, and air speed", "Suhu, kelembapan, dan kecepatan udara", true),
      c("Wall colour and floor pattern", "Warna dinding dan pola lantai"),
      c("Roof height only", "Hanya ketinggian atap"),
      c("Number of doors only", "Hanya jumlah pintu"),
    ],
  },
  {
    id: "multi-not-traditional",
    type: "multi",
    time: 35,
    prompt: tx(
      "Select every choice that would weaken the traditional climate strategy.",
      "Pilih semua pilihan yang akan melemahkan strategi iklim tradisional.",
    ),
    feedback: tx(
      "Sealing openings, cutting the overhang, and setting the floor on the soil each remove one of the core strategies.",
      "Menutup bukaan, memangkas tritisan, dan menempelkan lantai ke tanah masing-masing menghapus satu strategi inti.",
    ),
    choices: [
      c("Sealing the openings permanently", "Menutup bukaan secara permanen", true),
      c("Cutting the roof overhang short", "Memangkas tritisan atap menjadi pendek", true),
      c("Placing the floor directly on soil", "Menempatkan lantai langsung di atas tanah", true),
      c("Keeping openings on opposite walls", "Mempertahankan bukaan di dinding berlawanan"),
    ],
  },
  {
    id: "structure-repair",
    type: "single",
    time: 25,
    prompt: tx(
      "A single post has rotted at the base. What does the traditional system allow?",
      "Satu tiang lapuk di bagian bawah. Apa yang dimungkinkan oleh sistem tradisional?",
    ),
    feedback: tx(
      "The damaged post can be jacked up and swapped out, because the frame is assembled from replaceable parts.",
      "Tiang yang rusak bisa didongkrak lalu diganti, karena rangka tersusun dari bagian yang dapat digantikan.",
    ),
    choices: [
      c("Replacing that post without rebuilding the house", "Mengganti tiang itu tanpa membangun ulang rumah", true),
      c("Demolishing the whole structure", "Merobohkan seluruh struktur"),
      c("Filling the post with concrete only", "Mengisi tiang hanya dengan beton"),
      c("Removing the roof permanently", "Melepas atap secara permanen"),
    ],
  },
  {
    id: "tf-ar-layers",
    type: "trueFalse",
    time: 20,
    prompt: tx(
      "True or false: the structure, airflow, and climate layers describe the same house from different angles.",
      "Benar atau salah: lapisan struktur, aliran udara, dan iklim menjelaskan rumah yang sama dari sudut berbeda.",
    ),
    feedback: tx(
      "True. Each layer is a different reading of one building, and together they explain why it is shaped the way it is.",
      "Benar. Tiap lapisan adalah pembacaan berbeda atas satu bangunan, dan bersama-sama menjelaskan mengapa bentuknya demikian.",
    ),
    choices: [c("True", "Benar", true), c("False", "Salah")],
  },
];

const PREPARED = BANK.map((question) => ({
  ...question,
  choices: question.choices.map((choice, index) => ({ ...choice, id: `c${index + 1}` })),
}));

const BY_ID = new Map(PREPARED.map((question) => [question.id, question]));

export const QUIZ_BANK_SIZE = PREPARED.length;

/**
 * Build a random attempt: `count` unique questions with their choices shuffled.
 * Returns a lightweight plan (ids only) so the questions can be re-resolved in
 * any language without changing the order the learner already sees.
 */
export function createQuizPlan(count = QUIZ_QUESTION_COUNT) {
  const size = Math.max(1, Math.min(count, PREPARED.length));
  return shuffle(PREPARED)
    .slice(0, size)
    .map((question) => ({
      id: question.id,
      choices: keepsChoiceOrder(question)
        ? question.choices.map((choice) => choice.id)
        : shuffle(question.choices).map((choice) => choice.id),
    }));
}

export function resolveQuizQuestions(plan, language = "en") {
  if (!Array.isArray(plan)) {
    return [];
  }

  return plan
    .map((entry) => resolveQuestion(entry, language))
    .filter(Boolean);
}

function resolveQuestion(entry, language) {
  const question = BY_ID.get(entry?.id);
  if (!question) {
    return null;
  }

  const order = Array.isArray(entry.choices) && entry.choices.length
    ? entry.choices
    : question.choices.map((choice) => choice.id);

  const choices = order
    .map((choiceId) => question.choices.find((choice) => choice.id === choiceId))
    .filter(Boolean)
    .map((choice, index) => ({
      id: choice.id,
      option: String.fromCharCode(65 + index),
      label: pick(choice.label, language),
      visual: choice.visual || "",
      correct: Boolean(choice.correct),
    }));

  return {
    id: question.id,
    type: question.type,
    multiple: question.type === "multi",
    timeLimit: question.time || 30,
    points: question.points || 1,
    visual: question.visual || "",
    visualLabel: question.visualLabel ? pick(question.visualLabel, language) : "",
    prompt: pick(question.prompt, language),
    hint: question.hint ? pick(question.hint, language) : "",
    feedback: pick(question.feedback, language),
    choices,
  };
}

function keepsChoiceOrder(question) {
  return question.type === "trueFalse";
}

function pick(value, language) {
  if (!value || typeof value !== "object") {
    return value || "";
  }
  return value[language] || value.en || "";
}

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}
