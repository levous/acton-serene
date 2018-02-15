import React from 'react';
import PropTypes from 'prop-types';
import ReactQuill, {Quill} from 'react-quill';
import {ImageDrop} from 'quill-image-drop-module';
import ImageResize from 'quill-image-resize-module';
import 'react-quill/dist/quill.snow.css';

Quill.register('modules/imageDrop', ImageDrop);
Quill.register('modules/imageResize', ImageResize);

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
    this.handleChange = this.handleChange.bind(this);
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
