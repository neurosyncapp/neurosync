import { Buffer } from 'buffer';
// web3.js expects Node globals in the browser.
window.Buffer = window.Buffer || Buffer;
window.global = window.global || window;

