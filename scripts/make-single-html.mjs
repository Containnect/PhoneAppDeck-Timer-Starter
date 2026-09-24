import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const distDir = resolve('dist');
const htmlPath = resolve(distDir, 'index.html');
let html = await readFile(htmlPath, 'utf8');

html = await replaceAllAsync(
  html,
  /<link\s+rel=["']stylesheet["']\s+crossorigin\s+href=["']([^"']+)["']\s*\/?\s*>/g,
  async (_match, href) => {
    const css = await readFile(resolve(distDir, href.replace(/^\//, '')), 'utf8');
    return `<style>\n${css.replaceAll('</style', '<\\/style')}\n</style>`;
  },
);

html = await replaceAllAsync(
  html,
  /<script\s+type=["']module["']\s+crossorigin\s+src=["']([^"']+)["']><\/script>/g,
  async (_match, src) => {
    const js = await readFile(resolve(distDir, src.replace(/^\//, '')), 'utf8');
    return `<script>\n${js.replaceAll('</script', '<\\/script')}\n</script>`;
  },
);

const remainingExternalAssets = [
  ...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi),
  ...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi),
];
if (remainingExternalAssets.length) {
  throw new Error(`Single HTML build still contains external JS/CSS: ${remainingExternalAssets.map(match => match[1]).join(', ')}`);
}

await writeFile(htmlPath, html, 'utf8');

async function replaceAllAsync(input, regex, replacer) {
  const matches = [...input.matchAll(regex)];
  let output = input;
  for (const match of matches.reverse()) {
    const replacement = await replacer(...match);
    output = output.slice(0, match.index) + replacement + output.slice(match.index + match[0].length);
  }
  return output;
}
