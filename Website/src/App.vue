<script setup lang="ts">
import { ref } from 'vue';
import AuthModal from './views/AuthModal.vue';
import ManagePanel from './views/ManagePanel.vue';
import { password } from "@/store/auth"
import type { URL } from 'shorten-url-api/built/models';

const shorteneds = ref<URL[]>([]);
</script>

<template>
  <AuthModal v-if="!password.valid" />
  <ManagePanel v-else" />
</template>

<style></style>
