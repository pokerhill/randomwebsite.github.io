import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

function ScrollToTop() {
    const { pathname, state } = useLocation();
    const action = useNavigationType();

    useEffect(() => {
        // If action is POP (browser back) OR if specific state requested to keep scroll
        if (action !== 'POP' && !state?.keepScroll) {
            window.scrollTo(0, 0);
        }
    }, [action, pathname, state]);

    return null;
}

export default ScrollToTop;
