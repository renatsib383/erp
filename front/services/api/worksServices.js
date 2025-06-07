import qs from "qs";

// Для сделки со списком категорий и всего остального, запрашивается только один раз
export const getWorksList = async (worksList, worksListWithOriginalPrices, group, category, factorList, edList, workTypeList) => {
    const {$api} = useNuxtApp();
    try {
        const res = await $api.get('/works?page[size]=5000');
        worksList.value = await res.data;
        worksListWithOriginalPrices.value = JSON.parse(JSON.stringify(res.data)); // Cоздаю копию списка работ с оригинальными ценами

        const response = await $api.get(`/lists/work`)
        group.value = Object.entries(response.group).map(([key, value]) => {
            return { value: Number(key), label: value };
        });
        category.value = response.category.map((cat) => {
            return {
                value: Number(cat.id),
                label: cat.name,
                room_types: cat.room_types,
                activated: false,
                groups: cat.groups
            };
        });
        factorList.value = response.factor;
        edList.value = response.ed;
        workTypeList.value = response.type;

    } catch (e) {
        console.error('ActTable works.data loading error', e);
    }
};

// Для раздела работ
export const fetchWorks = async (event, page, filter, first, multiSortMeta, search, cachedLists = null) => {
    const { $api } = useNuxtApp();

    const params = {
        filter: Object.fromEntries(
            Object.entries({
                work_group_id: filter.group,
                name: search
            }).filter(([_, v]) => v)
        ),
    };

    if (Object.keys(page).length > 0) {
        params.page = {};
        for (let key of Object.keys(page)) {
            if (page[key]) {
                params.page[key] = page[key];
            }
        }
    }

    const query = qs.stringify(params, { encode: false });
    const oldURL = window.location.href;
    const newUrl = query.length ? `${window.location.pathname}?${query}` : null;
    history.pushState(oldURL, '', newUrl || window.location.pathname);

    try {
        const works = await $api.get(`/works?${query}&include=events.user`);
        let lists = {}
        if (!cachedLists) { // Если списки категорий и групп не были загружены, загрузим их
            lists = await fetchWorksDataLists()
        }

        return {
            success: true,
            data: {
                works: works.data,
                total: works.total,
                ...lists
            }
        };
    } catch (e) {
        console.log("[worksTable] loadData error", e);
        return { success: false, e };
    }
};

// Списки категорий, групп, тип комнат и т.д.
export const fetchWorksDataLists = async () => {
    let lists = {}
    const { $api } = useNuxtApp();

    const response = await $api.get(`/lists/work`);
    lists = {
        group: response.group,
        category: response.category.map((cat) => ({
            value: Number(cat.id),
            label: cat.name,
            room_types: cat.room_types,
            activated: false,
            groups: cat.groups
        })),
        factor: response.factor,
        ed: response.ed,
    };

    return lists;
}

export const fetchWork = async (id) => {
    const { $api } = useNuxtApp();

    try {
        const response = await $api.get(`/works/${id}?include=events`);

        // if (response.status === 200) {
            return {
                success: true,
                data: response,
            };
        // }
    } catch (error) {
        console.error("Error fetching work data:", error);
        return { success: false, error };
    }
};

export const searchProducts = async (query, existingProducts) => {
    const { $api } = useNuxtApp();

    try {
        const response = await $api.get("/products", { params: { q: query } });
        const availableProducts = response.data || [];
        const filteredProducts = availableProducts.filter(
            (p) => !existingProducts.includes(p.name)
        );

        return {
            success: true,
            data: filteredProducts.slice(0, 10), // Ограничиваем до 10 продуктов
        };
    } catch (e) {
        console.error("Error searching products:", e);
        return { success: false, e};
    }
};

// Раздел "наборы работ"
export const getWorksCollection = async (worksCollectionData) => {
    const {$api} = useNuxtApp();
    if (!worksCollectionData.value.length) {
        try {
            const response = await $api.get("/works/collections");
            worksCollectionData.value = await response.data;
        } catch (e) {
            console.error("worksCollectionList loadData error", e);
        }
    }
};

export const fetchWorksData = async () => {
    const { $api } = useNuxtApp();

    try {
        const works = await $api.get('/works?page[size]=5000');
        const response = await $api.get(`/lists/work`)
        return {
            success: true,
            data: {
                works: works.data,
                group: Object.entries(response.group).map(([key, value]) => {
                    return { value: Number(key), label: value };
                }),
                category: response.category.map((cat) => {
                    return {
                        value: Number(cat.id),
                        label: cat.name,
                        room_types: cat.room_types,
                        activated: false,
                        groups: cat.groups
                    };
                }),
                roomTypes: response.roomTypes
            },
        };
    } catch (error) {
        console.error("[fetchWorksData] Error:", error);
        return { success: false, error };
    }
};