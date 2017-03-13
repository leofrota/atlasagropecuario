import React, { Component, PropTypes } from 'react'
import BaseForm from '../components/BaseForm'
import FieldGroup from '../components/FieldGroup'
import { connect } from 'react-redux'
import * as actions from '../redux/actions'

class DownloadForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <BaseForm 
                handleSubmit={this.props.submitDownload} 
                handleHide={this.props.hideDownload} 
                show={this.props.show} 
                title={this.props.title} 
                buttonText="Download" 
                textAreaPlaceholder="Finalidade de uso da camada..." 
                textAreaLabel="Finalidade">
            </BaseForm>
        );
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        layer: state.download.layer,
        show: state.download.show,
        title: state.download.layer && state.layers[state.download.layer].name
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        hideDownload: () => {
            dispatch(actions.hideDownload())
        },
        submitDownload: (data) => {
            dispatch(actions.submitDownload(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadForm)

