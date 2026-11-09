/* ==================================================================== */
/*  <Island name="..." props={...} /> — places an interactive section      */
/*  built in /islands (Vite + React + TypeScript + Tailwind) on any page.  */
/*  Needs on the page, before this file:                                  */
/*    <link rel="stylesheet" href="islands-dist/islands.css">             */
/*    <script src="islands-dist/islands.js"></script>                     */
/*  The island renders in its own React root inside this element (same    */
/*  React copy as the page), with scoped Tailwind (class "tw").           */
/* ==================================================================== */
function Island({ name, props, className = '', minHeight }) {
  const ref = React.useRef(null);
  const key = JSON.stringify(props || {});
  React.useEffect(() => {
    const api = window.IntigrisIslands;
    if (!api || !ref.current) { console.warn('[islands] bundle not loaded; add islands-dist/islands.js to this page'); return; }
    return api.mount(name, ref.current, props || {});
  }, [name, key, window.__lang]);
  return <div ref={ref} className={'island ' + className} data-island={name} style={minHeight ? { minHeight } : null} />;
}

Object.assign(window, { Island });
