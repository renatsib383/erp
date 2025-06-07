import {useMainStore} from "~/stores/main.js";

export const onModalCollapse = (id, collapseState, objectName, reOpen) => {
    // const historyShowButton = document.querySelector('.show-modals-history_button')

    const elementInDom = document.querySelector(`.${objectName}-${id}-dialog`); // нахожу в dom
    const collapsedModals = Array.from(document.querySelectorAll('.custom-collapsed-modals'));
    if (!elementInDom) return;

    setTimeout(() => {
        if (collapseState) {
            elementInDom.classList.add('custom-collapsed-modals'); // отмечаю как свернуту
            elementInDom.style.transitionDuration = '300ms';

            // historyShowButton.style.zIndex = 1300

            const allCollapsedModals = Array.from(document.querySelectorAll('.custom-collapsed-modals'));
            // Если свернули больше 5
            if (allCollapsedModals.length > 5) {
                // Находим самый старший элемент, и добавим его в историю
                const oldestModal = allCollapsedModals.shift();
                const closedTime = formatDateTimeStr(new Date());
                const components = ['contact', 'company', 'user', 'work', 'collection', 'deal', 'dds', 'salary', 'deduction'];

                const store = useMainStore()
                const modalClass = Array.from(oldestModal.classList).find(cls =>
                  components.some(component => cls.startsWith(component + '-'))
                );
                if (modalClass) {
                    const [component, id] = modalClass.split('-');
                    store.addToModalsHistoryList({ modalData: { id }, modalTitle: component, date: closedTime });
                }
                // Потом удаляем его из DOM
                oldestModal.remove();
            }
            allCollapsedModals.forEach((modal, index) => {
                const newTranslateValue = (index + 1) * 40.15; // Каждая предыдущая поднимается
                modal.style.transitionDuration = '300ms';
                modal.style.transform = `translateY(calc(100% - ${newTranslateValue}px))`;
                modal.style.zIndex = 1101 - index; // Устанавливаем z-index
            });
        } else {
            // Если разворачивается
            elementInDom.classList.remove('custom-collapsed-modals'); // Убираю пометку
            elementInDom.style.transform = '';
            elementInDom.style.zIndex = `${Math.max(...collapsedModals.map(m => parseInt(getComputedStyle(m).zIndex, 10) || 0)) + 1}`; // Повышаю индекс чтобы сверху при разворачивании был

            // historyShowButton.style.zIndex = 0

            if (elementInDom.classList.contains('translate-y-[calc(100%-40px)]')) { // Модалки которые при перезагрузках или переходе между разделами были открыты свёрнутыми
                elementInDom.style.transitionDuration = '300ms';
                elementInDom.classList.remove('translate-y-[calc(100%-40px)]'); // Убираю транзишн
            }

        }
    },0)

    if (reOpen) {
        elementInDom.querySelector('.modal-header').click() // Щелкаю в шапке чтобы кнопку свернуть обратно показать
    }
}

export const updateCollapsedModalsPositions = (id, objectName) => {
    const store = useMainStore()
    let lastHistoryModals = [];
    // const historyShowButton = document.querySelector('.show-modals-history_button')
    // historyShowButton.style.zIndex = 1300

    if(store.showModalsFromHistory) { // Если сейчас показываются модалки из истории, то надо учесть их высоту и показать сверху них
        const historyModals = store.getModalsHistoryList

        // Берем последние 5 элементов из истории
        if(historyModals && historyModals.length > 5){
            lastHistoryModals = JSON.parse(JSON.stringify(historyModals.slice(-5)))
        } else{
            lastHistoryModals = JSON.parse(JSON.stringify(historyModals)) // Или меньше, если пяти нет
        }
    }

    // Определяем высоту модалок из истории
    const historyModalsContainerHeight = lastHistoryModals.length * 40.2

    const elementInDom = document.querySelector(`.${objectName}-${id}-dialog`); // нахожу в dom
    const collapsedModals = Array.from(document.querySelectorAll('.custom-collapsed-modals')); // список свернутых
    const allCollapsedModals = collapsedModals.filter(modal => modal !== elementInDom);

    allCollapsedModals.forEach((modal, index) => {
        const newTranslateValue = (index + 1) * 40.1; // Каждая предыдущая поднимается
        modal.style.transitionDuration = '300ms';
        modal.style.transform = `translateY(calc(100% - ${newTranslateValue + historyModalsContainerHeight}px))`; // Располагаем друг над другом + еще над модалками истории
    })
}

export const isHolidayDay = (date) => {
    const store = useMainStore();
    const fullDate = `${date.year}-${String(date.month + 1).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
    const weekend = new Date(fullDate).getDay();
    return weekend === 0 || weekend === 6 || store.getHolidays?.includes(fullDate);
};

export const copyLinkToModal = (id, page) => {
    const { $showInfoToast } = useNuxtApp()
    const route = `${window.location.origin}/${page}/${id}`
    navigator.clipboard.writeText(route);
    $showInfoToast('Ссылка скопирована в буфер обмена')
}

export const openModalOnPage = (id,page) => {
    const route = `${window.location.origin}/${page}/${id}`
    window.open(route,'_blank');
}


// Модалки из истории
export const addModalFromHistoryToDom = (historyModals, openHistoryModalComponent) => {
    let lastHistoryModals = [];

    // Берем последние 5 элементов из истории
    if(historyModals && historyModals.length > 5){
        lastHistoryModals = JSON.parse(JSON.stringify(historyModals.slice(-5)))
    } else{
        lastHistoryModals = JSON.parse(JSON.stringify(historyModals))
    }
    // Определяем высоту модалок из истории
    const historyModalsContainerHeight = lastHistoryModals.length * 40.2


    // Размешаем модалки из истории друг за другом
    lastHistoryModals.forEach((modal, index) => {
        openHistoryModalComponent(modal);
        setTimeout(() => {
            updateHistoryModalsPositions()
        }, 0); // Небольшая задержка
    });
    setTimeout(() => {
         // Поднимаем свернутые модалки на верх модалок из истории
        raiseLowerCollapsedModals(historyModalsContainerHeight)
    }, 100)
}

export const updateHistoryModalsPositions = () => {
    const allCollapsedModals = Array.from(document.querySelectorAll('.custom-history-collapsed-modals'));
    if (allCollapsedModals.length > 5) {
        const oldestModal = allCollapsedModals.shift(); // Удаляем первый элемент из массива если свернули больше 5
        oldestModal.remove();
    }
    allCollapsedModals.forEach((modal, index) => {
        const newTranslateValue = (index + 1) * 40.15; // Каждая предыдущая поднимается
        // modal.style.transitionDuration = '300ms';
        modal.style.transform = `translateY(calc(100% - ${newTranslateValue}px))`;
        modal.style.zIndex = 1201 - index; // Устанавливаем z-index
    });
}

export const removeHistoryModalsFromDom = () => {
    const allCollapsedHistoryModals = Array.from(document.querySelectorAll('.custom-history-collapsed-modals'));
    allCollapsedHistoryModals.forEach((modal) => {
        modal.remove(); // Удаляем элемент из DOM
    });
}

export const raiseLowerCollapsedModals = (historyModalsContainerHeight = 0) => {
    const allCollapsedModals = Array.from(document.querySelectorAll('.custom-collapsed-modals'));

    allCollapsedModals.forEach((modal, index) => {
        const newTranslateValue = (index + 1) * 40.15;
        modal.style.transitionDuration = '400ms';
        modal.style.transform = `translateY(calc(100% - ${newTranslateValue + historyModalsContainerHeight}px))`;
        modal.style.zIndex = 1101 - index;
    });
}