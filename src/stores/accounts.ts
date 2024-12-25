import { defineStore } from 'pinia';

interface Account {
  id: string;
  label: { text: string }[];
  type: 'LDAP' | 'Local';
  login: string;
  password: string | null;
}

const STORAGE_KEY = 'account-management-accounts';

function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function getSavedAccounts() {
  const accountsJSON = localStorage.getItem(STORAGE_KEY);
  if (accountsJSON) {
    return JSON.parse(accountsJSON) as Account[];
  }
  return [];
}

function saveAccounts(accounts: Account[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

export const useAccountStore = defineStore('accounts', {
  state: () => ({
    accounts: getSavedAccounts(),
  }),
  actions: {
    addAccount() {
      const newAccount: Account = {
        id: generateUniqueId(),
        label: [],
        type: 'Local',
        login: '',
        password: null,
      };
      this.accounts.push(newAccount);
      saveAccounts(this.accounts);
    },
    removeAccount(accountId: string) {
      const index = this.accounts.findIndex((account) => account.id === accountId);
      if (index !== -1) {
        this.accounts.splice(index, 1);
        saveAccounts(this.accounts);
      }
    },
    saveAccount(accountId: string, updatedAccount: Account) {
      const index = this.accounts.findIndex((account) => account.id === accountId);
      if (index !== -1) {
        this.accounts[index] = { ...updatedAccount };
        saveAccounts(this.accounts); 
      }
    },
  },
});
