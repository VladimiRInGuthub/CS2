import React from 'react';

const CoinIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <circle cx="256" cy="256" r="246" fill="#F2A007" stroke="#F7C948" strokeWidth="20" />
    <circle cx="256" cy="256" r="200" fill="#F6B020" />
    <path d="M256 120v272" stroke="#E88F00" strokeWidth="28" strokeLinecap="round" />
    <path d="M194 192c0-40 30-72 86-72 52 0 86 27 86 70 0 81-172 46-172 126 0 36 32 62 86 62 50 0 86-23 86-66" stroke="#FFE99A" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default CoinIcon;


