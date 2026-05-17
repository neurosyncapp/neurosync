import { renderDocsLayout, docPages } from './pages/docs/layout.js';

const appContainer = document.getElementById('app');

export const navigate = (path) => {
    if (window.location.pathname === path) return;
    window.history.pushState({}, '', path);
    handleLocation();
};

const handleLocation = async () => {
    const path = window.location.pathname;
    
    const pageId = path === '/' ? 'introduction' : path.substring(1);
    const pageKey = docPages[pageId] ? pageId : 'introduction';
    
    appContainer.innerHTML = await renderDocsLayout(pageKey);
    initializeMobileNav();

    if (window.location.pathname !== getDocPath(pageKey)) {
        window.history.replaceState({}, '', getDocPath(pageKey));
    }
    
    window.scrollTo(0, 0);
};

const getDocPath = (id) => `/${id}`;

const initializeMobileNav = () => {
    const trigger = document.getElementById('docs-mobile-trigger');
    const close = document.getElementById('docs-mobile-close');
    const overlay = document.getElementById('docs-mobile-overlay');
    const panel = document.getElementById('docs-mobile-panel');

    if (!trigger || !close || !overlay || !panel) return;

    const openPanel = () => {
        panel.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
    };

    const closePanel = () => {
        panel.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
    };

    trigger.addEventListener('click', openPanel);
    close.addEventListener('click', closePanel);
    overlay.addEventListener('click', closePanel);
};

export const initializeRouter = () => {
    handleLocation();
    
    window.addEventListener('popstate', handleLocation);

    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link || link.hasAttribute('data-external')) return;
        
        const href = link.getAttribute('href');
        if (!href) return;
        
        const panel = document.getElementById('docs-mobile-panel');
        if (panel && !panel.classList.contains('-translate-x-full')) {
            panel.classList.add('-translate-x-full');
            document.getElementById('docs-mobile-overlay').classList.add('hidden');
        }

        if (href.startsWith('#')) {
