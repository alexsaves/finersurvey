import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {changeAnswer} from '../../../../actions';

/**
* Represents a question
*/
class SortQuestion extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
    this.iptThrottle = null;
    this.state = {
      isDragging: false,
      dragItem: -1
    };
    this.initialOther = null;
  }

  /**
   * Handle when the text input changes (on a throttle)
   */
  handleIptThrottleChange(e) {
    let targ = e.currentTarget;
    this.initialOther = targ.value;
    clearTimeout(this.iptThrottle);
    this.iptThrottle = setTimeout(() => {
      this.handleAnswerChange();
    }, 200);
  }

  /**
   * Stop an eventual drag
   * @param {*} e
   */
  preventDrag(e) {
    e.stopPropagation();
  }

  /**
   * Start a drag
   * @param {*} e
   */
  handleDragStart(e) {
    let regions = [],
      root = ReactDOM.findDOMNode(this),
      sortables = root.getElementsByClassName('sortable'),
      targ = e.currentTarget,
      targWhich = parseInt(targ.getAttribute("data-which"));
    console.log(targ);
    function getRect(elm) {
      var bodyRect = document
          .body
          .getBoundingClientRect(),
        elemRect = elm.getBoundingClientRect(),
        offsetY = bodyRect.top - elemRect.top,
        offsetX = bodyRect.left - elemRect.left;
      return {
        x: elemRect.left,
        y: elemRect.top,
        x2: elemRect.right,
        y2: elemRect.bottom,
        w: elemRect.width,
        h: elemRect.height
      };
    }
    this.targetCoords = getRect(targ);
    for (let i = 0; i < sortables.length; i++) {
      regions.push(getRect(sortables[i]));
    }
    this.regions = regions;
    this.setState({dragItem: targWhich, isDragging: true});
    console.log(regions);
  }

  /**
 * Render the view
 */
  render() {
    let qname = this.props.name,
      ctx = this,
      answers = this.props.answer,
      count = 1,
      st = this.state,
      dragPlaceholderCSS = {},
      initialOther = this.initialOther;

    if (st.isDragging) {
      dragPlaceholderCSS.width = this.targetCoords.w;
      dragPlaceholderCSS.height = this.targetCoords.h;
    }
    console.log(st);
    return (
      <div className="question--sort">
        {this
          .props
          .choices
          .map((rt, idx) => {
            if (st.isDragging && st.dragItem == idx) {
              count++;
              return <label key={idx} className={"sortable standalonebutton drag--placeholder"}>&nbsp;</label>;
            } else {
              return <label
                key={idx}
                onMouseDown={this
                .handleDragStart
                .bind(this)}
                onTouchStart={this
                .handleDragStart
                .bind(this)}
                data-which={idx}
                className={"sortable standalonebutton "}>
                <div className="sortitem--container"><span className="sorticon fa fa-sort"/> {count++}. {rt}<input type="hidden" name={idx} value={idx}/></div>
              </label>;
            }
          })}
        {this.props.other === true && ((st.isDragging && st.dragItem == 9999)) && <label className={"sortable standalonebutton drag--placeholder"}>&nbsp;</label>}
        {this.props.other === true && (!(st.isDragging && st.dragItem == 9999)) && <label
          onMouseDown={this
          .handleDragStart
          .bind(this)}
          onTouchStart={this
          .handleDragStart
          .bind(this)}
          data-which="9999"
          className={"sortable standalonebutton othercontainer"}>
          <div className="sortitem--container textcontainer">
            <span className="sorticon fa fa-sort"></span><span className="countholder">{count}. </span>
            <input
              type="text"
              onMouseDownCapture={this
              .preventDrag
              .bind(this)}
              onTouchStartCapture={this
              .preventDrag
              .bind(this)}
              className="other--textfield"
              placeholder={this.props.otherplaceholder || ''}
              onKeyUp={ctx
              .handleIptThrottleChange
              .bind(ctx)}
              defaultValue={initialOther}/></div>
        </label>}
      </div>
    );
  }
}

// Connect the component
const ConnectedSortQuestion = connect()(SortQuestion)

// Expose the question
export default ConnectedSortQuestion;