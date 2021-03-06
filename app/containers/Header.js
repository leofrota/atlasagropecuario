import { Col } from 'react-bootstrap'
import * as actions from '../redux/actions'
import { connect } from 'react-redux'
import News from '../components/News'
import Publications from '../components/Publications'

const Header = (props) => {
    var logo_gde = props.language === "pt-BR" ? require("../img/atlas_logo.png") : require("../img/atlas_logo_ENGLISH.png");
    var logo_pqn = props.language === "pt-BR" ? require("../img/atlas_logo_320.png") : require("../img/atlas_logo_ENGLISH_320.png")
    return (
        <div>
            <Col id="atlas_logo" xs={12} sm={6}>
                <img id="atlas_logo_gde" src={logo_gde} alt="Logo do Atlas da Agropecuária Brasielira" />
                <img id="atlas_logo_pqn" src={logo_pqn} alt="Logo do Atlas da Agropecuária Brasielira" />
            </Col>
            <Col xs={12} className="HEADER_CINZA"></Col>
            <Col xs={12} className="HEADER_BRANCO">
                <nav className="navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#menu" aria-expanded="false">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                        </div>
                        <div className="collapse navbar-collapse" id="menu">
                            <ul className="nav navbar-nav">
                                <li><button className="btn btn-default uppercase" onClick={props.toggleNews}>{props.translation["news"]}</button></li>
                                <li><button className="btn btn-default uppercase" onClick={props.togglePublications}>{props.translation["publications"]}</button></li>
                                <li><button className="btn btn-default uppercase" onClick={props.openDownloadForm}>{props.translation["database"]}</button></li>
                                <li>
                                    <select onChange={(e) => props.changeLanguage(e.target.value)} className="btn btn-default" defaultValue={navigator.language.startsWith('pt') ? 'pt-BR' : 'en-US'}>
                                        <option value="pt-BR">PORTUGUÊS</option>
                                        <option value="en-US">ENGLISH</option>
                                    </select>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </Col>
            <News show={props.newsVisible} handleHide={props.toggleNews} />
            <Publications show={props.publicationsVisible} handleHide={props.togglePublications} />
        </div>
    )
};

const mapStateToProps = (state, ownProps) => {
    return {
        newsVisible: state.news.show,
        publicationsVisible: state.publications.show,
        translation: state.translation,
        language: state.language
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        toggleNews: () => {
            dispatch(actions.toggleNews())
        },
        togglePublications: () => {
            dispatch(actions.togglePublications())
        },
        changeLanguage: (language) => {
            dispatch(actions.changeLanguage(language))
        },
        openDownloadForm: () => {
            dispatch(actions.openDownloadForm(undefined))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)