<script setup lang="ts">
import { computed, ref } from 'vue';
import { rawData } from '../pages/cards.json';
import { fuzzySearch } from '../utils/fuzzySearch';
import ManaSymbol from './manaSymbol.vue';
import CardName from './_cardName.vue';
import { type allManaSymbol } from '../utils/mtgTools';
import type { IScryfallCard, IScryfallCardFace } from 'scryfall-types';
const props = defineProps<
  {
    name?: string;
    nameJp?: string | [string, string];
    card?: IScryfallCardFace;
    recursive?: boolean;
  } & (
    | {
        name: string;
      }
    | { card: IScryfallCardFace }
  )
>();

const data = ref(props.card || fuzzySearch(rawData, props.name || ''));

const dfc = computed(() => {
  return (
    props.name !== undefined &&
    (data.value as IScryfallCard)?.card_faces !== undefined &&
    (data.value as IScryfallCard)?.card_faces?.length == 2
  );
});

const manaCosts = computed(() => {
  return (data.value?.mana_cost || '').match(/\{.+?\}/g)?.map((e) => e.slice(1, -1).toLowerCase());
});

const artCrop = computed(() => {
  const artCropLink =
    data.value?.image_uris?.art_crop || (data.value as IScryfallCard)?.card_faces?.[0].image_uris?.art_crop;
  return `url("${artCropLink}")`;
});
</script>

<template>
  <span v-if="dfc" class="inline-block mtg-name">
    <CardName
      :card="((data as IScryfallCard)?.card_faces as IScryfallCardFace[])[0]"
      :name-jp="Array.isArray(nameJp) ? nameJp[0] : nameJp"
      recursive
    />
    // <wbr />
    <CardName
      :card="((data as IScryfallCard)?.card_faces as IScryfallCardFace[])[1]"
      :name-jp="Array.isArray(nameJp) ? nameJp[1] : nameJp"
      recursive
    />
  </span>
  <span v-else-if="data !== undefined" class="inline-block pt-0.5 pl-1 mt-0.5" :class="{ 'mtg-name': !recursive }">
    <ruby>
      {{ data.name }}
      <template v-if="nameJp">
        <rp>/</rp><rt>{{ nameJp }}</rt>
      </template>
    </ruby>
    <span class="inline-block mx-1 relative -top-1">
      <template v-for="mana in manaCosts" v-bind:key="mana">
        <ManaSymbol :mark="mana as allManaSymbol" />
      </template>
      <i
        class="ms ms-land"
        v-if="(manaCosts?.length === 0 || manaCosts?.length === undefined) && data.type_line?.includes('Land')"
      />
    </span>
  </span>
</template>

<style scoped lang="scss">
.mtg-name {
  position: relative;
  white-space: nowrap;
  transition-property: color;
  transition-duration: 150ms;
}

.mtg-name:hover {
  color: rgb(0 0 0);
}

.mtg-name::after {
  background-image: v-bind(artCrop);
  mix-blend-mode: multiply;
  background-size: 100% auto;
  content: '';
  display: block;
  position: absolute;
  inset: 0;
  opacity: 0.05;
  transition-property: opacity;
  transition-duration: 150ms;
  z-index: -1;
}

.mtg-name:hover::after {
  opacity: 0.25;
}
</style>
