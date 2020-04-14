import React, {Component, Fragment} from 'react';
import {Button } from 'react-materialize';
import PropTypes from 'prop-types';
import './modal.scss';
import classnames from 'classnames';

export default class Modal extends Component
{
    constructor(props)
    {
        super(props);
        
        this.state =
        {
            visible: false,
            loading: false
        }
    }
    static getDerivedStateFromProps(props, prevState)
    {
        let newState = {}
        
        if (props.visible != null &&
            props.visible !== prevState.visible)
            newState.visible = props.visible;
            
        if (props.loading != null &&
            props.loading !== prevState.loading)
            newState.loading = props.loading;
        
        return (Object.keys(newState).length === 0) ? null : newState;
    }
    
    render()
    {
        return (
            <div
                className={classnames('my-modal',
                            {
                                'visible': this.state.visible,
                                'large': this.props.large,
                                'animateFromBottom': this.props.animateFromBottom,
                                'autoHeight': this.props.autoHeight
                            }, this.props.className)}
                onClick={this.close.bind(this)}
            >
                <div className="card" onClick={(e) => e.stopPropagation()}>
                    <div className="header">
                        <div className="title">{ this.props.title }</div>
                        <ion-icon name="ios-close" onClick={this.close.bind(this)}/>
                    </div>
                    {
                        this.props.description &&
                        <div className="description">
                            { this.props.description }
                        </div>
                    }
                    <div className="body">
                        { this.props.children }
                    </div>
                    <div className="footer">
                        <div>
                            {
                                this.props.footerContent
                            }
                        </div>
                        <div className={ 'footer-action'}>
                            {
                                !this.state.loading &&
                                <Button
                                    className={ 'white black-text' }
                                    waves={'red'}
                                    onClick={this.onCancel.bind(this)}
                                >
                                    Cancel
                                </Button>
                            }
                            {
                                this.props.actionButtonLabel && this.props.onAction &&
                                <button
                                    className={'btn'}
                                    disabled={ this.props.onActionDisabled }
                                    onClick={() => this.props.onAction()}
                                >
                                    { this.props.actionButtonLabel }
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    close()
    {
        this.setState({ visible: false });
        
        if (this.props.onClose != null)
        {
            this.props.onClose();
        }
    }
    onCancel()
    {
        if (this.props.onCancel != null)
        {
            this.props.onCancel();
        }
    }
}

Modal.propTypes = {
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    title: PropTypes.string,
    actionButtonLabel: PropTypes.string,
    onAction: PropTypes.func,
    onCancel: PropTypes.func,
    loading: PropTypes.bool,
    large: PropTypes.bool,
    animateFromBottom: PropTypes.bool,
    className: PropTypes.string,
    autoHeight: PropTypes.bool,
    onActionDisabled: PropTypes.bool,
    footerContent: PropTypes.element
};

Modal.defaultProps = {
    onActionDisabled: false,
    footerContent: <Fragment/>
};