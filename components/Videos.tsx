import { useState, useRef, useEffect} from 'react';
import styles from './Videos.module.css';
import ReactLoading from 'react-loading';
import VideoModal from './VideoModal';
import Player from '@vimeo/player';


  export interface Video {
    resource_key: string;
    pictures: {
      base_link: string;
    };
    player_embed_url: string;
    name: string;
  }

  interface VideosProps {
    videos: Video[];
    isVideoLoading: boolean;
  }
  
  const Videos: React.FC<VideosProps> = ({ videos, isVideoLoading}) => {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [activeVideo, setActiveVideo] = useState<string | null>(null)
    
    const [iframeLoadedMap, setIframeLoadedMap] = useState<Record<string, boolean>>({});

    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const playerRef = useRef<Player | null>(null);

    const openModal = (video: Video): void => {
      setSelectedVideo(video);
      setModalIsOpen(true);
    };
    
    const closeModal = (): void => {
      setModalIsOpen(false);
      setSelectedVideo(null);
    };

    const handleMouseEnter = (embedUrl: string) => {
      setActiveVideo(embedUrl);
      setIframeLoadedMap(prev => ({ ...prev, [embedUrl]: false }));
    };

    const handleMouseLeave = () => {
      if (playerRef.current) {
        playerRef.current.pause().catch((error) => {
          console.error("Error pausing the video:", error);
        });
      }
      // Remove the iframe by clearing the active video.
      setActiveVideo(null);
    };

    return (
        <div className={styles.container}>
            {isVideoLoading ? (
                <div className={styles.loading}>
                    <ReactLoading type="bubbles" color="#146DA6" height={200} width={100}/>
                </div>

            ): (
                <>
                 {videos.map((video: any) =>  {
                    const hoverEmbedUrl = `${video.player_embed_url}?autoplay=1&muted=1&background=1`;

                    return (
                    <>
                    <div className={styles.card} key={video.resource_key} >

                    <div
                      className={styles.thumbnail}
                      onClick={() => openModal(video)}
                      onMouseEnter={() => handleMouseEnter(hoverEmbedUrl)}
                      onMouseLeave={handleMouseLeave}
                    >
                    {activeVideo === hoverEmbedUrl ? (
                           <div className={styles.previewWrapper}>
                           {!iframeLoadedMap[hoverEmbedUrl] && (
                             <>
                               <img
                                 src={video.pictures.base_link}
                                 alt={video.name}
                                 className={styles.thumbnailImage}
                               />
                               <div className={styles.spinnerOverlay}>
                                 <ReactLoading type="spin" color="#ffffff" height={40} width={40} />
                               </div>
                             </>
                           )}
                          <iframe
                          ref={iframeRef} // Attach the iframe DOM element to the ref
                          src={hoverEmbedUrl}
                          width="100%"
                          height="auto"
                          allow="autoplay; fullscreen"
                          allowFullScreen
                          loading="lazy"
                          title={video.name}
                          onLoad={() => {
                            setIframeLoadedMap(prev => ({ ...prev, [hoverEmbedUrl]: true }));

                            if (iframeRef.current && !playerRef.current) {
                              playerRef.current = new Player(iframeRef.current);
                            }
                          }}
                          // Also pause on mouse leave if the pointer exits the iframe area.
                          onMouseLeave={handleMouseLeave}
                          className={`${styles.iframePreview} ${iframeLoadedMap[hoverEmbedUrl] ? styles.iframeLoaded : ''}`}
                          />
                          </div>
                        ) : (
                            <img 
                            src={video.pictures.base_link}
                            alt={video.name}
                            onMouseEnter={() => handleMouseEnter(hoverEmbedUrl)}
                            onMouseLeave={handleMouseLeave}
                            className={styles.thumbnailImage}
                        />
                        )}
                    </div>
                    <div className={styles.content}>
                        <h3>{video.name}</h3>
                    </div>
                    </div>
                    </>
                    );
                })}    
                </>
            )}
        {selectedVideo && (
        <VideoModal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          videoUrl={`${selectedVideo.player_embed_url}?autoplay=1&muted=0`}
          videoTitle={selectedVideo.name}
        />
      )}
        </div>
    );
};

export default Videos;