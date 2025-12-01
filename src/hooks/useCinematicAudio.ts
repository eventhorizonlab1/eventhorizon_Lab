import useSound from 'use-sound';
    }, []);

return {
    playHover: () => safePlay(playHover),
    playClick: () => safePlay(playClick),
    playAmbience: () => safePlay(playAmbience),
    stopAmbience,
};
};
