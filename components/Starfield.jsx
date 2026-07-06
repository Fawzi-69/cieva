// Champ d'étoiles déterministe (LCG seedé) — identique SSR/CSR, pas de Math.random.
function makeStars(n, seed) {
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  const out = [];
  for (let i = 0; i < n; i++) {
    const size = 1 + Math.round(rand() * 1.6);
    out.push({
      i,
      top: (rand() * 100).toFixed(2),
      left: (rand() * 100).toFixed(2),
      size,
      dur: (2.8 + rand() * 4).toFixed(2),
      delay: (rand() * 5).toFixed(2),
    });
  }
  return out;
}

export default function Starfield({ count = 90, seed = 48271 }) {
  const stars = makeStars(count, seed);
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}
    >
      {stars.map((st) => (
        <span
          key={st.i}
          style={{
            position: "absolute",
            top: st.top + "%",
            left: st.left + "%",
            width: st.size + "px",
            height: st.size + "px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(230,238,255,.9), rgba(160,180,255,.4) 50%, transparent 72%)",
            animation: `nx-tw ${st.dur}s ease-in-out ${st.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
