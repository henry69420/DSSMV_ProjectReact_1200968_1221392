import Dispatcher from '../dispatcher/Dispatcher';

export const ActionTypes = {
  FETCH_QUOTE_START: 'FETCH_QUOTE_START',
  FETCH_QUOTE_SUCCESS: 'FETCH_QUOTE_SUCCESS',
  FETCH_QUOTE_ERROR: 'FETCH_QUOTE_ERROR',
};

export const QuoteActions = {
  fetchRandomQuote: async () => {

    Dispatcher.dispatch({ type: ActionTypes.FETCH_QUOTE_START });

    try {

      const response = await fetch('https://api.quotable.io/random?tags=literature');
      const data = await response.json();

      Dispatcher.dispatch({
        type: ActionTypes.FETCH_QUOTE_SUCCESS,
        payload: data,
      });

    } catch (error) {
      console.log("API Error, using fallback:", error);

      Dispatcher.dispatch({
        type: ActionTypes.FETCH_QUOTE_SUCCESS, // Fingimos sucesso com dados locais
        payload: {
          content: "Frase default, logo deu erro na API.",
          author: "Jacinto Leite Aquino Rego"
        },
      });
    }
  }
};
