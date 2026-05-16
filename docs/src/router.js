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
