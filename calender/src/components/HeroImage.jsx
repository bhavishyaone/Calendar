const MONTHS = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
];

// Curated Unsplash scenic photos — one per month
const MONTH_PHOTOS = [
  'https://images.unsplash.com/photo-1551632811-561732d1e306?w=900&q=80', // Jan – mountain climber
  'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?w=900&q=80', // Feb – snowy pine forest
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80', // Mar – forest mist
  'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=900&q=80', // Apr – cherry blossom
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&q=80', // May – green valley
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80', // Jun – tropical beach
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80', // Jul – mountain summit
  'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=900&q=80', // Aug – ocean cliffs
  'https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&q=80', // Sep – autumn forest
  'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=900&q=80', // Oct – foggy forest
  'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=900&q=80', // Nov – winter landscape
  'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=900&q=80', // Dec – snowy cabin
];

/**
 * HeroImage — Wall calendar top section.
 * Matches the reference: scenic photo + blue double-chevron divider + month/year overlay.
 */
const HeroImage = ({ month = new Date().getMonth(), year = new Date().getFullYear() }) => {
  const photoUrl = MONTH_PHOTOS[month];
  const monthName = MONTHS[month].toUpperCase();
  // Calendar accent blue — matches the reference image
  const blue = '#1AABE8';

  return (
    <div className="relative w-full" style={{ height: '320px', overflow: 'hidden' }}>
      {/* ── Hero Photo ── */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${photoUrl})` }}
      />

      {/* ── Blue Double-Chevron Divider (SVG absolute over photo bottom) ── */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        style={{ height: '110px', display: 'block' }}
        viewBox="0 0 1000 110"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/*
          W-shaped chevron:
          Starts at bottom-left → climbs to peak at 22% → dips to valley at 38% →
          climbs to peak at 55% → then sweeps all the way right at ~30% height.
          This exposes two triangular "bites" of the white card body below.
        */}
        <path
          d="M0,110 L0,50 L220,110 L380,18 L550,110 L1000,30 L1000,110 Z"
          fill={blue}
        />
      </svg>

      {/* ── Month + Year text on the right blue area ── */}
      <div className="absolute bottom-4 right-8 text-right leading-none" style={{ zIndex: 10 }}>
        <p className="text-white font-medium mb-1" style={{ fontSize: '1.1rem', opacity: 0.9 }}>
          {year}
        </p>
        <h2 className="text-white font-extrabold uppercase tracking-wide" style={{ fontSize: '2.2rem' }}>
          {monthName}
        </h2>
      </div>
    </div>
  );
};

export default HeroImage;
