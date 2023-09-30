import type {
  AstroConfig,
  AstroIntegration,
  AstroIntegrationLogger,
} from "astro";
import axios from "axios";
import type { IScryfallBulkData } from "scryfall-types";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

export default (): AstroIntegration => ({
  name: "scryfall-download-json",
  hooks: {
    "astro:config:done": async (_options: {
      config: AstroConfig;
      logger: AstroIntegrationLogger;
    }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { config: _, logger } = _options;
      logger.info("Integration ready.");
      const { data } = await axios.get<{
        object: string;
        has_more: boolean;
        data: IScryfallBulkData[];
      }>("https://api.scryfall.com/bulk-data");
      const url = new URL(
        data.data.find((e) => e.type === "oracle_cards")?.download_uri || "",
      );
      const _dir = path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        "../../raw/",
      );
      const _path = path.join(_dir, path.parse(url.pathname).base);

      try {
        if (fs.existsSync(_path)) {
          logger.info(`Cards Json exist (Path: "${_path}")`);
          return;
        }

        logger.info(`Cards Json Delete ready`);
        const oldData = fs
          .readdirSync(_dir)
          .find((e) => /^oracle-cards-[0-9]*\.json/.exec(e) !== null);
        if (oldData) fs.unlinkSync(path.join(_dir, oldData));

        logger.info(`Cards Json Download ready`);
        await (async () => {
          const res = await axios.get(url.href);
          fs.writeFile(_path, JSON.stringify(res.data), (err) => {
            if (err) logger.error(`Card JSON Download error: ${err}`);
            else logger.info(`Cards Json Downloaded (Path: "${_path}")`);
          });
        })();
      } catch (err) {
        logger.error(`Card JSON error: ${err}`);
      }
    },
  },
});
