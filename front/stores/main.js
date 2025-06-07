import { defineStore } from 'pinia'
let dealActiveModal = {};
let main = localStorage.getItem('main')
if (main) {
    main = JSON.parse(main)
    if(main?.activeModal?.modalTitle === 'deal'){
        dealActiveModal = main.activeModal
    }
}

export const useMainStore = defineStore(
    'main', {
        state: () => ({
            isDark: true,
            isSidebarExpanded: false,
            sidebarMobileScreen: 1024,
            isAsideOpen: false,
            isImboxMobileChatsOpen: false,
            // isCollapseModal: false,
            isPageLoading: false,
            sidebarOptions: {},

            holidays: [
                "2025-01-01",
                "2025-01-02",
                "2025-01-03",
                "2025-01-06",
                "2025-01-07",
                "2025-01-08",
                "2025-05-01",
                "2025-05-02",
                "2025-05-08",
                "2025-05-09",
                "2025-06-12",
                "2025-06-13",
                "2025-11-03",
                "2025-11-04",
                "2025-12-31"
            ],
            preholidays: [
                "2025-03-07",
                "2025-04-30",
                "2025-06-11",
                "2025-11-01"
            ],

            newDealForTable: null,
            newContactForTable: null,
            newWorkCollectionForTable: null,
            newDDSForTable: null,
            newUserForTable: null,
            newDeductionForTable: null,

            listModals: [dealActiveModal], // Для того чтобы отмечать в канбане
            activeModal: null, // Для перехода в другие разделы
            modalsHistoryList: [], // Для сохранения закрытых модалок
            showModalsFromHistory: false, // Для показа контейнера модалок из истории
            modalLoader: false // Чтобы при сохранении формы показать индикатор загрузки
        }),
        persist: {
            storage: piniaPluginPersistedstate.localStorage(),
            pick: ['isDark', 'isSidebarExpanded', 'sidebarMobileScreen', 'isAsideOpen', 'isPageLoading', 'sidebarOptions', 'activeModal', 'modalsHistoryList'] // Какие переменные сохранить в LS
        },
        actions: {
            addNewDealToKanbanAndTable(deal) {
               this.newDealForTable = deal
            },
            addNewContactToTable(contact) {
              this.newContactForTable = contact
            },
            addNewWorkCollectionToTable(collection) {
              this.newWorkCollectionForTable = collection
            },
            addNewDDSToTable(dds) {
              this.newDDSForTable = dds
            },
            addNewUserToTable(user) {
              this.newDDSForTable = user
            },
            addNewDeductionToTable(data){
              this.newDeductionForTable = data
            },

            toggleIsDark() {
                document.documentElement.classList.toggle("dark");
                this.isDark = !this.isDark;
            },
            toggleSidebar() {
                this.isSidebarExpanded = !this.isSidebarExpanded;
            },
            toggleAside() {
                this.isAsideOpen = !this.isAsideOpen;
            },
            closeAside() {
                this.isAsideOpen = false;
            },
            openAside() {
                this.isAsideOpen = true;
            },
            setSidebar(value) {
                this.isSidebarExpanded = value;
            },
            setPageLoading(value) {
                this.isPageLoading = value;
            },
            setSidebarOptions(value) {
                for (let prop of Object.keys(value)) {
                    this.sidebarOptions[prop] = this.sidebarOptions[prop] ? this.sidebarOptions[prop] : {};
                    this.sidebarOptions[prop] = Object.assign(this.sidebarOptions[prop],value[prop]);
                }
            },

            setHolidays(holidays, preholidays) {
                this.holidays = holidays;
                this.preholidays = preholidays;
            },

            setNewModal(modal) {
                // При открытые новой модалки
                // скрываем контейнер истории модалок
                this.showModalsFromHistory = false
                // скрываем правый сайдбар
                this.isAsideOpen = false

                // Разворачиваем если свернута
                const elementInDom = document.querySelector(`.${modal.modalTitle}-${modal.modalData.id}-dialog`);  // Проверка на наличие свернутой модалки с этой сделкой
                if (elementInDom) {
                    onModalCollapse(modal.modalData.id, false, modal.modalTitle,true)
                    return
                }

                // Отмечаю как активную и сохраняется в LS чтобы после перезагрузки остался
                this.activeModal = modal;

                // Для того чтобы отмечать в канбане
                if (this.listModals.length > 4) { // Больше 5 удаляем из стор,
                    this.listModals.shift()
                }
                this.listModals.push(modal) // Добавляем новый

                //Удаляем из списка истории, если она была там
                this.removeFromModalsHistoryList(modal);
            },

            removeModalFromList(modalForRemove) {
                this.listModals = this.listModals.filter(
                    (modal) => !(modal.modalTitle === modalForRemove.modalTitle && String(modal.modalData.id) === String(modalForRemove.modalData.id))
                );

                this.activeModal = null

                this.addToModalsHistoryList(modalForRemove)
            },

            async addToModalsHistoryList(removedModal){
                // Если запись уже есть тогда удаляем её
                const index = this.modalsHistoryList.findIndex(
                    (modal) => modal.modalTitle === removedModal.modalTitle &&
                        String(modal.modalData.id) === String(removedModal.modalData.id)
                );
                if (index) {
                    await this.removeFromModalsHistoryList(removedModal);
                }

                // Оставляю последние 4 записи, чтобы с новой было 5
                if (this.modalsHistoryList.length >= 5) {
                    this.$patch(state => {
                        state.modalsHistoryList = state.modalsHistoryList.slice(-4);
                    });
                }


                // Если это не активная модалка(которая остается после перезагрузки), то добавляем в историю, в конец
                const isActiveModal = this.activeModal?.modalTitle === removedModal.modalTitle &&
                    String(this.activeModal?.modalData.id) === String(removedModal.modalData.id);
                if (!isActiveModal) {
                    this.$patch(state => {
                        state.modalsHistoryList.push(removedModal);
                    });
                }
            },

            async removeFromModalsHistoryList(removedModal){
                // const elementInDom = document.querySelector(`.history-${removedModal.modalTitle}-${removedModal.modalData.id}-dialog`); // нахожу в dom
                // if (elementInDom) elementInDom.remove();

                this.modalsHistoryList = this.modalsHistoryList.filter(
                    (modal) => !(modal.modalTitle === removedModal.modalTitle && String(modal.modalData.id) === String(removedModal.modalData.id))
                );

            },

            setModalsFromHistoryViewState(value) {
                this.showModalsFromHistory = value
            },

            showModalLoader(){
                this.modalLoader = true
            },
            hideModalLoader(){
                this.modalLoader = false
            }
        },
        getters: {
            getNewDealForTable: (state) => state.newDealForTable,
            getNewContactForTable: (state) => state.newContactForTable,
            getNewWorkCollectionForTable: (state) => state.newWorkCollectionForTable,
            getNewDDSForTable: (state) => state.newDDSForTable,
            getNewUserForTable: (state) => state.newUserForTable,
            getNewDeductionForTable: (state) => state.newDeductionForTable,

            getHolidays: (state) => state.holidays,
            getPreHolidays: (state) => state.preholidays,

            getActiveModal: (state) => state.activeModal,
            getListModals: (state) => state.listModals,
            getModalsHistoryList: (state) => state.modalsHistoryList

        },
    },
    {
        persist: true,
    }
)