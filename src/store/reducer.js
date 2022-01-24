import {
    DOWNLOAD_BOOKCASES,
    ADD_BOOKCASE,
    ADD_BOOK,
    EDIT_BOOK,
    MOVE_BOOK_BACK,
    MOVE_BOOK_FORWARD,
    REMOVE_BOOK
} from './actions.js'

const initialState = {
    bookcases: []
};
export default function reducer(state = initialState, { type, payload }) {
    switch (type) {
        case DOWNLOAD_BOOKCASES:
            return {
                ...state,
                bookcases: payload
            };
        case ADD_BOOKCASE:
            return {
                ...state,
                bookcases: [
                    ...state.bookcases,
                    {
                        bookcaseName: payload,
                        books: []
                    }
                ]
            };
        case ADD_BOOK:
            return {
                ...state,
                bookcases: state.bookcases.map(
                    (bookcase, index) => index === payload.bookcaseId
                        ? ({ ...bookcase, books: [...bookcase.books, payload.bookName] })
                        : ({ ...bookcase })
                )
            };
        case EDIT_BOOK:
            return {
                ...state,
                bookcases: state.bookcases.map(
                    (bookcase, index) => index !== payload.bookcaseId
                        ? { ...bookcase }
                        : {
                            ...bookcase,
                            books: bookcase.books.map(
                                (book, bookIndex) => bookIndex === payload.bookId
                                    ? payload.newBookName
                                    : book
                            )
                        }
                )
            };
        case MOVE_BOOK_BACK:
            if (payload.bookcaseId === 0) return state;
            const movedBookBack = state.bookcases[payload.bookcaseId].books[payload.bookId];
            const fromBooksBack = state.bookcases[payload.bookcaseId].books.filter(book => book !== movedBookBack);
            return {
                ...state,
                bookcases: state.bookcases.map((bookcase, index) => {
                    if (index === payload.bookcaseId) {
                        return {
                            ...bookcase,
                            books: fromBooksBack
                        };
                    }
                    if (index === payload.bookcaseId - 1) {
                        return {
                            ...bookcase,
                            books: [
                                ...bookcase.books,
                                movedBookBack
                            ]
                        };
                    }
                    return { ...bookcase };
                })
            };
        case MOVE_BOOK_FORWARD:
            if (payload.bookcaseId === state.bookcases.length - 1) return state;
            const movedBookForward = state.bookcases[payload.bookcaseId].books[payload.bookId];
            const fromBooksForward = state.bookcases[payload.bookcaseId].books.filter(book => book !== movedBookForward);
            return {
                ...state,
                bookcases: state.bookcases.map((bookcase, index) => {
                    if (index === payload.bookcaseId) {
                        return {
                            ...bookcase,
                            books: fromBooksForward
                        };
                    }
                    if (index === payload.bookcaseId + 1) {
                        return {
                            ...bookcase,
                            books: [
                                ...bookcase.books,
                                movedBookForward
                            ]
                        };
                    }
                    return { ...bookcase };
                })
            };
        case REMOVE_BOOK:
            return {
                ...state,
                bookcases: state.bookcases.map((bookcase, index) => index === payload.bookcaseId
                    ? ({
                        ...bookcase,
                        books: bookcase.books.filter(
                            (book, bookIndex) => bookIndex !== payload.bookId
                        )
                    })
                    : { ...bookcase }
                )
            };
        default:
            return state;
    }
}