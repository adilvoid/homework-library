import React, { memo } from "react";
import { connect } from 'react-redux';
import {
    editBook as editBookServer,
    moveBook as moveBookServer,
    removeBook as removeBookServer
} from '../../models/AppModel.js'
import {
    editBookAction,
    moveBookBackAction,
    moveBookForwardAction,
    removeBookAction
} from '../../store/actions.js';

const Book = ({
    bookName,
    bookId,
    bookcaseId,
    editBookDispatch,
    moveBookBackDispatch,
    moveBookForwardDispatch,
    removeBookDispatch
}) => {
    const editBook = async () => {
        let newBookName = prompt('Введите новое название книги', bookName.split(', автор: ')[0])
        if (!newBookName) return;
        newBookName = newBookName.trim();
        if (!newBookName) return;
        let author = prompt('Bведите автора', bookName.split(', автор: ')[1]);
        if (!author) return;
        author = author.trim();
        if (!author) return;
        newBookName += ', автор: ' + author;
        if (newBookName === bookName) return;
        const info = await editBookServer({ bookcaseId, bookId, newBookName });
        console.log(info);
        editBookDispatch({ bookcaseId, bookId, newBookName });
    };
    const removeBook = async () => {
        //eslint-disable-next-line no-restricted-globals
        if (confirm(`Книга '${bookName}' будет удалена. Продолжить?`)) {
            const info = await removeBookServer({ bookcaseId, bookId });
            console.log(info);
            removeBookDispatch({ bookcaseId, bookId });
        }
    };
    const moveBookBack = async () => {
        try {
            const info = await moveBookServer({
                bookcaseId,
                bookId,
                toBookcaseId: bookcaseId - 1
            });
            console.log(info);
            moveBookBackDispatch({ bookcaseId, bookId });
        } catch (error) {
            console.log(error);
        }
    };
    const moveBookForward = async () => {
        try {
            const info = await moveBookServer({
                bookcaseId,
                bookId,
                toBookcaseId: bookcaseId + 1
            });
            console.log(info);
            moveBookForwardDispatch({ bookcaseId, bookId });
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="bookcase-book"
            id={`${bookcaseId}-${bookId}`}>
            <div className="bookcase-book-text">
                {bookName}
            </div>
            <div className="bookcase-book-controls">
                <div className="bookcase-book-controls-row">
                    <div className="bookcase-book-controls-button left-arrow"
                        onClick={moveBookBack}></div>
                    <div className="bookcase-book-controls-button right-arrow"
                        onClick={moveBookForward}></div>
                </div>
                <div className="bookcase-book-controls-row">
                    <div className="bookcase-book-controls-button edit-icon"
                        onClick={editBook}></div>
                    <div className="bookcase-book-controls-button delete-icon"
                        onClick={removeBook}></div>
                </div>
            </div>
        </div>

    );
};

const mapDispatchToProps = dispatch => ({
    editBookDispatch: ({
        bookcaseId, bookId, newBookName
    }) => dispatch(editBookAction({ bookcaseId, bookId, newBookName })),
    moveBookBackDispatch: ({
        bookcaseId, bookId
    }) => dispatch(moveBookBackAction({ bookcaseId, bookId })),
    moveBookForwardDispatch: ({
        bookcaseId, bookId
    }) => dispatch(moveBookForwardAction({ bookcaseId, bookId })),
    removeBookDispatch: ({
        bookcaseId, bookId
    }) => dispatch(removeBookAction({ bookcaseId, bookId }))
});

export default connect(
    null,
    mapDispatchToProps
)(memo(Book));