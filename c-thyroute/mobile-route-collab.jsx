// mobile-route-collab.jsx — Co-pilot collaboration layer for the mobile Rota
// screen. Wraps useRouteEdits and adds:
//
//   • collaborators[]  — { id, name, initials, color }
//   • me               — current user id
//   • note author      — every saved note remembers who wrote it
//   • votes            — per-POI "love this stop" up-vote per collaborator
//
// Persists to localStorage independently of useRouteEdits so the route-edit
// state stays compatible with the web side. Same destCode key, different
// suffix.

const COLLAB_COLORS = ['#C5A059', '#0053A5', '#1E8E5A', '#B7312C', '#7A4988', '#0A6E8C'];

function initialsOf(name) {
  return (name || '')
    .split(/\s+/).filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || '')
    .join('') || '?';
}

function colorForName(name) {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return COLLAB_COLORS[hash % COLLAB_COLORS.length];
}

function useRouteCollab(destCode, baseEdits) {
  const key = `thy.collab.${destCode}`;
  const initial = React.useMemo(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return {
      v: 1,
      me: 'AK',
      co: [
        { id: 'AK', name: 'Ahmet Kaya',  initials: 'AK', color: '#C5A059' },
        { id: 'SY', name: 'Selin Yıldız', initials: 'SY', color: '#0053A5' },
        { id: 'MD', name: 'Mert Demir',   initials: 'MD', color: '#1E8E5A' },
      ],
      // note authors: { poiId: collaboratorId }
      na: {},
      // votes: { poiId: [collaboratorId, …] }
      vt: {},
      // pilot id (mock realtime room code)
      pid: 'TK-' + destCode + '-' + Math.random().toString(36).slice(2, 6).toUpperCase(),
    };
  }, [destCode]);
  const [state, setState] = React.useState(initial);

  React.useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch (_) {}
  }, [key, state]);

  const me = state.co.find(c => c.id === state.me) || state.co[0];

  // Wrap baseEdits.addNote / deleteNote so author is captured alongside text.
  const wrappedAddNote = React.useCallback((poiId, text) => {
    baseEdits?.addNote?.(poiId, text);
    setState(s => ({ ...s, na: { ...s.na, [poiId]: s.me } }));
  }, [baseEdits]);

  const wrappedDeleteNote = React.useCallback((poiId) => {
    baseEdits?.deleteNote?.(poiId);
    setState(s => {
      const na = { ...s.na }; delete na[poiId];
      return { ...s, na };
    });
  }, [baseEdits]);

  const getNoteAuthor = (poiId) =>
    state.co.find(c => c.id === state.na[poiId]) || null;

  const getVotes = (poiId) => (state.vt?.[poiId] || []);
  const hasVoted = (poiId) => (state.vt?.[poiId] || []).includes(state.me);
  const toggleVote = (poiId) => setState(s => {
    const list = s.vt?.[poiId] || [];
    const next = list.includes(s.me) ? list.filter(x => x !== s.me) : [...list, s.me];
    return { ...s, vt: { ...s.vt, [poiId]: next } };
  });

  const addCollaborator = (name) => setState(s => {
    if (!name) return s;
    const id = (initialsOf(name) + Math.random().toString(36).slice(2, 4)).toUpperCase();
    return {
      ...s,
      co: [...s.co, { id, name, initials: initialsOf(name), color: colorForName(name) }],
    };
  });

  const setMe = (id) => setState(s => ({ ...s, me: id }));

  return {
    me, collaborators: state.co, pilotId: state.pid,
    // wrapped notes
    addNote: wrappedAddNote, deleteNote: wrappedDeleteNote,
    getNoteAuthor,
    // votes
    getVotes, hasVoted, toggleVote,
    // collaborators
    addCollaborator, setMe,
  };
}

Object.assign(window, {
  useRouteCollab, initialsOf, colorForName, COLLAB_COLORS,
});
