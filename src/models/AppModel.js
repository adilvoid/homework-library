const getBookcases = async () => {
    const response = await fetch('http://localhost:4321/bookcases');
    const bookcases = await response.json();
    return bookcases;
}

const addBookcase = async (bookcase) => {
    const response = await fetch('http://localhost:4321/bookcases', {
        method: 'POST',
        body: JSON.stringify(bookcase),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const { info } = await response.json();
    return info;
};
const addBook = async ({ bookcaseId, bookName }) => {
    const response = await fetch(`http://localhost:4321/bookcases/${bookcaseId}/books`, {
        method: 'POST',
        body: JSON.stringify({ bookName }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const { info } = await response.json();
    return info;
};

const editBook = async ({ bookcaseId, bookId, newBookName }) => {
    const response = await fetch(`http://localhost:4321/bookcases/${bookcaseId}/books/${bookId}`, {
        method: 'PUT',
        body: JSON.stringify({ newBookName }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const { info } = await response.json();
    return info;
};

const removeBook = async ({ bookcaseId, bookId }) => {
    const response = await fetch(`http://localhost:4321/bookcases/${bookcaseId}/books/${bookId}`, {
        method: 'DELETE'
    });
    const { info } = await response.json();
    return info;
};

const moveBook = async ({ bookcaseId, bookId, toBookcaseId }) => {
    const response = await fetch(`http://localhost:4321/bookcases/${bookcaseId}`, {
        method: 'PATCH',
        body: JSON.stringify({ bookId, toBookcaseId }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.status !== 200) {
        const { error } = await response.json();
        return Promise.reject(error);
    }
    const { info } = await response.json();
    return info;
};

export {
    getBookcases,
    addBookcase,
    addBook,
    editBook,
    moveBook,
    removeBook
};