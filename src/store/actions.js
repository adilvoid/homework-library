const DOWNLOAD_BOOKCASES = 'DOWNLOAD_BOOKCASES';
const ADD_BOOKCASE = 'ADD_BOOKCASE';
const ADD_BOOK = 'ADD_BOOK';
const EDIT_BOOK = 'EDIT_BOOK';
const MOVE_BOOK_BACK = 'MOVE_BOOK_BACK';
const MOVE_BOOK_FORWARD = 'MOVE_BOOK_FORWARD';
const REMOVE_BOOK = 'REMOVE_BOOK';

const dowloadBookcasesAction = (bookcases) => ({
    type: DOWNLOAD_BOOKCASES,
    payload: bookcases
});
const addBookcaseAction = (bookcaseName) => ({
    type: ADD_BOOKCASE,
    payload: bookcaseName
});
const addBookAction = ({ bookcaseId, bookName }) => ({
    type: ADD_BOOK,
    payload: {
        bookcaseId,
        bookName
    }
});
const editBookAction = ({ bookcaseId, bookId, newBookName }) => ({
    type: EDIT_BOOK,
    payload: {
        bookcaseId,
        bookId,
        newBookName
    }
});
const moveBookBackAction = ({ bookcaseId, bookId }) => ({
    type: MOVE_BOOK_BACK,
    payload: {
        bookcaseId,
        bookId
    }
});
const moveBookForwardAction = ({ bookcaseId, bookId }) => ({
    type: MOVE_BOOK_FORWARD,
    payload: {
        bookcaseId,
        bookId
    }
});
const removeBookAction = ({ bookcaseId, bookId }) => ({
    type: REMOVE_BOOK,
    payload: {
        bookcaseId,
        bookId
    }
});

export {
    DOWNLOAD_BOOKCASES,
    ADD_BOOKCASE,
    ADD_BOOK,
    EDIT_BOOK,
    MOVE_BOOK_BACK,
    MOVE_BOOK_FORWARD,
    REMOVE_BOOK,
    dowloadBookcasesAction,
    addBookcaseAction,
    addBookAction,
    editBookAction,
    moveBookBackAction,
    moveBookForwardAction,
    removeBookAction
};