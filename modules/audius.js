/* @8spine-meta
 * type: MODULE
 * category: modules
 */

// Audius public API: independent artists, full-length streams, no account.

const BASE = 'https://api.audius.co/v1';
const APP = 'Backroom';

async function searchTracks(query, limit) {
    const n = Math.max(1, Math.min(limit || 20, 50));
    const res = await fetch(BASE + '/tracks/search?query=' + encodeURIComponent(String(query || '')) + '&limit=' + n + '&app_name=' + APP);
    if (!res.ok) throw new Error('Audius search failed: HTTP ' + res.status);
    const j = await res.json();
    const tracks = (j.data || []).filter(function (t) { return t.id && t.title && t.is_streamable !== false; }).map(function (t) {
        const art = t.artwork || {};
        return {
            id: String(t.id),
            title: t.title,
            artist: (t.user && t.user.name) || '',
            album: t.album_name || undefined,
            duration: t.duration,
            artwork: art['1000x1000'] || art['480x480'] || undefined,
        };
    });
    return { tracks: tracks, total: tracks.length };
}

async function getTrackStreamUrl(trackId) {
    const url = BASE + '/tracks/' + encodeURIComponent(String(trackId)) + '/stream?app_name=' + APP;
    return { streamUrl: url, track: { id: String(trackId) } };
}

return {
    id: 'audius',
    name: 'Audius',
    version: '1.0.0',
    type: 'MODULE',
    description: 'Independent artists on Audius: search and full-length playback.',
    searchTracks: searchTracks,
    getTrackStreamUrl: getTrackStreamUrl,
};
