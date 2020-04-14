import React, {Component, Fragment} from 'react';
import {Row, Col, TextInput, Button, Icon } from 'react-materialize';
import Modal from '../utils/Modal';
import PropTypes from 'prop-types';
import './post.scss'
import API from "../utils/API";

export default class Index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            postShowModal: false,
            post: {
                title: '',
                body: ''
            },
            postBtnDisabled: true
        }
    }

    post() {
        API.getInstance()
            .POST('post', this.state.post)
            .then(res => {
                //console.log(res)
                this.props.onSuccess()
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.setState({postShowModal: false})
            })

    }

    handleInputChange = (event) => {
        let post = this.state.post;
        post[event.target.name] = event.target.value;

        this.setState({
            post
        });
    };

    render() {
        return (
            <Fragment>
                <Button
                    className="red add-new-post"
                    fab={{
                        direction: 'left'
                    }}
                    icon={<Icon>add_to_photos</Icon>}
                    floating
                    large
                    waves={'light'}
                    onClick={ () => this.setState({
                        postShowModal: true,
                        post: {
                            title: '',
                            body: ''
                        }
                    }) }
                />
                <Modal
                    visible={this.state.postShowModal}
                    onClose={  () => this.setState({postShowModal: false}) }
                    onCancel={ () => this.setState({postShowModal: false}) }
                    title='Create post'
                    actionButtonLabel='Post'
                    onAction={() => this.post()}
                    onActionDisabled={ this.state.post.title < 1 || this.state.post.body < 1 }
                >
                    <Row>
                        <form className="col s12">
                            <Row>
                                <Col
                                    s={12}
                                    className="input-field"
                                >
                                    <TextInput
                                        id="title"
                                        name={ 'title' }
                                        label="Title"
                                        data-length={300}
                                        s={12}
                                        onChange={ e => this.handleInputChange(e) }
                                        value={ this.state.post.title }
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col
                                    s={12}
                                    className="input-field description"
                                >
                                    <textarea
                                        id="body"
                                        name={ 'body' }
                                        className="materialize-textarea"
                                        onChange={ e => this.handleInputChange(e) }
                                        value={ this.state.post.body }
                                    />
                                    <label className={ 'label-body' } htmlFor="body">Write something here or paste a URL...</label>
                                </Col>
                            </Row>
                        </form>
                    </Row>
                </Modal>
            </Fragment>
        );
    }
}

Index.propTypes = {
    onSuccess: PropTypes.func,
};
