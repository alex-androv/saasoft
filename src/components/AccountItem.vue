<template>
    <div>
        <div class="p-4 mb-4 grid gap-x-4" style="grid-template-columns: repeat(4, 1fr) 0.2fr;">
            <div>
                <input type="text" v-model="labelInput" @blur="validateLabel"
                    :class="{'border-2': !isLabelValid, 'border-red-500': !isLabelValid}"
                    class="p-2 border rounded w-full" maxlength="50" />
            </div>
            <div>
                <select v-model="type" @change="validateType" class="p-2 border rounded w-full">
                    <option value="Local">Локальная</option>
                    <option value="LDAP">LDAP</option>
                </select>
            </div>
            <div :class="type === 'LDAP' ? 'col-start-3 col-end-5 ' : ''">
                <input type="text" v-model="login" @blur="validateLogin"
                    :class="{'border-2': !isLoginValid, 'border-red-500': !isLoginValid,}"
                    class="p-2 border rounded w-full" required maxlength="100" />
            </div>
            <div v-if="type === 'Local'" class="relative">
                <input :type="showPassword ? 'text' : 'password'" v-model="password" @blur="validatePassword"
                    :class="{'border-2': !isPasswordValid, 'border-red-500': !isPasswordValid}"
                    class="p-2 border rounded w-full" required maxlength="100" />
                <button v-if="password.length > 0" type="button" @click="togglePasswordVisibility"
                    class="bg-none border-0 cursor-pointer absolute top-2 right-2">
                    <img :src="showPassword ? eyeIcon : eyeSlashIcon">
                </button>
            </div>
            <button @click="emitDeleteAccount(account.id)" class="p-2 rounded flex justify-center">
                <img src="../assets/trash.svg">
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, watch } from 'vue';
    import { useAccountStore } from '../stores/accounts';
    import eyeIcon from '../assets/eye.svg';
    import eyeSlashIcon from '../assets/eye-slash.svg';

    const props = defineProps < {
        account: {
            id: string;
            label: {
                text: string
            } [];
            type: 'LDAP' | 'Local';
            login: string;
            password: string | null;
        };
        index: number;
    } > ();

    const accountStore = useAccountStore();
    const labelInput = ref(props.account.label.map(label => label.text).join('; '));
    const type = ref(props.account.type);
    const login = ref(props.account.login);
    const password = ref(props.account.password || '');
    const isLabelValid = ref(true);
    const isLoginValid = ref(true);
    const isPasswordValid = ref(true);

    const validateLabel = () => {
        isLabelValid.value = labelInput.value.length === 0 || labelInput.value.length <= 50;
    };

    const validateLogin = () => {
        isLoginValid.value = login.value.trim().length > 0 && login.value.length <= 100;
    };

    const validatePassword = () => {
        if (type.value === 'Local') {
            isPasswordValid.value = password.value.trim().length > 0 && password.value.length <= 100;
        } else {
            isPasswordValid.value = true;
        }
    };

    const validateType = () => {
        if (type.value === 'LDAP') {
            password.value = '';
        }
        validatePassword();
    };

    watch([labelInput, type, login, password], () => {
        if (isLabelValid.value && isLoginValid.value && (type.value === 'Local' ? isPasswordValid.value :
            true)) {
            accountStore.saveAccount(props.account.id, {
                id: props.account.id,
                label: labelInput.value.split(';').map(text => ({
                    text: text.trim()
                })),
                type: type.value,
                login: login.value,
                password: type.value === 'Local' ? password.value : null,
            });
        }
    }, {
        deep: true
    });

    const emit = defineEmits(['delete-account']);

    const emitDeleteAccount = (accountId: string) => {
        emit('delete-account', accountId);
    };

    const showPassword = ref(false);

    const togglePasswordVisibility = () => {
        showPassword.value = !showPassword.value;
    };
</script>