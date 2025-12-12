


const BASE_URL = "http://193.136.62.24/v1/";

/**
 * Lida com a resposta HTTP: verifica se o status é OK e converte para JSON.
 * Lança um erro para status não-OK (incluindo 202 Accepted para DELETE).
 */
const handleResponse = async (response) => {
    // 200 OK ou 202 Accepted (esperado para DELETE, como no DeleteLibrarySSD.puml)
    if (response.ok || response.status === 202) {
        const text = await response.text();
        // Retorna JSON, ou um objeto vazio se a resposta for vazia (200 OK/202 Accepted sem corpo)
        return text ? JSON.parse(text) : {};
    }

    // Tratamento de erro similar ao RuntimeException no NetworkHandler.java
    const errorBody = await response.text();
    const errorMsg = errorBody.length > 0 ? JSON.parse(errorBody).message || errorBody : response.statusText;
    throw new Error(`API Error: ${errorMsg} (Status ${response.status})`);
};

/**
 * Função utilitária para requisições com corpo JSON (POST/PUT).
 */
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

    // Mapeia para RequestsService.getLibraries() / GET /library
    getLibraries: async () => {
        const url = `${BASE_URL}library`;
        const response = await fetch(url);
        return handleResponse(response);
    },

    // Mapeia para RequestsService.postLibrary() / POST /library
    createLibrary: async (libraryDto) => {
        const url = `${BASE_URL}library`;
        return sendJsonRequest(url, 'POST', libraryDto);
    },

    // Mapeia para RequestsService.updateLibrary() / PUT /library/{id}
    updateLibrary: async (libraryId, libraryDto) => {
        const url = `${BASE_URL}library/${libraryId}`;
        return sendJsonRequest(url, 'PUT', libraryDto);
    },

    // Mapeia para RequestsService.deleteLibrary() / DELETE /library/{id}
    deleteLibrary: async (libraryId) => {
        const url = `${BASE_URL}library/${libraryId}`;
        const response = await fetch(url, { method: 'DELETE' });
        return handleResponse(response);
    },

    // === Books and Search (UC1) ===

    // Mapeia para RequestsService.searchBooks() / GET /search?query=...
    searchBooks: async (query) => {
        const url = `${BASE_URL}search?query=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        return handleResponse(response);
    },

    // Mapeia para RequestsService.getBookByIsbn() / GET /book/{isbn}
    getBookByIsbn: async (isbn) => {
        const url = `${BASE_URL}book/${isbn}`;
        const response = await fetch(url);
        return handleResponse(response);
    },

    // Mapeia para RequestsService.getCover() / GET /assets/cover/...
    getCover: async (imageUrl) => {
        const url = `${BASE_URL}assets/cover/${imageUrl}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch cover image: ${response.status}`);
        }
        // Retorna o blob binário, útil para o componente <Image> do React Native
        return response.blob();
    },

    // === Checkouts (UC6, UC7, UC8) ===

    // Mapeia para RequestsService.getCheckedOutBooks() / GET /user/checked-out?userId=...
    getCheckedOutBooks: async (userId) => {
        const url = `${BASE_URL}user/checked-out?userId=${encodeURIComponent(userId)}`;
        const response = await fetch(url);
        return handleResponse(response);
    },

    // Mapeia para RequestsService.checkInBook() / POST /library/{id}/book/{isbn}/checkin?userId=...
    checkInBook: async (libraryId, isbn, userId) => {
        const url = `${BASE_URL}library/${libraryId}/book/${isbn}/checkin?userId=${encodeURIComponent(userId)}`;
        return sendJsonRequest(url, 'POST');
    },

    // Mapeia para RequestsService.extendCheckout() / POST /checkout/{id}/extend
    extendCheckout: async (checkoutId) => {
        const url = `${BASE_URL}checkout/${checkoutId}/extend`;
        return sendJsonRequest(url, 'POST');
    },
};