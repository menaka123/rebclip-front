import React, {Component, Fragment} from 'react';
import './home.scss';
import { Navbar, Container, Section, Row, Col } from 'react-materialize';
import API from "../utils/API";
import ListItem from '../listItem';
import Post from '../post';
import Comment from '../comment';

export default class Home extends Component {

    constructor(props)
    {
        super(props);
        this.upVote = this.upVote.bind(this);
        this.commentView = this.commentView.bind(this);
        this.state = {
            listData: [],
            loadingList: false,
            commentShowModal: false,
            commentData: {
                id: null
            },
            commentIndex: null
        };
    }

    updateListData() {
        this.loadData();
    }

    loadData() {
        this.setState({
            loadingList: false
        }, () => {
            API.getInstance()
                .GET('posts')
                .then(res => {
                    console.log(res);
                    this.setState({
                        listData: res.data
                    })
                })
                .finally(() => {
                    this.setState({
                        loadingList: true
                    });
                })
        });
    }

    componentDidMount () {
        this.loadData();
    }

    upVote (data, index) {
        let listData = this.state.listData;
        data.liked = true;
        listData[index] = data;
        this.setState({
            listData
        })
    }

    commentView (data, index) {
        this.setState({
            commentShowModal: true,
            commentIndex: index,
            commentData: data
        });
    }

    render() {
        return (
            <Fragment>
                <Navbar
                    alignLinks="right"
                    brand={<a className="brand-logo" href="/">redclip</a>}
                    centerChildren
                    id="mobile-nav"
                    options={{
                        draggable: true,
                        edge: 'left',
                        inDuration: 250,
                        onCloseEnd: null,
                        onCloseStart: null,
                        onOpenEnd: null,
                        onOpenStart: null,
                        outDuration: 200,
                        preventScrolling: true
                    }}
                />
                <Container>
                    <Section>
                        {
                            this.state.listData.map((item, key) => {
                                return <ListItem
                                    key={ key }
                                    index={ key }
                                    data={ item }
                                    upVote={ this.upVote }
                                    commentView={ this.commentView }
                                />
                            })
                        }
                        {
                            !this.state.loadingList ?
                                null
                                :
                                <Row>
                                    <Col
                                        m={8}
                                        s={12}
                                        offset={'m2'}
                                    >
                                        <div>
                                            <h2 className="center-align">You have Reached to The End!</h2>
                                        </div>
                                    </Col>
                                </Row>
                        }
                    </Section>
                </Container>

                <Post
                    onSuccess={ () => this.updateListData() }
                />

                <Comment
                    show={ this.state.commentShowModal }
                    close={ () => this.setState({ commentShowModal: false }) }
                    index={ this.state.commentIndex }
                    data={ this.state.commentData }
                    onSuccess={ () => { console.log('dd') }}
                />
            </Fragment>
        );
    }
}
