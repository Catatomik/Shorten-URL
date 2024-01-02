<script setup lang="ts">
import { URL } from "shorten-url-api/built/routes/url";
import { password, fetch, sha256 } from "@/store/auth";

const emit = defineEmits<{
  authenticated: [fetched: URL[]];
}>();

async function tryAuth() {
  const fetched = await fetch();
  if (fetched) {
    // If password wasn't validated & saved (as it should be)
    if (!password.value.valid) {
      password.value.hashed = await sha256(password.value.value);
      password.value.value = "";
      password.value.valid = true;
    }
    emit("authenticated", fetched);
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
            @keyup.enter="tryAuth"
          />
        </div>
        <button type="button" class="px-2 shadow-md rounded-md bg-opacity-50 bg-blue-700" @click="fetch">
          Valider
        </button>
      </div>
    </div>
  </div>
</template>
