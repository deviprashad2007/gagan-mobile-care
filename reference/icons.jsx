// Original line-icon set, 24x24 viewBox, stroke-based.
const Icon = ({ name, size = 20, stroke = 1.6, color = 'currentColor', className = '' }) => {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: color, strokeWidth: stroke,
    strokeLinecap: 'round', strokeLinejoin: 'round', className
  };
  switch (name) {
    case 'arrow-right':return (
        <svg {...props}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);

    case 'arrow-left':return (
        <svg {...props}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>);

    case 'arrow-up-right':return (
        <svg {...props}><path d="M7 17 17 7M9 7h8v8" /></svg>);

    case 'check':return (
        <svg {...props}><path d="m5 12 5 5L20 7" /></svg>);

    case 'check-circle':return (
        <svg {...props}><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5L16 9.5" /></svg>);

    case 'pin':return (
        <svg {...props}><path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></svg>);

    case 'package':return (
        <svg {...props}><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z" /><path d="M3 7.5 12 12m0 0 9-4.5M12 12v9" /></svg>);

    case 'phone':return (
        <svg {...props}><rect x="6" y="2" width="12" height="20" rx="3" /><path d="M10 18h4" /></svg>);

    case 'phone-call':return (
        <svg {...props}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A14 14 0 0 1 4 7a3 3 0 0 1 1-3z" /></svg>);

    case 'shield':return (
        <svg {...props}><path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6z" /><path d="m9 12 2 2 4-4" /></svg>);

    case 'spark':return (
        <svg {...props}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" /></svg>);

    case 'star':return (
        <svg {...props} fill={color}><path d="m12 3 2.6 5.6 6 .6-4.6 4.2 1.3 6L12 16.6 6.7 19.4l1.3-6L3.4 9.2l6-.6z" /></svg>);

    case 'search':return (
        <svg {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>);

    case 'close':return (
        <svg {...props}><path d="M6 6 18 18M18 6 6 18" /></svg>);

    case 'menu':return (
        <svg {...props}><path d="M4 7h16M4 12h16M4 17h16" /></svg>);

    case 'chevron-down':return (
        <svg {...props}><path d="m6 9 6 6 6-6" /></svg>);

    case 'chevron-right':return (
        <svg {...props}><path d="m9 6 6 6-6 6" /></svg>);

    case 'plus':return (
        <svg {...props}><path d="M12 5v14M5 12h14" /></svg>);

    case 'minus':return (
        <svg {...props}><path d="M5 12h14" /></svg>);

    case 'truck':return (
        <svg {...props}><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>);

    case 'store':return (
        <svg {...props}><path d="M3 9 5 4h14l2 5" /><path d="M3 9v11h18V9" /><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" /><path d="M9 20v-6h6v6" /></svg>);

    case 'whatsapp':return (
        <svg {...props} style={{ stroke: "rgb(0, 0, 0)" }}><path d="M3 21l1.6-4.5A8 8 0 1 1 7.5 19.4z" style={{ stroke: "rgb(4, 4, 4)" }} /><path d="M9 9c0 4 3 7 6 7l1.5-1.5-2.2-1-1 1c-1.5-.5-2.8-1.8-3.3-3.3l1-1-1-2.2z" fill={color} stroke="none" /></svg>);

    case 'clock':return (
        <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);

    case 'rupee':return (
        <svg {...props}><path d="M7 5h10M7 9h10M9 5c4 0 5 4 1 4H7l8 10" /></svg>);

    case 'wallet':return (
        <svg {...props}><path d="M3 7a2 2 0 0 1 2-2h12v4H5a2 2 0 0 0 0 4h14v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><circle cx="16" cy="13" r="1.2" fill={color} /></svg>);

    case 'sparkle':return (
        <svg {...props}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /></svg>);

    case 'badge':return (
        <svg {...props}><path d="m12 3 2.5 2 3-.5L18 7.5l2 2.5-2 2.5.5 3-3 .5L13 18l-3 3-2.5-2-3 .5L4 16.5 2 14l2-2.5L3.5 8.5l3-.5L8 5z" /><path d="m9 12 2 2 4-4" /></svg>);

    case 'play':return (
        <svg {...props} fill={color}><path d="M7 5v14l12-7z" /></svg>);

    case 'compass':return (
        <svg {...props}><circle cx="12" cy="12" r="9" /><path d="m9 15 1.5-4.5L15 9l-1.5 4.5z" /></svg>);

    case 'download':return (
        <svg {...props}><path d="M12 4v12m-5-5 5 5 5-5M5 20h14" /></svg>);

    case 'box':return (
        <svg {...props}><path d="M3 8 12 4l9 4v8l-9 4-9-4z" /><path d="M3 8 12 12l9-4M12 12v8" /></svg>);

    case 'screen':return (
        <svg {...props}><rect x="6" y="2" width="12" height="20" rx="3" /><path d="m9 8 6 6M15 8l-6 6" stroke={color} /></svg>);

    case 'battery':return (
        <svg {...props}><rect x="3" y="8" width="16" height="8" rx="2" /><path d="M21 11v2" /><path d="M6 11v2" /></svg>);

    case 'cam':return (
        <svg {...props}><rect x="3" y="6" width="18" height="14" rx="2" /><circle cx="12" cy="13" r="4" /><path d="M8 6l1.5-2h5L16 6" /></svg>);

    case 'speaker':return (
        <svg {...props}><path d="M5 9h3l5-4v14l-5-4H5z" /><path d="M16 9c1 1 1 5 0 6" /><path d="M19 7c2 2 2 8 0 10" /></svg>);

    case 'mic':return (
        <svg {...props}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>);

    case 'drop':return (
        <svg {...props}><path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" /></svg>);

    case 'cpu':return (
        <svg {...props}><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></svg>);

    default:return <svg {...props} />;
  }
};

window.Icon = Icon;