import React, {
  Component,
} from 'react';
import { Transition } from 'react-transition-group';
import path from 'path';
import { Button } from 'react-bootstrap'
import Turndown from 'turndown';
import Editor from '../components/Editor';
import HttpStatusPresenter from '../components/HttpStatusPresenter';

const propTypes = {};
const defaultProps = {};

const API_HOST = 'http://localhost:2004/';
const APP_KEY = 'example';
const CONTAINER_KEY = 'top-right';

const duration = 300;

const defaultTransitionStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
  padding: 20,
  margin: 10,
  display: 'inline-block',
  backgroundColor: '#dddddd',
  borderRadius: '1em',
}

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
};

const Fade = ({ in: inProp, fetchResponseStatus }) => (
  <Transition in={inProp} timeout={duration}>
    {(state) => (
      <div style={{
        ...defaultTransitionStyle,
        ...transitionStyles[state]
      }}>
        {fetchResponseStatus && <HttpStatusPresenter statusCode={fetchResponseStatus.code} statusText={fetchResponseStatus.message} />}
      </div>
    )}
  </Transition>
);


export default class managedContentAdminPage extends Component {

  constructor (props) {
    super(props)
    this.state = {editorHtml: ''};
  }

  shouldComponentUpdate(nextProps, nextState ){
    // check explicit needs update
    if(this.state.managedContent !== nextState.managedContent) return true;
    if(this.state.fetchResponseStatus !== nextState.fetchResponseStatus) return true;
    // do not rerender when html changes invoke setState
    return false;
  }

  componentDidMount() {
    this.loadmanagedContent();
  }

  loadmanagedContent() {
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
        this.setState({ managedContent: data.managedContent});
      })
      .catch(console.log);
  }

  saveManagedContent() {
    if(!this.state.managedContent) return alert('BRRRRT!  No Content Loaded to Save');
    const that = this;
    const apiURI = API_HOST + path.join('api', 'content-packages', APP_KEY, this.props.match.params.resourceKey, CONTAINER_KEY);
    const markdown = new Turndown().turndown(this.state.editorHtml);

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    fetch(apiURI, {
      method: 'post',
      body: JSON.stringify({markdown: markdown}),
      headers: headers
    }).then(function(response) {
      if (!response.ok) {
        that.setState({fetchResponseStatus: {code:response.status, message: response.statusText }})
        throw Error(response.statusText);
      }
      return response.json();
    }).then(function(data) {
      alert(data);
    }).catch(console.log);
  }

  handleHtmlUpdate(html){
    this.setState({editorHtml: html});
  }

  render() {
    // note:  shouldComponentUpdate is implemented in this component so
    //        calls to setState will not cause a re-render unless explicitly implemented
    let contentFragment = null;

    const fetchResponseStatus = this.state.fetchResponseStatus;
    if(this.state.managedContent) {
      contentFragment = this.state.managedContent.html[CONTAINER_KEY];
      console.log('>>> FRAGMENT');
      console.log(this.state.managedContent.html[CONTAINER_KEY]);
    }

    return (
      <div>
        <h1>{this.props.match.params.resourceKey}</h1>

        <Fade in={fetchResponseStatus} fetchResponseStatus={fetchResponseStatus} />


        <Editor key={0} editorHtml={contentFragment} onHtmlUpdate={(html) => this.handleHtmlUpdate(html) }/>
        <Button bsStyle="primary" onClick={() => this.saveManagedContent() }>Save</Button>
        { contentFragment && <div>{contentFragment}</div>}
      </div>
    );
  }

}

managedContentAdminPage.propTypes = propTypes;
managedContentAdminPage.defaultProps = defaultProps;
