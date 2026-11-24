// Versi build (diisi index.html dari assets/build.json) supaya file baru selalu diambil setelah deploy.
export const asset = p => (window.__BUILD ? p + '?v=' + encodeURIComponent(window.__BUILD) : p);
