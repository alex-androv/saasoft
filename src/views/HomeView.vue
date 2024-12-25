<template>
  <div class="container mx-auto pt-12">
    <div class="flex items-center mb-8">
      <h1 class="text-2xl font-bold mr-8">Учетные записи</h1>
      <button
        @click="addAccount"
        class="my-4 p-4 border rounded shadow-sm"
      >
        <img src="../assets/plus.svg" />
      </button>
    </div>
    <div class="border rounded shadow-sm">
      <div
        class="p-4 mb-4 grid gap-x-4"
        style="grid-template-columns: repeat(4, 1fr) 0.2fr"
      >
        <p class="text-gray-400">Метки</p>
        <p class="text-gray-400">Типы записи</p>
        <p class="text-gray-400">Логин</p>
        <p class="text-gray-400">Пароль</p>
      </div>
      <transition-group
        name="fade"
        tag="div"
      >
        <div
          v-for="(account, index) in accounts"
          :key="account.id"
        >
          <AccountItem
            :account="account"
            :index="index"
            @delete-account="deleteAccount"
          />
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from "../stores/accounts";
import AccountItem from "../components/AccountItem.vue";

const accountStore = useAccountStore();
const accounts = accountStore.accounts;

const addAccount = () => {
  accountStore.addAccount();
};

const deleteAccount = (accountId: string) => {
  accountStore.removeAccount(accountId);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
