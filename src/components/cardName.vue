<script setup lang="ts">
import CardNameAlt from './_cardName.vue';
import ScryfallLink from './scryfallLink.vue';
const props = withDefaults(
  defineProps<{
    name: string;
    nameJp?: string | [string, string];
    link?: boolean | string;
  }>(),
  { link: true }
);
</script>

<template>
  <template v-if="!props.link"><CardNameAlt :name="name" :nameJp="nameJp" /></template>
  <template v-else-if="typeof link === 'string'"
    ><a :href="link"><CardNameAlt :name="name" :nameJp="nameJp" /></a
  ></template>
  <template v-else
    ><ScryfallLink :name="name"><CardNameAlt :name="name" :nameJp="nameJp" /></ScryfallLink
  ></template>
</template>
