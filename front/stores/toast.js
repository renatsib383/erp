import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({
    message: null,
    severity: null
  }),
  actions: {
    setMessage(message, severity = 'info') {
      this.message = message
      this.severity = severity
    },
    clearMessage() {
      this.message = null
      this.severity = null
    }
  }
})