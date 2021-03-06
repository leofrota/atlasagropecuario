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

    var scaleLine = new ol.control.ScaleLine();

    var mousePosition = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(2),
        projection: 'EPSG:4326',
        target: document.getElementById('coordinates'),
        undefinedHTML: '&nbsp;'
      });

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
            url: servUrl + 'geoserver/service=WMS',
            params: { 'LAYERS': 'geonode:' + this.props.coverLayer, 'TILED': true },
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
        center: this.props.center,
        zoom: this.props.zoom,
        maxZoom: 14,
        minZoom: 4,
        extent: ol.proj.transformExtent([-180,-90,180,90], 'EPSG:4326', 'EPSG:3857') 
      }),
      overlays: [this.props.overlay],
      controls: ol.control.defaults().extend([scaleLine, mousePosition]),
    });
    this.setState({
      map: map
    });
 
    map.on('click', function(evt) {
      var coordinates = evt.coordinate;
      console.log(this.props.coverLayer);
      this.props.getInformation(coordinates[0], coordinates[1], this.props.coverLayer);
    }.bind(this));

    map.on('moveend', function() {
      var view = map.getView();
      this.props.setMapView(view.getZoom(), view.getCenter());
    }.bind(this));

  }
  

  componentDidUpdate(prevProps, prevState) {
    var view = this.state.map.getView();
    view.setZoom(this.props.zoom);    
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.coverLayer != nextProps.coverLayer)
    {
      var source = new ol.source.TileWMS({
            url: servUrl + 'geoserver/service=WMS',
            params: { 'LAYERS': 'geonode:' + nextProps.coverLayer, 'TILED': true },
            serverType: 'geoserver'
          });
      this.state.map.getLayers().getArray()[1].setSource(source);
    }
    return false;
  }'  '
  

  render() {
    return (
      <div>
        <div id="map" className="map" ref="map"></div>
        <div id="coordinates"></div>
      </div>
    );
  }
}


Map.propTypes = {
  zoom: PropTypes.number,
  center: PropTypes.arrayOf(PropTypes.number),
  layers: PropTypes.arrayOf(String),
};



const mapStateToProps = (state, ownProps) => {
  return {
    zoom: state.map.zoom,
    center: state.map.center,
    layers: state.map.layers,
    infoWindow: state.infoWindow,
    coverLayer: state.map.coverLayer,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getInformation: (x, y, layer) => {
      dispatch(actions.getInformation(x, y, layer))
    },
    setMapView: (zoom, center) => {
      dispatch(actions.setMapView(zoom, center))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map)





