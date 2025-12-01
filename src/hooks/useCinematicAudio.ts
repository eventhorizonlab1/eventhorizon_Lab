import { useMemo } from 'react';
import useSound from 'use-sound';
import { useCinematic } from '../../context/CinematicContext';

// Relative paths from public folder
const SOUNDS = {
    hover: '/assets/sounds/hover.mp3',
    click: '/assets/sounds/click.mp3',
};

export const useCinematicAudio = () => {
    const { isMuted } = useCinematic();

    // Load sounds (volume managed here, but playback blocked below if muted)
    const [playHover] = useSound(SOUNDS.hover, { volume: 0.15, interrupt: true });
    const [playClick] = useSound(SOUNDS.click, { volume: 0.3 });

    const playSound = useMemo(() => ({
        playHover: () => {
            if (!isMuted) playHover();
        },
        playClick: () => {
            if (!isMuted) playClick();
        },
    }), [playHover, playClick, isMuted]);

    return playSound;
};
