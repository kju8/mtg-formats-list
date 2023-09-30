<script setup lang="ts">
import { ref, computed } from 'vue';
import { rawData } from '../pages/cards.json';
import { fuzzySearch } from '../utils/fuzzySearch';
const props = defineProps<{
  name: string;
  class?: string;
}>();

const data = ref(fuzzySearch(rawData, props.name));
const url = computed(() => {
  return data.value?.image_uris?.png || data.value?.card_faces?.[0].image_uris?.png;
});
</script>

<template>
  <img :src="url" :class="class" />
</template>
