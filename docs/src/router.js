import { renderDocsLayout, docPages } from './pages/docs/layout.js';

const appContainer = document.getElementById('app');

export const navigate = (path) => {
    if (window.location.pathname === path) return;
    window.history.pushState({}, '', path);
    handleLocation();
};

