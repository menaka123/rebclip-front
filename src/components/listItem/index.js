import React, {Component, Fragment} from 'react';
import { Icon, Row, Col, Card, CardTitle, Button } from 'react-materialize';
import PropTypes from 'prop-types';
import './listItem.scss'
import API from "../utils/API";

export default class Index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: null
        }
    }

    isValidUrl(string) {
        try {
            new URL(string);
        } catch {
            return false;
        }

        return true;
    }

    testURL(html) {
        let pattern1 = /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)/g;
        let pattern2 = /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g;
        let height = '300px';
        let width = '100%';
        let node = html;

        if (!this.isValidUrl(this.props.data.body)) {
            return false;
        }

        if (pattern1.test(html)){
            node = <iframe title={'vimeo'}  width={ width } height={ height } src={ html.replace(pattern1, '//player.vimeo.com/video/$1') } frameBorder="0" webkitallowfullscreen mozallowfullscreen allowFullScreen/>;
        }

        if (pattern2.test(html)){
            node = <iframe title={'youtube'} width={ width } height={ height } src={ html.replace(pattern2, 'http://www.youtube.com/embed/$1') } frameBorder="0" allowFullScreen/>;
        }

        if (html.match(/\.(jpeg|jpg|gif|png)$/) != null) {
            node = <CardTitle waves={'light'}  image={html} />;
        }

        if (html.match(/^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+=[a-z\-]+)?)?(;base64)?,[a-z0-9!$&',()*+,;=\-._~:@/?%\s]*\s*$/i) != null) {
            node = <CardTitle waves={'light'} image={html} />;
        }

        return node;

    }

    like () {

        if (this.props.data.liked) {
            return;
        }

        API.getInstance()
            .GET(`post/up-vote/${this.props.data.id}`)
            .then(res => {
                this.props.upVote(res.data, this.props.index);
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        const isURL = this.testURL(this.props.data.body);

        return (
            <Row>
                <Col
                    m={8}
                    s={12}
                    offset={'m2'}
                >
                    <Card
                        className={'hoverable'}
                        header={
                            <Fragment>
                                {
                                    isURL ?
                                        this.testURL(this.props.data.body)

                                        : null
                                }

                                <Button
                                    className={ `halfway-fab ${this.props.data.liked ? 'red' : 'grey'} up-vote` }
                                    floating
                                    icon={<Icon>keyboard_arrow_up</Icon>}
                                    waves={this.props.data.liked ? 'light' : 'red'}
                                    onClick={ () => this.like() }
                                />
                                {
                                    this.props.data.likes ?
                                        <Button
                                            className={ 'halfway-fab red up-vote-count' }
                                            floating
                                            small
                                        >
                                            {
                                                this.props.data.likes
                                            }
                                        </Button>
                                        :
                                        null
                                }

                            </Fragment>
                        }
                        title={ this.props.data.title }
                        children={
                            <span>
                                jhkhj
                            </span>

                        }
                    >
                        <div>
                            <p className="right small">
                                { this.props.data.diff }
                            </p>
                        </div>
                        <br/>
                        <div>
                            <p>
                                { !isURL ? this.props.data.body : null }
                            </p>
                        </div>
                        {
                            this.props.data.comments ?
                                <Button
                                    className={'halfway-fab white blue-text comment-count'}
                                    floating
                                    small
                                >
                                    { this.props.data.comments }
                                </Button>
                                : null
                        }

                        <Button
                            className={  `halfway-fab ${this.props.data.comment ? 'green' : 'grey'} comment` }
                            floating
                            icon={<Icon>chat_bubble_outline</Icon>}
                            waves={ this.props.data.comment ? 'light' : 'green'}
                            onClick={ () => this.props.commentView(this.props.data, this.props.index) }
                        />
                    </Card>


                </Col>
            </Row>
        );
    }
}

Index.propTypes =
    {
        index: PropTypes.number,
        data: PropTypes.object,
        upVote: PropTypes.func,
        commentView: PropTypes.func
    };
