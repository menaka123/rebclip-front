import React, {Component, Fragment} from 'react';
import {Row, Col } from 'react-materialize';
import Modal from '../utils/Modal';
import PropTypes from 'prop-types';
import './comment.scss'
import API from "../utils/API";

export default class Index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            commentsLoaded: false,
            comment: {
                comment: ''
            },
            parent_id: 0,
            postBtnDisabled: true,
            commentList: [],
            replyTo: null
        }
    }

    getComments () {
        if (this.props.index >= 0 && this.props.index  !== null) {
            API.getInstance()
                .GET(`post/${this.props.data.id}`)
                .then(res => {
                    this.setState({
                        commentList: res
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    componentDidMount () {
        this.getComments()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.index !== this.props.index) {
            this.getComments()
        }
    }


    post() {
        let comment = this.state.comment;
        comment.post_id = this.props.data.id;
        if (this.state.parent_id) {
            comment.parent_id = this.state.parent_id;
        }

        API.getInstance()
            .POST('comment', comment)
            .then(res => {
                this.setState({
                    comment: {
                        comment: '',
                    },
                    parent_id: null,
                    replyTo: null
                });
                this.getComments();
            })
            .catch(err => {
                console.log(err);
            });

    }

    handleInputChange = (event) => {
        let comment = this.state.comment;
        comment[event.target.name] = event.target.value;

        this.setState({
            comment
        });
    };

    footerContent () {
        return <Row>
            {
                this.state.replyTo ?
                    <Col>
                        <p className={'blue-text'}>reply to: { this.state.replyTo }</p>
                    </Col>
                    :
                    null
            }
            <Col
                s={12}
                className="input-field"
            >
                <textarea
                    id="comment"
                    name={ 'comment' }
                    className="materialize-textarea"
                    onChange={ e => this.handleInputChange(e) }
                    value={ this.state.comment.comment }
                />
                <label className={ 'label-body' } htmlFor="body">Write something here...</label>
            </Col>
        </Row>
    }

    reply (parent) {
        this.setState({
            replyTo: parent.comment,
            parent_id: parent.id
        })
    }

    like (item) {
        if (item.liked) {
            return;
        }

        API.getInstance()
            .GET(`comment/up-vote/${item.id}`)
            .then(res => {

                this.getComments();
            })
            .catch(err => {
                console.log(err)
            })
    }


    commentRender (list, offset = 0) {
        let offsetHolder = offset + 1;
        return list.map((item, key) => {
            return <Fragment key={key}>
                <Col s={12-offset} offset={`s${offset}`}>
                    <blockquote>
                        {
                            item.comment
                        }
                        {
                            item.likes ? <span className="likes badge red">{item.likes } likes</span> : null
                        }
                        <div className={ 'comment-reply' }>
                            <div className={ 's12' }>
                                <button onClick={ () => this.reply(item)} className="btn-small white black-text">reply</button>
                                <button onClick={ () => this.like(item) } className="btn-small white black-text">like</button>
                            </div>
                            {
                                item.children ? <p className={'reply'}>View {item.children.length} replies</p> : null
                            }

                            <p >: {item.diff}</p>
                        </div>
                    </blockquote>
                </Col>
                {
                    item.children ? this.commentRender(item.children, offsetHolder) : null
                }
            </Fragment>
        })

    }


    render() {
        return (
            <Fragment>
                <Modal
                    visible={ this.props.show }
                    onClose={  () => this.props.close() }
                    onCancel={ () => this.props.close() }
                    actionButtonLabel='Post'
                    onAction={() => this.post()}
                    footerContent={ this.footerContent() }
                    large={ true }
                    onActionDisabled={ this.state.comment.comment.length < 1 }
                >
                    {
                        this.state.commentList.length ?
                            null :
                            <Row>
                                <Col
                                    m={8}
                                    s={12}
                                    offset={'m2'}
                                >
                                    <div>
                                        <h2 className="center-align">Enter 1st Comment!</h2>
                                    </div>
                                </Col>
                            </Row>
                    }
                    <Row>
                        {
                            this.commentRender(this.state.commentList)
                        }
                    </Row>

                </Modal>
            </Fragment>
        );
    }
}

Index.propTypes = {
    show: PropTypes.bool,
    close: PropTypes.func,
    onSuccess: PropTypes.func,
    data: PropTypes.object,
    index: PropTypes.number,
};
