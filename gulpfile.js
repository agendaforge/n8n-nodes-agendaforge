const path = require('path');
const { task, src, dest } = require('gulp');

// Copy node/credential SVG icons into dist alongside the compiled JS so n8n can
// resolve `icon: 'file:agendaForge.svg'` at runtime.
task('build:icons', copyIcons);

function copyIcons() {
  const nodeSource = path.resolve('nodes', '**', '*.{png,svg}');
  const nodeDestination = path.resolve('dist', 'nodes');
  src(nodeSource, { encoding: false }).pipe(dest(nodeDestination));

  const credSource = path.resolve('credentials', '**', '*.{png,svg}');
  const credDestination = path.resolve('dist', 'credentials');
  return src(credSource, { encoding: false }).pipe(dest(credDestination));
}
