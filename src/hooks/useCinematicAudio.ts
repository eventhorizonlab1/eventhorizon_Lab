import useSound from 'use-sound';
import { useCallback } from 'react';



interface CinematicAudio {
    playHover: () => void;
    playClick: () => void;
    playAmbience: () => void;
    stopAmbience: () => void;
}

export const useCinematicAudio = (): CinematicAudio => {
    // Volume settings can be adjusted here
    const [playHover] = useSound('/assets/sounds/hover.mp3', { volume: 0.25 });
    const [playClick] = useSound('/assets/sounds/click.mp3', { volume: 0.5 });
    const [playAmbience, { stop: stopAmbience }] = useSound('/assets/sounds/ambience.mp3', {
        volume: 0.1,
        loop: true,
        interrupt: true
    });

    const safePlay = useCallback((playFn: () => void) => {
        try {
            playFn();
        } catch (e) {
            // Ignore errors if sound files are missing
            // console.warn("Audio file missing or blocked");
        }
    }, []);

    return {
        playHover: () => safePlay(playHover),
        playClick: () => safePlay(playClick),
        playAmbience: () => safePlay(playAmbience),
        stopAmbience,
    };
};
