<script setup lang="ts">
import { shorteneds } from "@/store";
import { password, auth } from "@/store/auth";
import { ref } from "vue";

const validateButton = ref<HTMLButtonElement | null>(null);

const emit = defineEmits<{
  authenticated: [fetched: NonNullable<Awaited<ReturnType<typeof auth>>>];
}>();

async function tryAuth() {
  const ret = await auth();

  if (ret) {
    shorteneds.value = ret;
    emit("authenticated", ret);
  }
}
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <div class="rounded-md bg-blue-300 text-gray-800 p-5">
      <div class="block">
        <div class="my-2" :disabled="password.valid">
          Mot de passe :
          <input
            v-model="password.value"
            type="password"
            size="15"
            class="rounded-sm px-1 text-dark-800"
            @keyup.enter="validateButton?.click()"
          />
        </div>
        <button
          ref="validateButton"
          type="button"
          class="px-2 shadow-md rounded-md bg-opacity-50 bg-blue-700"
          @click="tryAuth"
        >
          Valider
        </button>
      </div>
    </div>
  </div>
</template>
