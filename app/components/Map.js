import ol from 'openlayers'
import { connect } from 'react-redux'
import * as actions from '../redux/actions'
import { PropTypes } from 'react'

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null,
    };
  }

  componentDidMount() {

    var map = new ol.Map({
      layers: [
        new ol.layer.Tile({
          source: new ol.source.XYZ({
            attributions: [new ol.Attribution({
              html: '© <a target="_blank" href="http://cartodb.com/attributions">CartoDB</a> ' +
              '© <a target="_blank" href="http://www.openstreetmap.org/copyright">' +
              'OpenStreetMap</a>' + ' © <a target="_blank" href="http://www.imaflora.org">Imaflora</a> '
            })],
            url: 'https://cartodb-basemaps-c.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png'
          })
        }),
        new ol.layer.Tile({
          source: new ol.source.TileWMS({
            url: servUrl,
            params: { 'LAYERS': 'geonode:land_tenure_categories', 'TILED': true },
            serverType: 'geoserver'
          })
        }),
        new ol.layer.Tile({
          source: new ol.source.XYZ({
            attributions: [new ol.Attribution({
              html: '© <a target="_blank" href="http://cartodb.com/attributions">CartoDB</a> ' +
              '© <a target="_blank" href="http://www.openstreetmap.org/copyright">' +
              'OpenStreetMap</a>' + ' © <a target="_blank" href="http://www.imaflora.org">Imaflora</a> '
            })],
            url: 'https://stamen-tiles-d.a.ssl.fastly.net/toner-hybrid/{z}/{x}/{y}.png'
          })
        }),
      ],
      target: this.refs.map,
      view: new ol.View({
        projection: 'EPSG:3857',
        center: [-5679446.090587838, -2172541.4206502824],
        zoom: this.props.zoom
      }),
      overlays: [this.props.overlay]
    });
    this.setState({
      map: map
    });

    map.on('click', function (evt) {
      var coordinates = evt.coordinate;
      this.props.overlay.setPosition(coordinates);
      this.props.getInformation(coordinates[0], coordinates[1]);
    }.bind(this));

  }

  componentDidUpdate(prevProps, prevState) {
    var view = this.state.map.getView();
    view.setZoom(this.props.zoom);
  }

  render() {




    return (
      <div id="map" className="map" ref="map">
      </div>
    );
  }
}


Map.propTypes = {
  zoom: PropTypes.number,
  center: PropTypes.number,
  layers: PropTypes.arrayOf(String),
};



const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getInformation: (x, y) => {
      dispatch(actions.getInformation(x, y))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map)





