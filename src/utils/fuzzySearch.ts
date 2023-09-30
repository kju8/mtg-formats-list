import type { IScryfallCard } from "scryfall-types";

export function fuzzySearch(_list: IScryfallCard[], sentence: string) {
  const list = _list.filter(
    (e) => e.type_line !== "Card" && e.name.includes(sentence),
  );
  if (list.length == 1) return list[0];
  if (list.length < 1) return undefined;
  const list2 = list.filter((e) => e.name.startsWith(sentence));
  if (list2.length == 1) return list2[0];
  if (list2.length < 1) return list[0];
  const list3 = list.filter((e) => e.name === sentence);
  if (list3.length >= 1) return list3[0];
  return list2[0];
}
