import React, {
  Component,
} from 'react';

import { Button } from 'react-bootstrap'
import Editor from '../components/Editor';
import path from 'path';

const propTypes = {};

const defaultProps = {};

const API_HOST = 'http://localhost:2004/';
const APP_KEY = 'example';

export default class ContentPackageAdminPage extends Component {

  constructor (props) {
    super(props)
    this.state = {editorHtml: ''};
  }

  shouldComponentUpdate(nextProps, nextState ){
    // check explicit needs update
    if(this.state.contentPackage !== nextState.contentPackage) return true;
    // do not rerender when html changes invoke setState
    return false;
  }

  componentDidMount() {

    const apiURI = API_HOST + path.join('api', 'content-packages', APP_KEY, this.props.match.params.resourceKey);
    console.log(apiURI);
    fetch(apiURI)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json()
      })
      .then(data => {
        this.setState({ contentPackage: data.contentPackage});
      })
      .catch(console.log);
  }

  showMe(){
    alert(this.state.editorHtml);
  }

  handleHtmlUpdate(html){
    this.setState({editorHtml: html});
  }

  render() {

    let contentFragment = null;
    if(this.state.contentPackage) {
      contentFragment = this.state.contentPackage.contentFragments[0].markdown;
      console.log('>>> FRAGMENT');
      console.log(this.state.contentPackage.contentFragments[0]);
    }

    return (
      <div>
        <h1>{this.props.match.params.resourceKey}</h1>
        <Editor key={0} editorHtml={contentFragment} onHtmlUpdate={(html) => this.handleHtmlUpdate(html) }/>
        <Button bsStyle="primary" onClick={() => this.showMe() }>Primary</Button>
        { contentFragment && <div>{contentFragment}</div>}
      </div>
    );
  }

}

ContentPackageAdminPage.propTypes = propTypes;
ContentPackageAdminPage.defaultProps = defaultProps;
