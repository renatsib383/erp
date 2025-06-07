import { useToast } from "primevue/usetoast";
import { useToastStore } from "@/stores/toast";

export default defineNuxtPlugin((nuxtApp) => {
    const toast = useToast();
    const toastStore = useToastStore();

    const showToast = (severity, summary, detail, group = 'bl', life = 5000) => {
        toast.add({
            severity,
            summary,
            detail,
            group,
            life,
        });
    };

    const showSuccessToast = (message) => {
        showToast('success', 'Успешно', message);
    };

    const showErrorToast = (message) => {
        showToast('error', 'Ошибка', message);
    };

    const showInfoToast = (message) => {
        showToast('info', 'Сообщение', message);
    };

    const setToastMessage = (message, severity = 'info') => {
        toastStore.message = message;
        toastStore.severity = severity;
    };

    const clearToastMessage = () => {
        toastStore.clearMessage();
    };

    const showNotifyToast = (title,message) => {
        showToast('info', title, message);
    };

    // type для выбора разметки в слоте: imbox
    const showTypedToast = (type, title, message, severity, props) => {
        toast.add({
            severity: severity,
            summary: title,
            detail: message,
            group: 'bl',
            life: 5000,
            type: type,
            props: props,
        });
    };

    const toastIconClass = (severity) => {
        return {
            'info': 'pi pi-info-circle',
            'success': 'pi pi-check',
            'warn': 'pi pi-exclamation-triangle',
            'error': 'pi pi-times-circle'
          }[severity]        
    }


    nuxtApp.provide('showNotifyToast', showNotifyToast);
    nuxtApp.provide('showToast', showToast);
    nuxtApp.provide('showSuccessToast', showSuccessToast);
    nuxtApp.provide('showErrorToast', showErrorToast);
    nuxtApp.provide('showInfoToast', showInfoToast);
    nuxtApp.provide('setToastMessage', setToastMessage);
    nuxtApp.provide('clearToastMessage', clearToastMessage);
    nuxtApp.provide('showTypedToast', showTypedToast);
    nuxtApp.provide('toastIconClass', toastIconClass);
});