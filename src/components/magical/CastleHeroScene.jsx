import React from "react";

export default function CastleHeroScene() {
  return (
    <div className="castle-hero-scene-container" style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          {/* Sky Gradient */}
          <linearGradient id="skyGrad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#050811" />
            <stop offset="45%" stopColor="#0B1020" />
            <stop offset="80%" stopColor="#151D35" />
            <stop offset="100%" stopColor="#1E2A4D" />
          </linearGradient>

          {/* Golden Window Light */}
          <radialGradient id="windowGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE89E" />
            <stop offset="50%" stopColor="#E5B25D" />
            <stop offset="100%" stopColor="#966418" />
          </radialGradient>

          {/* Moon Glow */}
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDFBF5" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#F6F0E4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#D6B46A" stopOpacity="0" />
          </radialGradient>

          {/* Water Reflection */}
          <linearGradient id="waterGrad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#10182E" />
            <stop offset="40%" stopColor="#0B1020" />
            <stop offset="100%" stopColor="#060A14" />
          </linearGradient>

          {/* Mist Gradient */}
          <linearGradient id="mistGrad1" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#151D35" stopOpacity="0" />
            <stop offset="25%" stopColor="#26345C" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#3A4D7D" stopOpacity="0.5" />
            <stop offset="75%" stopColor="#26345C" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#151D35" stopOpacity="0" />
          </linearGradient>

          {/* Window Blur Filter */}
          <filter id="bloom" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Deep Midnight Sky */}
        <rect width="1600" height="900" fill="url(#skyGrad)" />

        {/* 2. Moon & Celestial Halo */}
        <circle cx="1240" cy="180" r="110" fill="url(#moonGlow)" />
        <circle cx="1240" cy="180" r="42" fill="#FDF7E7" />
        <circle cx="1255" cy="172" r="38" fill="#0E1428" opacity="0.92" />

        {/* 3. Twinkling Stars */}
        <g opacity="0.75">
          <circle cx="140" cy="80" r="1.5" fill="#FFFFFF" opacity="0.9" />
          <circle cx="280" cy="140" r="1" fill="#F6F0E4" opacity="0.6" />
          <circle cx="420" cy="70" r="2" fill="#FFFFFF" opacity="0.8" />
          <circle cx="560" cy="120" r="1" fill="#D6B46A" opacity="0.7" />
          <circle cx="700" cy="60" r="1.5" fill="#FFFFFF" opacity="0.9" />
          <circle cx="860" cy="110" r="1.2" fill="#F6F0E4" opacity="0.7" />
          <circle cx="1020" cy="80" r="1.8" fill="#FFFFFF" opacity="0.85" />
          <circle cx="1140" cy="130" r="1" fill="#FFFFFF" opacity="0.5" />
          <circle cx="1400" cy="90" r="1.5" fill="#D6B46A" opacity="0.8" />
          <circle cx="1520" cy="150" r="1" fill="#FFFFFF" opacity="0.6" />
          <circle cx="320" cy="220" r="1.5" fill="#FFFFFF" opacity="0.75" />
          <circle cx="820" cy="200" r="1.2" fill="#FFFFFF" opacity="0.6" />
          <circle cx="1360" cy="240" r="2" fill="#FFFFFF" opacity="0.9" />
        </g>

        {/* 4. Distant Mountain Silhouettes */}
        <path
          d="M0 580 L180 500 L390 540 L620 460 L850 510 L1080 440 L1320 500 L1500 460 L1600 520 L1600 700 L0 700 Z"
          fill="#080C17"
          opacity="0.9"
        />
        <path
          d="M0 620 L240 560 L480 610 L780 540 L1020 590 L1260 530 L1480 580 L1600 560 L1600 720 L0 720 Z"
          fill="#0C1222"
        />

        {/* 5. Majestic Academy Castle Complex */}
        {/* Foundation Cliffs */}
        <path
          d="M340 680 L440 590 L520 600 L580 560 L700 570 L860 550 L1040 580 L1180 550 L1260 610 L1340 690 L340 690 Z"
          fill="#070A14"
        />

        {/* Viaduct Bridge arches across the gorge */}
        <g fill="#0A0E1A">
          <path d="M260 620 L480 600 L480 640 L260 640 Z" />
          <path d="M280 640 A25 25 0 0 1 330 640 L330 680 L280 680 Z" />
          <path d="M340 640 A25 25 0 0 1 390 640 L390 680 L340 680 Z" />
          <path d="M400 640 A25 25 0 0 1 450 640 L450 680 L400 680 Z" />
        </g>

        {/* Main Castle Silhouette & Towers */}
        <g fill="#0A0E1C">
          {/* Left Wing & Spires */}
          <rect x="520" y="440" width="110" height="150" />
          <polygon points="510,440 575,310 640,440" /> {/* Scribe Spire */}
          <polygon points="565,310 575,270 585,310" />
          <rect x="470" y="490" width="60" height="90" />
          <polygon points="465,490 500,410 535,490" />

          {/* Central Great Keep */}
          <rect x="630" y="380" width="180" height="200" />
          {/* Battlements / Crenelations */}
          <path d="M630 380 L630 370 L650 370 L650 380 L670 380 L670 370 L690 370 L690 380 L710 380 L710 370 L730 370 L730 380 L750 380 L750 370 L770 370 L770 380 L790 380 L790 370 L810 370 L810 380 Z" />
          
          {/* High Clocktower */}
          <rect x="690" y="270" width="65" height="110" />
          <polygon points="680,270 722,170 765,270" />
          <line x1="722" y1="170" x2="722" y2="140" stroke="#D6B46A" strokeWidth="2" />
          <circle cx="722" cy="140" r="3" fill="#D6B46A" />

          {/* Great Hall Sloped Roof & Flèches */}
          <polygon points="810,460 970,410 970,580 810,580" />
          <polygon points="850,445 855,395 860,445" />
          <polygon points="900,430 905,380 910,430" />
          <polygon points="950,415 955,365 960,415" />

          {/* Astronomy Spire (Tallest Pinnacle Right) */}
          <rect x="980" y="330" width="85" height="240" />
          <polygon points="970,330 1022,180 1075,330" />
          {/* Observatory Turret */}
          <circle cx="1022" cy="180" r="22" fill="#0A0E1C" />
          <polygon points="1010,165 1022,105 1034,165" />
          <line x1="1022" y1="105" x2="1022" y2="85" stroke="#D6B46A" strokeWidth="2" />
          <circle cx="1022" cy="85" r="4" fill="#D6B46A" />

          {/* Right Spires & Cloisters */}
          <rect x="1065" y="450" width="75" height="120" />
          <polygon points="1060,450 1102,360 1145,450" />
          <rect x="1140" y="490" width="55" height="90" />
          <polygon points="1135,490 1167,420 1200,490" />
        </g>

        {/* 6. Warm Glowing Gothic Arched Windows */}
        <g fill="url(#windowGlowGrad)" filter="url(#bloom)" className="anim-window-pulse">
          {/* Great Hall Large Windows */}
          <path d="M835 480 A8 8 0 0 1 851 480 L851 540 L835 540 Z" />
          <path d="M865 470 A8 8 0 0 1 881 470 L881 540 L865 540 Z" />
          <path d="M895 460 A8 8 0 0 1 911 460 L911 540 L895 540 Z" />
          <path d="M925 450 A8 8 0 0 1 941 450 L941 540 L925 540 Z" />
          <path d="M955 440 A8 8 0 0 1 971 440 L971 540 L955 540 Z" />

          {/* Clocktower Rose Window & Slits */}
          <circle cx="722" cy="305" r="10" />
          <path d="M718 330 A4 4 0 0 1 726 330 L726 355 L718 355 Z" />

          {/* Astronomy Spire Upper Chamber Windows */}
          <path d="M1005 240 A5 5 0 0 1 1015 240 L1015 260 L1005 260 Z" />
          <path d="M1025 240 A5 5 0 0 1 1035 240 L1035 260 L1025 260 Z" />
          <path d="M1010 360 A6 6 0 0 1 1022 360 L1022 390 L1010 390 Z" />
          <path d="M1032 360 A6 6 0 0 1 1044 360 L1044 390 L1032 390 Z" />

          {/* Keep Windows */}
          <path d="M655 410 A5 5 0 0 1 665 410 L665 435 L655 435 Z" />
          <path d="M685 410 A5 5 0 0 1 695 410 L695 435 L685 435 Z" />
          <path d="M750 410 A5 5 0 0 1 760 410 L760 435 L750 435 Z" />
          <path d="M780 410 A5 5 0 0 1 790 410 L790 435 L780 435 Z" />

          {/* Scribe Spire Windows */}
          <path d="M565 370 A4 4 0 0 1 575 370 L575 395 L565 395 Z" />
          <path d="M555 460 A5 5 0 0 1 565 460 L565 490 L555 490 Z" />
          <path d="M585 460 A5 5 0 0 1 595 460 L595 490 L585 490 Z" />
        </g>

        {/* 7. The Great Black Lake & Water Reflection */}
        <rect x="0" y="685" width="1600" height="215" fill="url(#waterGrad)" />
        {/* Subtle Water Reflections */}
        <g opacity="0.4" filter="url(#bloom)">
          <ellipse cx="890" cy="740" rx="90" ry="8" fill="#FFE89E" opacity="0.4" />
          <ellipse cx="722" cy="750" rx="40" ry="5" fill="#FFE89E" opacity="0.5" />
          <ellipse cx="1022" cy="745" rx="50" ry="6" fill="#FFE89E" opacity="0.35" />
          <ellipse cx="1240" cy="770" rx="70" ry="10" fill="#FDF7E7" opacity="0.3" />
        </g>

        {/* 8. Drifting Mist Layers */}
        <g style={{ animation: "mistDriftLeft 24s ease-in-out infinite" }}>
          <ellipse cx="600" cy="650" rx="450" ry="45" fill="url(#mistGrad1)" />
        </g>
        <g style={{ animation: "mistDriftRight 28s ease-in-out infinite" }}>
          <ellipse cx="1100" cy="670" rx="550" ry="50" fill="url(#mistGrad1)" />
        </g>

        {/* 9. Foreground Balcony & Ancient Pines Silhouettes */}
        <path
          d="M0 900 L0 730 L80 690 L180 770 L280 720 L350 780 L420 740 L500 810 L500 900 Z"
          fill="#04060C"
        />
        <path
          d="M1600 900 L1600 740 L1520 710 L1440 760 L1360 700 L1280 770 L1200 730 L1120 820 L1120 900 Z"
          fill="#04060C"
        />

        {/* Balustrade Stone Railing on Bottom */}
        <g fill="#060912">
          <rect x="0" y="870" width="1600" height="30" />
          <rect x="0" y="855" width="1600" height="15" />
          {/* Balusters */}
          <g fill="#080C16">
            <rect x="60" y="870" width="16" height="30" />
            <rect x="180" y="870" width="16" height="30" />
            <rect x="300" y="870" width="16" height="30" />
            <rect x="420" y="870" width="16" height="30" />
            <rect x="1180" y="870" width="16" height="30" />
            <rect x="1300" y="870" width="16" height="30" />
            <rect x="1420" y="870" width="16" height="30" />
            <rect x="1540" y="870" width="16" height="30" />
          </g>
        </g>
      </svg>
    </div>
  );
}
