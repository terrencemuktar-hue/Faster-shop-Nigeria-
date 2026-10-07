import React from 'react';

export default function Logo({ size = 'md' }) {
  const dimensions = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-20 h-20' : 'w-12 h-12';

  return (
    <div className="flex items-center gap-2.5">
      <div className={`${dimensions} flex-shrink-0`}>
        <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <rect x="40" y="40" width="432" height="432" rx="96" fill="#0A0A0A" />
          <rect x="64" y="64" width="384" height="384" rx="72" stroke="#FFFFFF" strokeWidth="8" />
          <path d="M128 112H340C355.464 112 368 124.536 368 140C368 155.464 355.464 168 340 168H184V230H312C327.464 230 340 242.536 340 258C340 273.464 327.464 286 312 286H184V384C184 399.464 171.464 412 156 412C140.536 412 128 399.464 128 384V112Z" fill="#FFFFFF" />
          <path d="M280 190C280 167.909 297.909 150 320 150C342.091 150 360 167.909 360 190V208H280V190Z" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
          <path d="M260 208H380L396 400H244L260 208Z" fill="#FFFFFF" />
          <g transform="translate(290, 280) scale(0.6)">
            <path d="M0 0H12L24 40H64L76 12H20" stroke="#0A0A0A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="32" cy="52" r="8" fill="#0A0A0A" />
            <circle cx="60" cy="52" r="8" fill="#0A0A0A" />
          </g>
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-black text-lg tracking-[0.2em] text-white leading-none">FASTER</span>
        <span className="text-[9px] font-medium tracking-[0.25em] text-neutral-400 mt-1 uppercase">Shop Nigeria</span>
      </div>
    </div>
  );
}
