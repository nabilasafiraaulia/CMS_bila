export function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function animate(el, keyframes, options) {
    if (!el || prefersReducedMotion()) return null;
    return el.animate(keyframes, options);
}

export function popIn(el) {
    return animate(el, [
        { transform: 'scale(0.92)', opacity: 0.7 },
        { transform: 'scale(1)', opacity: 1 }
    ], {
        duration: 200,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        fill: 'forwards'
    });
}

export function toastSlideIn(el) {
    return animate(el, [
        { transform: 'translateX(120%)', opacity: 0 },
        { transform: 'translateX(0)', opacity: 1 }
    ], {
        duration: 350,
        easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        fill: 'forwards'
    });
}

export function toastSlideOut(el) {
    return animate(el, [
        { transform: 'translateX(0)', opacity: 1 },
        { transform: 'translateX(120%)', opacity: 0 }
    ], {
        duration: 300,
        easing: 'ease-in',
        fill: 'forwards'
    });
}

export function fadeIn(el, duration = 300) {
    return animate(el, [
        { opacity: 0 },
        { opacity: 1 }
    ], {
        duration,
        easing: 'ease-out',
        fill: 'forwards'
    });
}

export function staggerEnter(elements, baseDelay = 80) {
    if (!elements || elements.length === 0) return;
    elements.forEach((el, index) => {
        animate(el, [
            { transform: 'translateY(25px)', opacity: 0 },
            { transform: 'translateY(0)', opacity: 1 }
        ], {
            duration: 400,
            easing: 'ease-out',
            fill: 'forwards',
            delay: index * baseDelay
        });
    });
}
