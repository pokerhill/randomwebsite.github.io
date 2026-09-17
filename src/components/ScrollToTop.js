import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

function ScrollToTop() {
    const { pathname, hash, state } = useLocation();
    const action = useNavigationType();

    useEffect(() => {
        // A hash means "jump to this section" (e.g. nav/footer links to a specific
        // ORA variant) — that takes priority over the usual top-of-page reset.
        // Centred rather than pinned to the top: these targets sit inside a much
        // taller shared board, so "start" left them flush under the fixed nav with
        // most of the section's own content below the fold. The target route may
        // not have painted yet on the same tick, so this waits a frame first.
        if (hash) {
            const id = hash.slice(1);
            const frame = requestAnimationFrame(() => {
                document.getElementById(id)?.scrollIntoView({ block: 'center' });
            });
            return () => cancelAnimationFrame(frame);
        }

        // If action is POP (browser back) OR if specific state requested to keep scroll
        if (action !== 'POP' && !state?.keepScroll) {
            window.scrollTo(0, 0);
        }
        return undefined;
    }, [action, pathname, hash, state]);

    return null;
}

export default ScrollToTop;
