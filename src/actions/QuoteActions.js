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

            const response = await fetch('https://zenquotes.io/api/random');
            const data = await response.json();


            Dispatcher.dispatch({
                type: ActionTypes.FETCH_QUOTE_SUCCESS,
                payload: {
                    content: data[0].q,
                    author: data[0].a
                },
            });

        } catch (error) {
            console.log("Detailed API Error:", error.message);

            Dispatcher.dispatch({
                type: ActionTypes.FETCH_QUOTE_SUCCESS,
                payload: {
                    content: "A library is not a luxury but one of the necessities of life.",
                    author: "Henry Ward Beecher"
                },
            });
        }
    }
};
