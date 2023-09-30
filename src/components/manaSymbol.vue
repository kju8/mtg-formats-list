<script setup lang="ts">
import { fixMana, type allManaSymbol } from '../utils/mtgTools';
const props = defineProps<{
  mark: allManaSymbol;
}>();
</script>

<template>
  <i class="ms ms-cost ml-0.5 ms-shadow -mt-1" :class="`ms-${fixMana(props.mark)}`" />
</template>
