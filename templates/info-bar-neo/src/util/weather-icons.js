// The 8 (9 with the two nights) SVGs of the weather widget, as text, keyed by file name: 'clear-day', 'rain'...
const files = import.meta.glob('../assets/weather/*.svg', { query: '?raw', import: 'default', eager: true });

export default Object.keys(files).reduce((all, path) => {
  const name = path.replace(/^.*\//, '').replace(/\.svg$/, '');
  return { ...all, [name]: files[path] };
}, {});
