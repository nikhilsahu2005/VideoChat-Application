// setup.js
import process from 'process';
import { Buffer } from 'buffer';

// Polyfill process
if (typeof window !== 'undefined') {
  window.process = process;
}

// Polyfill Buffer
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}
