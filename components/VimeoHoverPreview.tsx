// // VimeoHoverPreview.tsx
// import { useRef, useEffect } from 'react';
// import Player from '@vimeo/player';

// type Props = {
//   videoId: any;
//   onClick: () => void;
// };

// const VimeoHoverPreview: React.FC<Props> = ({ videoId, onClick }) => {
//   const iframeRef = useRef<HTMLIFrameElement | null>(null);
//   const playerRef = useRef<any>(null);

//   useEffect(() => {
//     if (iframeRef.current) {
//       playerRef.current = new Player(iframeRef.current, {
//         id: videoId,
//         autoplay: false,
//         muted: true,
//         background: true,
//       });

//       return () => playerRef.current?.destroy();
//     }
//   }, [videoId]);

//   const handleMouseEnter = () => playerRef.current?.play();
//   const handleMouseLeave = () => playerRef.current?.pause();

//   return (
//     <div
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//       onClick={onClick}
//       style={{ cursor: 'pointer' }}
//     >
//       <iframe
//         ref={iframeRef}
//         src={`https://player.vimeo.com/video/${videoId}?background=1`}
//         frameBorder="0"
//         allow="autoplay; fullscreen"
//         allowFullScreen
//         title={`Vimeo Video ${videoId}`}
//         style={{ width: '100%', aspectRatio: '16/9' }}
//       />
//     </div>
//   );
// };

// export default VimeoHoverPreview;
