export const fetchSuggestions = async (query, token, region = "москва") => {
    const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Token ${token}`
            },
            body: JSON.stringify({
                query,
                locations: [{ region }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }

        const data = await response.json();
        return data.suggestions;
    } catch (error) {
        console.error("Fetch suggestions error:", error.message);
        return [];
    }
};

export const fetchNamesSuggestions = async (query, token = '21e1f007947f2a918b5ec3fbe51d35163044aa22') => {
    const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fio";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Token ${token}`
            },
            body: JSON.stringify({query})
        });

        const data = await response.json();
        return data.suggestions;
    } catch (error) {
        console.error("Fetch suggestions error:", error.message);
        return [];
    }
};
