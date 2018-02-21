import React from 'react';
import PropTypes from 'prop-types';
import ReactQuill, {Quill} from 'react-quill';
import Parchment from 'parchment';
import {ImageDrop} from 'quill-image-drop-module';
import ImageResize from 'quill-image-resize-module';
import 'react-quill/dist/quill.snow.css';
// ensure attributes are maintained the editor after update / save

/*
var ImageFormat = Quill.import('formats/image');
const IMAGE_FORMAT_ATTRIBUTES = [
    'alt',
    'height',
    'width',
    'style'
];

ImageFormat.formats = function formats(domNode : any): any {
  return IMAGE_FORMAT_ATTRIBUTES.reduce((formats, attribute) => {
    if (domNode.hasAttribute(attribute)) {
      formats[attribute] = domNode.getAttribute(attribute);
    }
    return formats;
  }, {});
};

ImageFormat.prototype.format = function format(name : string, value : any): void {
  debugger;
  if (IMAGE_FORMAT_ATTRIBUTES.indexOf(name) !== -1) {
    if (value) {
      this.domNode.setAttribute(name, value);
    } else {
      this.domNode.removeAttribute(name);
    }
  } else {
    this.super.format(name, value);
  }
};

*/
/*

var BaseImageFormat = Quill.import('formats/image');
const ImageFormatAttributesList = [
    'alt',
    'height',
    'width',
    'style'
];
class ImageFormat extends BaseImageFormat {
  static formats(domNode) {
    return ImageFormatAttributesList.reduce(function(formats, attribute) {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }

  format(name, value) {
    debugger;
    if (ImageFormatAttributesList.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}
*/


const ParchmentEmbed = Quill.import('blots/embed');
console.log('>>>> ParchmentEmbed');
console.log(ParchmentEmbed);
const ATTRIBUTES = [
  'alt',
  'height',
  'width',
  'style'
];


class ImageWithStyle extends ParchmentEmbed {
  static create(value) {
    let node = super.create(value);
    if (typeof value === 'string') {
      node.setAttribute('src', this.sanitize(value));
    }
    return node;
  }

  static formats(domNode) {
    //debugger;
    return ATTRIBUTES.reduce(function(formats, attribute) {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }

  static match(url) {
    return /\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url);
  }

  static sanitize(url) {
    return url;
    //return sanitize(url, ['http', 'https', 'data']) ? url : '//:0';
  }

/*
  static value(domNode) {
    debugger;
    return domNode.getAttribute('src');
  }*/

  format(name, value) {
    debugger;
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}
ImageWithStyle.blotName = 'imagewithstyle';
ImageWithStyle.tagName = 'IMG';

//Quill.register(ImageWithStyle, true);
Quill.register('modules/imageDrop', ImageDrop);
Quill.register('modules/imageResize', ImageResize);

Quill.register(new Parchment.Attributor.Style('display', 'display', { whitelist: ['inline', 'block'] }));
Quill.register(new Parchment.Attributor.Style('float', 'float', { whitelist: ['left', 'right'] }));
Quill.register(new Parchment.Attributor.Style('margin', 'margin', {}));


const propTypes = {
  placeholderText: PropTypes.string,
  editorHtml: PropTypes.string,
  onHtmlUpdate: PropTypes.func
};

const defaultProps = {};

/* **
 * Simple editor component that takes placeholder text as a prop
 */
class Editor extends React.Component {
  constructor (props) {
    super(props);
    this.quillRef = null;
    this.reactQuillRef = null;
    this.handleChange = this.handleChange.bind(this);
    this.registerFormats = this.registerFormats.bind(this);
  }

  componentDidMount () {
    this.registerFormats()
  }

  componentDidUpdate () {
    this.registerFormats()
  }

  registerFormats () {
    window.Quill = Quill;
    // Ensure React-Quill references is available:
    if (typeof this.reactQuillRef.getEditor !== 'function') return;
    // Skip if Quill reference is defined:
    if (this.quillRef != null) return;

    console.log('Registering formats...', this.reactQuillRef)
    const quillRef = this.reactQuillRef.getEditor() // could still be null

    if (quillRef != null) {
      this.quillRef = quillRef;
      console.log(Quill.imports)
    }
  }

  handleChange(content, delta, source, editor) {

    //  value is a delta, get html contents instead.
    //    Delta might be badass: https://github.com/zenoamaro/react-quill#using-deltas
    const html = editor.getHTML();
    if(this.props.onHtmlUpdate) this.props.onHtmlUpdate(html);
  }

  render () {
    return (
      <div>
        <style>
          {".ql-editor { min-height: 15em}"}
        </style>
        <ReactQuill
          ref={(el) => { this.reactQuillRef = el }}
          theme='snow'
          onChange={this.handleChange}
          value={this.props.editorHtml}
          modules={Editor.modules}
          formats={Editor.formats}
          bounds={'.app'}
          placeholder='Author or Paste your contents'
         />
       </div>
     )
  }
}

/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
Editor.modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'},
     {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
  imageDrop: true,
  imageResize: {}
}
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
Editor.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video'
]

Editor.propTypes = propTypes;
Editor.defaultProps = defaultProps;


export default Editor;
