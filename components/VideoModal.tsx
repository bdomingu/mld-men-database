import { useEffect, useRef } from "react";
import ReactModal from 'react-modal';
import styles from './VideoModal.module.css';
import Player from '@vimeo/player';

ReactModal.setAppElement('body');

interface VideoModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    videoUrl: string;
    videoTitle: string;
}

const VideoModal: React.FC<VideoModalProps> = ({
    isOpen,
    onRequestClose,
    videoUrl,
    videoTitle,
}) => {
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    useEffect(() => {
        if (isOpen && iframeRef.current) {
            const player = new Player(iframeRef.current);

            // Wait a short moment before unmuting and playing
            player.setVolume(1).catch(console.error);
            player.play().catch(console.error);
        }
    }, [isOpen]);

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName={styles.overlay}
            className={styles.modalContent}
            contentLabel="Video Modal"
        >
            <button className={styles.closeButton} onClick={onRequestClose}>&times;</button>
            <div className={styles.videoWrapper}>
                <iframe
                    ref={iframeRef}
                    src={videoUrl}
                    width="100%"
                    height="450"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    title={videoTitle}
                />
            </div>
        </ReactModal>
    );
};

export default VideoModal;
