// Canvas airflow renderer for the Rumah Lontiok scene.
//
// The flow is not a physics solver. It is a hand-authored velocity field: each
// stage declares a few "guides" (polylines that trace where air actually goes
// through the house), and the field at any point is the weighted average of the
// nearby guide tangents. That field is baked once into a coarse grid, so the
// per-frame cost per particle is a bilinear lookup and two adds.
//
// Coordinates: guides are authored in CSS space (0..1 of the .house-model box,
// matching the percentages in styles.css). Internally everything runs in metric
// space where y is divided by the box aspect, so one unit of x and one unit of y
// cover the same number of pixels and the flow reads isotropic.

const ASPECT = 1.24; // .house-model aspect-ratio
const my = (cssY) => cssY / ASPECT;

const X_MIN = -0.3;
const X_MAX = 1.3;
const Y_MIN = my(-0.3);
const Y_MAX = my(1.25);
const COLS = 58;
const ROWS = 46;
const CELL_W = (X_MAX - X_MIN) / (COLS - 1);
const CELL_H = (Y_MAX - Y_MIN) / (ROWS - 1);

// House landmarks, read off styles.css so the flow lands on real geometry.
const RIDGE = [0.491, 0.064];
const EAVE_L = [0.113, 0.383];
const EAVE_R = [0.896, 0.383];
const WALL = { x0: 0.17, x1: 0.85, y0: 0.38, y1: 0.65 };
const SLAB = { x0: 0.14, x1: 0.86, y0: 0.63, y1: 0.73 };
const OPENINGS = [
  { x: 0.268, y: 0.505, w: 0.062, h: 0.097 }, // window-a
  { x: 0.374, y: 0.505, w: 0.062, h: 0.097 }, // window-b
  { x: 0.52, y: 0.528, w: 0.077, h: 0.179 }, // door
  { x: 0.731, y: 0.505, w: 0.076, h: 0.097 }, // window-c
];

const OPENING_SCALE = { low: 0.62, medium: 1, wide: 1.44 };
const SPEED_SCALE = { low: 0.68, medium: 1, wide: 1.32 };
const COUNT_SCALE = { low: 0.62, medium: 1, wide: 1.34 };

// Cyan while the air is still outside and crossing, warm once it is the heated
// air being pushed out of the ridge — the tint alone tells you which stage runs.
const STAGE_TINT = [
  [121, 216, 226],
  [132, 226, 205],
  [231, 175, 112],
];

function kolong(floorHeight) {
  return floorHeight === "low"
    ? { y: 0.895, speed: 0.72 }
    : { y: 0.855, speed: 1 };
}

// Each guide: pts in CSS space, radius = how far its influence reaches,
// speed = metric units per second along it, weight = relative authority.
function buildGuides(stage, floorHeight) {
  const k = kolong(floorHeight);

  if (stage === 0) {
    // Masuk: angin menyapu kolong rumah panggung, sisanya melimpas di atas atap.
    return [
      {
        pts: [
          [-0.3, k.y + 0.01],
          [0.06, k.y],
          [0.32, k.y - 0.004],
          [0.6, k.y - 0.008],
          [0.86, k.y - 0.012],
          [1.3, k.y - 0.015],
        ],
        radius: 0.078,
        speed: 0.3 * k.speed,
        weight: 1.3,
      },
      {
        pts: [
          [-0.3, 0.35],
          [0.02, 0.27],
          [0.22, 0.16],
          [0.42, 0.08],
          [0.491, 0.056],
          [0.62, 0.1],
          [0.8, 0.21],
          [1.02, 0.31],
          [1.3, 0.37],
        ],
        radius: 0.085,
        speed: 0.28,
        weight: 0.9,
      },
      {
        pts: [
          [0.04, k.y + 0.03],
          [0.26, k.y - 0.02],
          [0.38, k.y - 0.08],
          [0.45, 0.755],
        ],
        radius: 0.05,
        speed: 0.16 * k.speed,
        weight: 0.5,
      },
    ];
  }

  if (stage === 1) {
    // Silang: masuk jendela kiri, menembus ruang, keluar jendela sisi kanan.
    return [
      {
        pts: [
          [-0.3, 0.512],
          [0.16, 0.508],
          [0.268, 0.505],
          [0.4, 0.497],
          [0.56, 0.502],
          [0.731, 0.505],
          [0.92, 0.509],
          [1.3, 0.514],
        ],
        radius: 0.055,
        speed: 0.31,
        weight: 1.3,
      },
      {
        pts: [
          [-0.3, 0.565],
          [0.2, 0.55],
          [0.374, 0.521],
          [0.52, 0.529],
          [0.74, 0.546],
          [0.97, 0.558],
          [1.3, 0.564],
        ],
        radius: 0.05,
        speed: 0.25,
        weight: 0.95,
      },
      {
        pts: [
          [-0.3, k.y],
          [0.24, k.y - 0.005],
          [0.56, k.y - 0.01],
          [1.3, k.y - 0.014],
        ],
        radius: 0.06,
        speed: 0.2 * k.speed,
        weight: 0.6,
      },
      {
        pts: [
          [0.3, 0.6],
          [0.36, 0.548],
          [0.46, 0.502],
          [0.58, 0.474],
        ],
        radius: 0.048,
        speed: 0.12,
        weight: 0.35,
      },
    ];
  }

  // Keluar: udara panas naik di dalam ruang lalu lepas lewat bubungan.
  return [
    {
      pts: [
        [0.28, 0.61],
        [0.33, 0.55],
        [0.39, 0.44],
        [0.45, 0.28],
        [0.484, 0.13],
        [0.495, 0.02],
        [0.5, -0.22],
      ],
      radius: 0.07,
      speed: 0.3,
      weight: 1.2,
    },
    {
      pts: [
        [0.7, 0.62],
        [0.64, 0.52],
        [0.57, 0.36],
        [0.52, 0.18],
        [0.508, 0.04],
        [0.515, -0.22],
      ],
      radius: 0.065,
      speed: 0.27,
      weight: 1,
    },
    {
      pts: [
        [-0.3, k.y],
        [0.26, k.y - 0.006],
        [0.62, k.y - 0.012],
        [1.3, k.y - 0.016],
      ],
      radius: 0.06,
      speed: 0.18 * k.speed,
      weight: 0.5,
    },
    {
      pts: [
        [0.49, 0.03],
        [0.54, -0.07],
        [0.63, -0.22],
      ],
      radius: 0.06,
      speed: 0.22,
      weight: 0.4,
    },
  ];
}

function prepareGuide(guide, speedScale) {
  const pts = guide.pts.map(([x, y]) => [x, my(y)]);
  const segments = [];
  let total = 0;

  for (let i = 0; i < pts.length - 1; i += 1) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[i + 1];
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy) || 1e-6;
    segments.push({ ax, ay, dx, dy, len2: dx * dx + dy * dy, tx: dx / len, ty: dy / len, len });
    total += len;
  }

  return {
    segments,
    total,
    radius: guide.radius,
    speed: guide.speed * speedScale,
    weight: guide.weight,
  };
}

function nearestOnGuide(guide, x, y) {
  let best = Infinity;
  let tx = 1;
  let ty = 0;

  for (let i = 0; i < guide.segments.length; i += 1) {
    const s = guide.segments[i];
    let t = ((x - s.ax) * s.dx + (y - s.ay) * s.dy) / s.len2;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const px = s.ax + s.dx * t;
    const py = s.ay + s.dy * t;
    const d2 = (x - px) * (x - px) + (y - py) * (y - py);

    if (d2 < best) {
      best = d2;
      tx = s.tx;
      ty = s.ty;
    }
  }

  return { dist: Math.sqrt(best), tx, ty };
}

function pointOnGuide(guide, t) {
  let travel = guide.total * t;

  for (let i = 0; i < guide.segments.length; i += 1) {
    const s = guide.segments[i];
    if (travel <= s.len || i === guide.segments.length - 1) {
      const f = s.len === 0 ? 0 : Math.min(travel / s.len, 1);
      return { x: s.ax + s.dx * f, y: s.ay + s.dy * f, tx: s.tx, ty: s.ty };
    }
    travel -= s.len;
  }

  return { x: 0, y: 0, tx: 1, ty: 0 };
}

function inTriangle(x, y, a, b, c) {
  const d1 = (x - b[0]) * (a[1] - b[1]) - (a[0] - b[0]) * (y - b[1]);
  const d2 = (x - c[0]) * (b[1] - c[1]) - (b[0] - c[0]) * (y - c[1]);
  const d3 = (x - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (y - a[1]);
  const neg = d1 < 0 || d2 < 0 || d3 < 0;
  const pos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(neg && pos);
}

// How much a particle is dimmed at this point: air behind the roof, walls or
// floor reads as "inside the house" instead of floating in front of it.
function occlusionAt(cssX, cssY, openingScale) {
  for (let i = 0; i < OPENINGS.length; i += 1) {
    const o = OPENINGS[i];
    const hw = (o.w * openingScale) / 2;
    const hh = o.h / 2;
    if (cssX > o.x - hw && cssX < o.x + hw && cssY > o.y - hh && cssY < o.y + hh) {
      return 0.94;
    }
  }

  if (cssX > SLAB.x0 && cssX < SLAB.x1 && cssY > SLAB.y0 && cssY < SLAB.y1) {
    return 0.24;
  }

  if (cssX > WALL.x0 && cssX < WALL.x1 && cssY > WALL.y0 && cssY < WALL.y1) {
    return 0.4;
  }

  if (inTriangle(cssX, cssY, RIDGE, EAVE_L, EAVE_R)) {
    return 0.42;
  }

  return 1;
}

function bakeField(stage, openings, floorHeight) {
  const guides = buildGuides(stage, floorHeight).map((guide) =>
    prepareGuide(guide, SPEED_SCALE[openings] ?? 1),
  );
  const openingScale = OPENING_SCALE[openings] ?? 1;
  const vx = new Float32Array(COLS * ROWS);
  const vy = new Float32Array(COLS * ROWS);
  const alpha = new Float32Array(COLS * ROWS);

  for (let row = 0; row < ROWS; row += 1) {
    const y = Y_MIN + row * CELL_H;

    for (let col = 0; col < COLS; col += 1) {
      const x = X_MIN + col * CELL_W;
      let sumX = 0;
      let sumY = 0;
      let sumW = 0;

      for (let g = 0; g < guides.length; g += 1) {
        const guide = guides[g];
        const near = nearestOnGuide(guide, x, y);
        const ratio = near.dist / guide.radius;
        const w = guide.weight * Math.exp(-ratio * ratio * 1.6);

        if (w > 1e-4) {
          sumX += near.tx * guide.speed * w;
          sumY += near.ty * guide.speed * w;
          sumW += w;
        }
      }

      const index = row * COLS + col;

      if (sumW > 1e-4) {
        // Weighted average of the guide tangents, faded out where no guide
        // reaches so particles drift to a stop instead of teleporting.
        const presence = Math.min(1, sumW * 1.5 + 0.06);
        vx[index] = (sumX / sumW) * presence;
        vy[index] = (sumY / sumW) * presence;
      }

      alpha[index] = occlusionAt(x, y * ASPECT, openingScale);
    }
  }

  return { vx, vy, alpha, guides };
}

function createSampler(field) {
  return function sample(x, y, out) {
    const fx = (x - X_MIN) / CELL_W;
    const fy = (y - Y_MIN) / CELL_H;
    let c0 = Math.floor(fx);
    let r0 = Math.floor(fy);

    if (c0 < 0) c0 = 0;
    if (r0 < 0) r0 = 0;
    if (c0 > COLS - 2) c0 = COLS - 2;
    if (r0 > ROWS - 2) r0 = ROWS - 2;

    const tx = Math.min(Math.max(fx - c0, 0), 1);
    const ty = Math.min(Math.max(fy - r0, 0), 1);
    const i00 = r0 * COLS + c0;
    const i10 = i00 + 1;
    const i01 = i00 + COLS;
    const i11 = i01 + 1;
    const w00 = (1 - tx) * (1 - ty);
    const w10 = tx * (1 - ty);
    const w01 = (1 - tx) * ty;
    const w11 = tx * ty;

    out.vx = field.vx[i00] * w00 + field.vx[i10] * w10 + field.vx[i01] * w01 + field.vx[i11] * w11;
    out.vy = field.vy[i00] * w00 + field.vy[i10] * w10 + field.vy[i01] * w01 + field.vy[i11] * w11;
    out.alpha =
      field.alpha[i00] * w00 +
      field.alpha[i10] * w10 +
      field.alpha[i01] * w01 +
      field.alpha[i11] * w11;
    return out;
  };
}

// Static streamlines traced through the baked field. They make the flow
// structure readable even in a still frame or a screenshot.
function traceStreamlines(field, sample) {
  const lines = [];
  const probe = { vx: 0, vy: 0, alpha: 1 };

  field.guides.forEach((guide) => {
    if (guide.weight < 0.45) {
      return;
    }

    const head = pointOnGuide(guide, 0.02);
    const offsets = [0, guide.radius * 0.55, -guide.radius * 0.55];

    offsets.forEach((offset) => {
      let x = head.x - head.ty * offset;
      let y = head.y + head.tx * offset;
      const points = [[x, y]];

      for (let step = 0; step < 300; step += 1) {
        sample(x, y, probe);
        const speed = Math.hypot(probe.vx, probe.vy);
        if (speed < 0.012) {
          break;
        }
        x += probe.vx * 0.05;
        y += probe.vy * 0.05;
        if (x < X_MIN || x > X_MAX || y < Y_MIN || y > Y_MAX) {
          break;
        }
        points.push([x, y]);
      }

      if (points.length > 12) {
        lines.push(points);
      }
    });
  });

  return lines;
}

function detectTier() {
  if (typeof navigator === "undefined") {
    return "high";
  }

  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  const coarse =
    typeof window !== "undefined" &&
    window.matchMedia?.("(hover: none) and (pointer: coarse)").matches;

  if (cores <= 4 || memory <= 4 || coarse) {
    return "low";
  }

  return "high";
}

export function createAirflowField() {
  const canvas = document.createElement("canvas");
  canvas.className = "airflow-canvas";
  canvas.setAttribute("aria-hidden", "true");

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const tier = detectTier();
  const baseCount = tier === "low" ? 130 : 240;
  const probe = { vx: 0, vy: 0, alpha: 1 };

  let field = null;
  let sample = null;
  let streamlines = [];
  let particles = [];
  let signature = "";
  let openingsSetting = "medium";
  let tint = STAGE_TINT[0];

  let width = 0;
  let height = 0;
  let dpr = 1;
  let rafId = null;
  let lastTime = 0;
  let dashPhase = 0;
  let stopTimer = null;
  let running = false;
  let needsStaticDraw = false;

  // Adaptive quality: if the device cannot hold the frame budget, thin the
  // particle set out rather than dropping frames.
  let quality = 1;
  let frameEma = 16.7;
  let sinceCheck = 0;

  const resizeObserver =
    typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver((entries) => {
          const box = entries[0]?.contentRect;
          if (box) {
            resize(box.width, box.height);
          }
        });

  resizeObserver?.observe(canvas);

  function resize(cssWidth, cssHeight) {
    // Re-parenting the canvas after every render can report the same box twice;
    // assigning canvas.width would wipe the trail, so ignore no-op resizes.
    if (cssWidth < 4 || cssHeight < 4 || (cssWidth === width && cssHeight === height)) {
      return;
    }

    const rawDpr = typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;
    let scale = Math.min(rawDpr, tier === "low" ? 1.75 : 2);
    const maxPixels = tier === "low" ? 420000 : 900000;
    const pixels = cssWidth * cssHeight * scale * scale;

    if (pixels > maxPixels) {
      scale *= Math.sqrt(maxPixels / pixels);
    }

    width = cssWidth;
    height = cssHeight;
    dpr = scale;
    canvas.width = Math.round(cssWidth * scale);
    canvas.height = Math.round(cssHeight * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    needsStaticDraw = true;
  }

  function targetCount(openings) {
    return Math.max(
      48,
      Math.round(baseCount * (COUNT_SCALE[openings] ?? 1) * quality),
    );
  }

  function spawn(particle, seeded) {
    const guides = field.guides;
    let pick = guides[0];
    let roll = Math.random() * guides.reduce((sum, g) => sum + g.weight, 0);

    for (let i = 0; i < guides.length; i += 1) {
      roll -= guides[i].weight;
      if (roll <= 0) {
        pick = guides[i];
        break;
      }
    }

    // Fresh particles enter near the head of a guide; on the first fill they are
    // scattered along its whole length so the flow starts already populated.
    const t = seeded ? Math.random() * 0.92 : Math.random() * Math.random() * 0.22;
    const at = pointOnGuide(pick, t);
    const spread = pick.radius * 0.85;

    particle.x = at.x + (Math.random() - 0.5) * spread * 2 - at.ty * (Math.random() - 0.5) * spread;
    particle.y = at.y + (Math.random() - 0.5) * spread * 2 + at.tx * (Math.random() - 0.5) * spread;
    particle.life = 0;
    particle.span = 2.6 + Math.random() * 3.4;
    particle.jitter = 0.72 + Math.random() * 0.62;
    particle.size = Math.random();
  }

  function buildParticles(count, seeded) {
    const next = [];
    for (let i = 0; i < count; i += 1) {
      const particle = { x: 0, y: 0, life: 0, span: 1, jitter: 1, size: 0 };
      spawn(particle, seeded);
      particle.life = seeded ? Math.random() * particle.span : 0;
      next.push(particle);
    }
    return next;
  }

  function configure(nextStage, openings, floorHeight) {
    const nextSignature = `${nextStage}|${openings}|${floorHeight}`;
    if (nextSignature === signature) {
      return;
    }

    signature = nextSignature;
    openingsSetting = openings;
    tint = STAGE_TINT[nextStage] || STAGE_TINT[0];
    field = bakeField(nextStage, openings, floorHeight);
    sample = createSampler(field);
    streamlines = traceStreamlines(field, sample);
    particles = buildParticles(targetCount(openings), true);
    needsStaticDraw = true;
  }

  function toPixelX(x) {
    return x * width;
  }

  function toPixelY(y) {
    return y * width;
  }

  function drawStreamlines(animated) {
    if (!streamlines.length) {
      return;
    }

    ctx.globalCompositeOperation = "lighter";
    ctx.lineWidth = Math.max(1, width / 320);
    ctx.strokeStyle = `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, ${animated ? 0.11 : 0.3})`;
    ctx.setLineDash([width * 0.024, width * 0.05]);
    ctx.lineDashOffset = -dashPhase;
    ctx.beginPath();

    for (let i = 0; i < streamlines.length; i += 1) {
      const points = streamlines[i];
      ctx.moveTo(toPixelX(points[0][0]), toPixelY(points[0][1]));
      for (let p = 2; p < points.length; p += 2) {
        ctx.lineTo(toPixelX(points[p][0]), toPixelY(points[p][1]));
      }
    }

    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawParticles() {
    // Particles are bucketed by width and brightness so the whole field costs
    // nine stroke calls a frame instead of one per particle.
    const unit = Math.max(0.8, width / 300);
    const widths = [1.15 * unit, 1.75 * unit, 2.5 * unit];
    const buckets = [[], [], [], [], [], [], [], [], []];

    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      sample(p.x, p.y, probe);

      const fade = Math.min(1, p.life * 2.6) * Math.min(1, (p.span - p.life) * 1.5);
      if (fade <= 0.02) {
        continue;
      }

      const brightness = fade * probe.alpha;
      const aIdx = brightness > 0.66 ? 2 : brightness > 0.34 ? 1 : 0;
      const wIdx = p.size > 0.72 ? 2 : p.size > 0.36 ? 1 : 0;
      const tail = 0.085 * p.jitter;

      buckets[wIdx * 3 + aIdx].push(
        toPixelX(p.x - probe.vx * tail),
        toPixelY(p.y - probe.vy * tail),
        toPixelX(p.x),
        toPixelY(p.y),
      );
    }

    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";

    for (let b = 0; b < buckets.length; b += 1) {
      const points = buckets[b];
      if (!points.length) {
        continue;
      }

      const alpha = 0.2 + (b % 3) * 0.26;
      ctx.strokeStyle = `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, ${alpha})`;
      ctx.lineWidth = widths[Math.floor(b / 3)];
      ctx.beginPath();

      for (let i = 0; i < points.length; i += 4) {
        ctx.moveTo(points[i], points[i + 1]);
        ctx.lineTo(points[i + 2], points[i + 3]);
      }

      ctx.stroke();
    }
  }

  function step(dt) {
    const wanted = targetCount(openingsSetting);

    if (particles.length > wanted) {
      particles.length = wanted;
    } else if (particles.length < wanted) {
      particles = particles.concat(buildParticles(wanted - particles.length, true));
    }

    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      sample(p.x, p.y, probe);

      p.x += probe.vx * p.jitter * dt;
      p.y += probe.vy * p.jitter * dt;
      p.life += dt;

      if (
        p.life > p.span ||
        p.x < X_MIN ||
        p.x > X_MAX ||
        p.y < Y_MIN ||
        p.y > Y_MAX ||
        Math.hypot(probe.vx, probe.vy) < 0.008
      ) {
        spawn(p, false);
      }
    }
  }

  function drawStatic() {
    if (!field || width < 4) {
      return;
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, width, height);
    drawStreamlines(false);

    // A few markers along each streamline stand in for motion.
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, 0.62)`;
    const radius = Math.max(1.4, width / 190);

    streamlines.forEach((points) => {
      for (let i = 10; i < points.length; i += 26) {
        ctx.beginPath();
        ctx.arc(toPixelX(points[i][0]), toPixelY(points[i][1]), radius, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.globalCompositeOperation = "source-over";
    needsStaticDraw = false;
  }

  function frame(now) {
    rafId = window.requestAnimationFrame(frame);

    if (!field || width < 4) {
      return;
    }

    const raw = lastTime ? now - lastTime : 16.7;
    lastTime = now;
    const ms = Math.min(raw, 48);
    const dt = ms / 1000;

    frameEma += (ms - frameEma) * 0.06;
    sinceCheck += 1;

    if (sinceCheck > 90) {
      sinceCheck = 0;
      if (frameEma > 23 && quality > 0.55) {
        quality = Math.max(0.55, quality - 0.18);
      } else if (frameEma < 14 && quality < 1) {
        quality = Math.min(1, quality + 0.12);
      }
    }

    step(dt);
    dashPhase = (dashPhase + width * 0.06 * dt) % 4096;

    // Fading the whole surface instead of clearing it is what leaves the comet
    // trails; the exponent keeps trail length constant across frame rates.
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = `rgba(0, 0, 0, ${1 - Math.pow(0.87, ms / 16.7)})`;
    ctx.fillRect(0, 0, width, height);

    drawStreamlines(true);
    drawParticles();
    ctx.globalCompositeOperation = "source-over";
  }

  function start() {
    if (running || reduceMotion) {
      return;
    }
    running = true;
    lastTime = 0;
    rafId = window.requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (width >= 4) {
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, width, height);
    }
  }

  function handleVisibility() {
    if (document.hidden) {
      if (running && rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    } else if (running && rafId === null) {
      lastTime = 0;
      rafId = window.requestAnimationFrame(frame);
    }
  }

  document.addEventListener("visibilitychange", handleVisibility);

  function sync(host, options) {
    if (!host) {
      return;
    }

    if (canvas.parentNode !== host) {
      host.appendChild(canvas);
      if (!width && host.clientWidth) {
        resize(host.clientWidth, host.clientHeight);
      }
    }

    if (!options.visible) {
      canvas.classList.remove("is-live");
      window.clearTimeout(stopTimer);
      stopTimer = window.setTimeout(stop, 520);
      return;
    }

    window.clearTimeout(stopTimer);
    configure(options.stage % STAGE_TINT.length, options.openings, options.floorHeight);
    canvas.classList.add("is-live");

    if (reduceMotion) {
      if (needsStaticDraw) {
        drawStatic();
      }
      return;
    }

    start();
  }

  function destroy() {
    stop();
    window.clearTimeout(stopTimer);
    resizeObserver?.disconnect();
    document.removeEventListener("visibilitychange", handleVisibility);
    canvas.remove();
  }

  return { sync, destroy };
}
