


const BASE_URL = "http://193.136.62.24/v1/";

/**
 * Lida com a resposta HTTP: verifica se o status é OK e converte para JSON.
 * Lança um erro para status não-OK (incluindo 202 Accepted para DELETE).
 */
const handleResponse = async (response) => {
    if (response.ok || response.status === 202) {
        const text = await response.text();

        return text ? JSON.parse(text) : {};
    }

    const errorBody = await response.text();
    const errorMsg = errorBody.length > 0 ? JSON.parse(errorBody).message || errorBody : response.statusText;
    throw new Error(`API Error: ${errorMsg} (Status ${response.status})`);
};

const sendJsonRequest = async (url, method, body = null) => {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    if (body !== null) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    return handleResponse(response);
};

export const api = {
    // === Libraries (UC2, UC3, UC4, UC5) ===

    getLibraries: async () => {
        const url = `${BASE_URL}library`;
        const response = await fetch(url);
        return handleResponse(response);
    },

    createLibrary: async (libraryDto) => {
        const url = `${BASE_URL}library`;
        return sendJsonRequest(url, 'POST', libraryDto);
    },

    updateLibrary: async (libraryId, libraryDto) => {
        const url = `${BASE_URL}library/${libraryId}`;
        return sendJsonRequest(url, 'PUT', libraryDto);
    },

    deleteLibrary: async (libraryId) => {
        const url = `${BASE_URL}library/${libraryId}`;
        const response = await fetch(url, { method: 'DELETE' });
        return handleResponse(response);
    },

    searchBooks: async (query) => {
        const url = `${BASE_URL}search?query=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        return handleResponse(response);
    },


    getBookByIsbn: async (isbn) => {
        const url = `${BASE_URL}book/${isbn}`;
        const response = await fetch(url);
        return handleResponse(response);
    },

    getCover: async (imageUrl) => {
        const url = `${BASE_URL}assets/cover/${imageUrl}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch cover image: ${response.status}`);
        }
        return response.blob();
    },

    getCheckedOutBooks: async (userId) => {
        const url = `${BASE_URL}user/checked-out?userId=${encodeURIComponent(userId)}`;
        const response = await fetch(url);
        return handleResponse(response);
    },

    checkInBook: async (libraryId, isbn, userId) => {
        const url = `${BASE_URL}library/${libraryId}/book/${isbn}/checkin?userId=${encodeURIComponent(userId)}`;
        return sendJsonRequest(url, 'POST');
    },

    extendCheckout: async (checkoutId) => {
        const url = `${BASE_URL}checkout/${checkoutId}/extend`;
        return sendJsonRequest(url, 'POST');
    },
};
