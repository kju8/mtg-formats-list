<script setup lang="ts">
import { computed, ref } from 'vue';
import { rawData } from '../pages/cards.json';
import { fuzzySearch } from '../utils/fuzzySearch';
import { fixColor } from '../utils/mtgTools';
import '../style/mtgColor.scss';
const props = defineProps<{
  name: string;
}>();

const data = ref(fuzzySearch(rawData, props.name));

const url = computed(() => {
  return data.value?.scryfall_uri;
});

const color = computed(() => {
  let _color = data.value?.colors || [];
  if (data.value?.card_faces) {
    const faces = data.value.card_faces;
    for (let index = 0; index < faces.length; index++) {
      _color = _color.concat(faces[index].colors || []);
    }
  }
  return fixColor([...new Set(_color)]);
});

const colorStyle = computed(() => {
  return `${color.value}-border`;
});
</script>

<template>
  <a :href="url" :class="colorStyle"><slot /></a>
</template>

<style scoped lang="scss">
a {
  text-indent: 0;
  display: inline-block;
  text-decoration-line: none;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-image-slice: 1;
  max-width: 99%;
}
</style>
