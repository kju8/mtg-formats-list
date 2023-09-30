import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import type { APIContext } from 'astro';
import type { IScryfallCard } from 'scryfall-types';

export const rawData = await (async () => {
  const rawPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    import.meta.env.MODE === 'production' ? '../../../raw/' : '../../raw/'
  );
  const pathData = fs.readdirSync(rawPath).find((e) => /^oracle-cards-[0-9]*\.json/.exec(e) !== null);

  const jsonData = pathData ? fs.readFileSync(path.join(rawPath, pathData), 'utf8') : '[]';
  return JSON.parse(jsonData) as IScryfallCard[];
})();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GET = async (_: APIContext) => {
  const jsonData = JSON.stringify(rawData);
  return new Response(jsonData, {
    headers: new Headers({
      'Content-Type': 'application/json',
      charset: 'utf-8'
    })
  });
};
