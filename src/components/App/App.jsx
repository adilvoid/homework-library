import React, { Fragment, PureComponent } from "react";
import { connect } from 'react-redux';
import { addBookcase, getBookcases } from "../../models/AppModel.js";
import { addBookcaseAction, dowloadBookcasesAction } from '../../store/actions.js';
import Bookcase from "../Bookcase/Bookcase.jsx";
import './App.css';

class App extends PureComponent {
    state = {
        isInputShown: false,
        bookcaseName: ''
    };
    async componentDidMount() {
        const bookcases = await getBookcases();
        this.props.downloadBookcasesDispatch(bookcases);
    }
    showInput = () => this.setState({ isInputShown: true });
    onBookcaseNameInput = (value) => this.setState({
        bookcaseName: value
    });
    handleKeyDown = async (event) => {
        if (event.key === 'Escape') {
            this.setState({
                isInputShown: false,
                bookcaseName: ''
            });
            return;
        }
        if (event.key === 'Enter') {
            const { bookcaseName } = this.state;
            if (bookcaseName) {
                const info = await addBookcase({
                    bookcaseName: this.state.bookcaseName,
                    books: []
                });
                console.log(info);
                this.props.addBookcaseDispatch(bookcaseName);
            }

            this.setState({
                isInputShown: false,
                bookcaseName: ''
            });
        }
    };

    render() {
        const {
            isInputShown,
            bookcaseName,
        } = this.state;
        const { bookcases } = this.props;
        return (
            <Fragment>
                <header id="main-header">
                    Библиотека
                    <div id="user">
                        Заведующий библиотекой
                        <div className="avatar"></div>
                    </div>
                </header>
                <main id="lib-container">
                    <Fragment>
                        {bookcases.map(({ bookcaseName, books }, index) => (
                            <Bookcase
                                bookcaseName={bookcaseName}
                                bookcaseId={index}
                                books={books}
                                key={`case${index}`}
                            />
                        ))}
                    </Fragment>
                    <div className="bookcase">
                        {!isInputShown && (
                            <header
                                className="bookcase-header"
                                id="add-bookcase-button"
                                onClick={this.showInput}>
                                Добавить книжный шкаф
                            </header>)}
                        {isInputShown && (<input type="text"
                            id="add-bookcase-input"
                            placeholder="Новый шкаф"
                            onChange={({ target: { value } }) => this.onBookcaseNameInput(value)}
                            onKeyDown={this.handleKeyDown}
                            value={bookcaseName}
                        />)}
                    </div>
                </main>
            </Fragment>
        );
    }
}

const mapStateToProps = ({ bookcases }) => ({ bookcases });
const mapDispatchToProps = dispatch => ({
    addBookcaseDispatch: (bookcaseName) => dispatch(addBookcaseAction(bookcaseName)),
    downloadBookcasesDispatch: (bookcases) => dispatch(dowloadBookcasesAction(bookcases))
});
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);