import React, { useEffect, useState } from 'react';

const PixelTracker = () => {
    const [configs, setConfigs] = useState({ pixels: [], events: [], scripts: [] });
    const [loaded, setLoaded] = useState(false);

    // 1. Fetch Configuration on Mount
    useEffect(() => {
        const fetchPixels = async () => {
            try {
                const res = await fetch('/api/pixel/active'); // Public Endpoint
                const data = await res.json();
                setConfigs(data);
                injectBasePixels(data.pixels);
                injectCustomScripts(data.scripts);
                setLoaded(true);
            } catch (error) {
                console.error("Pixel Tracker Failed:", error);
            }
        };
        fetchPixels();
    }, []);

    // 2. Track Page Views (Native Window Events)
    useEffect(() => {
        if (!loaded) return;

        // Track initial load
        trackEvent('page_view', window.location.pathname);

        // Track history changes (pushState/replaceState) for SPA
        const originalPushState = history.pushState;
        history.pushState = function () {
            originalPushState.apply(this, arguments);
            trackEvent('page_view', window.location.pathname);
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function () {
            originalReplaceState.apply(this, arguments);
            trackEvent('page_view', window.location.pathname);
        };

        window.addEventListener('popstate', () => {
            trackEvent('page_view', window.location.pathname);
        });

    }, [loaded]);

    // 3. Track Clicks & Submits (Global Delegation)
    useEffect(() => {
        if (!loaded) return;

        const handleClick = (e) => {
            // Check if clicked element or parent matches any trigger
            handleGlobalEvent('click', e.target);
        };

        const handleSubmit = (e) => {
            handleGlobalEvent('form_submit', e.target);
        };

        document.addEventListener('click', handleClick);
        document.addEventListener('submit', handleSubmit);

        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('submit', handleSubmit);
        };
    }, [loaded, configs]);

    // --- Helpers ---

    const injectBasePixels = (pixels) => {
        if (!pixels) return;
        pixels.forEach(p => {
            if (p.platform === 'facebook' && p.pixel_id) {
                injectFacebook(p.pixel_id);
            } else if (p.platform === 'google-analytics' && p.pixel_id) {
                injectGA4(p.pixel_id);
            }
        });
    };

    const injectCustomScripts = (scripts) => {
        if (!scripts) return;
        scripts.forEach(s => {
            const script = document.createElement('script');
            script.innerHTML = s.script_content;
            if (s.placement === 'header') document.head.appendChild(script);
            else document.body.appendChild(script);
        });
    };

    const trackEvent = (type, value) => {
        // Find matching rules
        const rules = configs.events.filter(e => e.trigger_type === type);

        rules.forEach(rule => {
            // Check Match
            let match = false;
            if (type === 'page_view') {
                if (rule.trigger_value === '*' || rule.trigger_value === value || value.includes(rule.trigger_value)) match = true;
            } else {
                if (rule.trigger_value.startsWith('.')) {
                    if (value.classList && value.classList.contains(rule.trigger_value.substring(1))) match = true;
                } else if (rule.trigger_value.startsWith('#')) {
                    if (value.id === rule.trigger_value.substring(1)) match = true;
                }
            }

            if (match && rule.actions) {
                rule.actions.forEach(action => {
                    firePlatformEvent(action.platform, action.event, action.params);
                    logEvent(rule.name, action.platform, action.event);
                });
            }
        });

        // Always fire standard PageView if type is page_view
        if (type === 'page_view') {
            if (window.fbq) window.fbq('track', 'PageView');
            if (window.gtag) window.gtag('event', 'page_view');
        }
    };

    const handleGlobalEvent = (type, target) => {
        trackEvent(type, target);
    };

    const firePlatformEvent = (platform, eventName, params = {}) => {
        try {
            if (platform === 'facebook' && window.fbq) window.fbq('track', eventName, params);
            if (platform === 'google-analytics' && window.gtag) window.gtag('event', eventName, params);
        } catch (e) {
            console.error("Fire Error", e);
        }
    };

    const logEvent = async (ruleName, platform, eventName) => {
        try {
            await fetch('/api/pixel/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event_name: eventName,
                    platform: platform,
                    status: 'success',
                    url: window.location.href,
                    details: { rule: ruleName }
                })
            });
        } catch (e) { }
    };

    // --- Script Templates ---

    const injectFacebook = (id) => {
        if (window.fbq) return;
        !function (f, b, e, v, n, t, s) {
            if (f.fbq) return; n = f.fbq = function () {
                n.callMethod ?
                    n.callMethod.apply(n, arguments) : n.queue.push(arguments)
            };
            if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
            n.queue = []; t = b.createElement(e); t.async = !0;
            t.src = v; s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s)
        }(window, document, 'script',
            'https://connect.facebook.net/en_US/fbevents.js');
        window.fbq('init', id);
    };

    const injectGA4 = (id) => {
        if (window.gtag) return;
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', id);
    };

    return null;
};

export default PixelTracker;
