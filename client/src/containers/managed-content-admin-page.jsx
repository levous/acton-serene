import React, {
  Component,
} from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import path from 'path';
import { Button, Panel } from 'react-bootstrap';
import Turndown from 'turndown';
import Editor from '../components/editor';
import ResourceList from '../components/content-admin/resource-list';
import HttpStatusPresenter from '../components/http-status-presenter';
import LoadingSpinner from '../components/loading-spinner';

const propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const defaultProps = {};

const API_HOST = 'http://localhost:2004/';
const APP_KEY = 'example';

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


class ManagedContentAdminPage extends Component {

  constructor (props) {
    super(props)
    this.state = {
      updatedHtmlFragments: {},
      resourceList: null,
      managedContent: null,
      loading: false
    };

    this.showLoading = this.showLoading.bind(this);
    this.handleFetchError = this.handleFetchError.bind(this);

  }

  shouldComponentUpdate(nextProps, nextState ){

    // check explicit needs update for setState calls
    let needsUpdate = Object.entries(nextState).reduce((changeDetected, [key, nextValue]) => {
      switch (key) {
        case 'updatedHtmlFragments':
          //do nothing
          break;
        default:{
          // re-render on any state change
          if(nextValue !== this.state[key]) return true;
        }
      }
      return changeDetected
    }, false);

    // return if state changed or check explicit needs update props but any prop change is certainly? to require render
    return needsUpdate || Object.entries(nextProps).reduce((changeDetected, [key, value]) => {
      // re-render on any props change
      if(value !== this.props[key]) return true;
      return changeDetected
    }, false);
  }

  componentDidMount() {
    this.loadResourceList();
    this.loadManagedContent(this.props.match.params.resourceKey);
  }

  showLoading(loading){
    this.setState({loading: loading});
  }

//TODO: replace this inline shit with redux

  handleFetchError(err) {
    this.showLoading(false);
    console.error(err);
    alert(err);
  }

  loadResourceList() {
    const apiURI = API_HOST + path.join('api', 'content-packages', APP_KEY);
    console.log('loadResourceList apiURI:', apiURI);
    this.showLoading(true);
    fetch(apiURI)
      .then(response => {
        if (!response.ok) {
          this.setState({fetchResponseStatus: {code:response.status, message: response.statusText }});
          throw Error(response.statusText);
        }
        return response.json()
      })
      .then(data => {
        this.setState({ resourceList: data.resourceList});
        this.showLoading(false);
      })
      .catch(this.handleFetchError);
  }

  loadManagedContent(resourceKey) {
    const apiURI = API_HOST + path.join('api', 'content-packages', APP_KEY, resourceKey);
    console.log('loadmanagedContent apiURI:', apiURI);
    this.showLoading(true);
    fetch(apiURI)
      .then(response => {
        if (!response.ok) {
          this.setState({fetchResponseStatus: {code:response.status, message: response.statusText }});
          throw Error(response.statusText);
        }
        return response.json()
      })
      .then(data => {
        if(!data.managedContent) return console.error('No Managed Content returned from fetch');
        const htmlFragments = Object.assign({}, data.managedContent.html);
        // store both original and target to be modified in state
        this.setState({
          managedContent: data.managedContent,
          updatedHtmlFragments: htmlFragments
        });
        this.showLoading(false);
      })
      .catch(this.handleFetchError);
  }

  saveManagedContentFragment(containerKey) {

    const htmlFragment = this.state.updatedHtmlFragments[containerKey];
    if(!htmlFragment) return alert('UH OH!  The expected content was not found.  I got a null.  Please talk to Rusty');
    if(!this.state.managedContent) return alert('BRRRRT!  No Content Loaded to Save');

    this.showLoading(true);

    const apiURI = API_HOST + path.join('api', 'content-packages', APP_KEY, this.props.match.params.resourceKey, containerKey);
    const markdown = new Turndown().turndown(htmlFragment);

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    // losing context of 'this' in 'then' so referenced as 'that'.  there!
    //  (probably need to bind in ctor)
    const that = this;

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
      that.showLoading(false);
    }).catch(that.handleFetchError);
  }

  addNewResource(){
    
  }

  handleSelectResource(resource) {
    this.props.history.push(`/content-page/${resource.resourceTargetPath}`);
    this.loadManagedContent(resource.resourceTargetPath);
  }

  handleHtmlUpdate(containerKey, html){
    let htmlFragments = Object.assign({}, this.state.updatedHtmlFragments);
    htmlFragments[containerKey] = html;
    this.setState({updatedHtmlFragments: htmlFragments});
  }

  render() {
    // note:  shouldComponentUpdate is implemented in this component so
    //        calls to setState will not cause a re-render unless explicitly implemented
    let contentFragment = null;

    const fetchResponseStatus = this.state.fetchResponseStatus;

    const createFragmentEditor = (containerKey, fragment) => {
      console.log(containerKey);
      return (
        <Panel key={containerKey}>
          <Panel.Body>
            <h2>{containerKey}</h2>
            <Editor editorHtml={fragment} onHtmlUpdate={(html) => this.handleHtmlUpdate(containerKey, html) }/>
            <Button bsStyle="primary" style={{float:'right', marginTop: '25px'}} onClick={() => this.saveManagedContentFragment(containerKey) }>Save</Button>
            <small><div>{ contentFragment }</div></small>
          </Panel.Body>
        </Panel>
      )
    }

    const htmlFragments = this.state.updatedHtmlFragments || {};

    return (
      <div>
        <Button style={{float:'right', margin: '5px'}} onClick={() => this.addNewResource() }>+</Button>
        <div style={{clear:'both'}} />
        <ResourceList resourceList={this.state.resourceList}
          selectedResourceTargetPath={this.props.match.params.resourceKey}
          onSelectResource={(resource) => this.handleSelectResource(resource)}
          />

        <h1>{this.props.match.params.resourceKey}</h1>

        <Fade in={fetchResponseStatus} fetchResponseStatus={fetchResponseStatus} />
        <div>
          {Object.entries(htmlFragments).map(([key, value]) => createFragmentEditor(key, value))}
        </div>
        {
          //<Editor key={0} editorHtml={contentFragment} onHtmlUpdate={(html) => this.handleHtmlUpdate(CONTAINER_KEY, html) }/>

          //<Button bsStyle="primary" onClick={() => this.saveManagedContentFragment(CONTAINER_KEY) }>Save</Button>
        }
        <LoadingSpinner loading={this.state.loading} />
      </div>
    );
  }

}

ManagedContentAdminPage.propTypes = propTypes;
ManagedContentAdminPage.defaultProps = defaultProps;

export default withRouter(ManagedContentAdminPage);