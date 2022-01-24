import React, { memo } from "react";
import { connect } from 'react-redux';
import { addBook as addBookServer } from "../../models/AppModel.js";
import { addBookAction } from "../../store/actions.js";
import Book from '../Book/Book.jsx';

const Bookcase = ({
    bookcaseName,
    bookcaseId,
    books,
    addBookDispatch
}) => {
    const addBook = async () => {
        let bookName = prompt('Введите название книги');
        if (!bookName) return;
        bookName = bookName.trim();
        if (!bookName) return;
        let author = prompt('Введите автора');
        if (!author) return;
        author = author.trim();
        if (!author) return;
        bookName += ', автор: ' + author;
        const info=await addBookServer({bookcaseId,bookName});
        console.log(info);
        addBookDispatch({ bookcaseId, bookName });
    };
    return (
        <div className="bookcase"
            id={`case-${bookcaseId}`}>
            <header className="bookcase-header">
                {bookcaseName}
            </header>
            <div className="bookcase-books">
                {books.map((book, index) => (
                    <Book
                        bookName={book}
                        bookId={index}
                        bookcaseId={bookcaseId}
                        key={`case${bookcaseId}-${index}`}
                    />
                ))}
            </div>
            <footer
                className="bookcase-add-book"
                onClick={addBook}>
                Добавить книгу
            </footer>
        </div>
    );
};

const mapDispatchToProps = dispatch => ({
    addBookDispatch: ({ bookcaseId, bookName }) => dispatch(
        addBookAction({ bookcaseId, bookName })
    )
});
export default connect(
    null,
    mapDispatchToProps
)(memo(Bookcase));