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
      dragItem: -1,
      hoverPosition: -1,
      currentOrder: [],
      dragOrder: []
    };
    this.initialOther = null;
    for (let j = 0; j < this.props.choices.length; j++) {
      this
        .state
        .currentOrder
        .push(j);
    }
    if (this.props.other === true) {
      this
        .state
        .currentOrder
        .push(9999);
    }
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
    console.log("PREVENT");
    e.stopPropagation();
  }

  /**
   * Calculate a new order for a selected index
   * @param {*} selectedIndex
   */
  calcDragOrderForSelected(hoverIndex, selectedIndex) {
    let result = [],
      itemOffset = 0;
    for (let j = 0; j < this.state.currentOrder.length; j++) {
      result[j] = this.state.currentOrder[j];
    }
    for (let j = 0; j < result.length; j++) {
      if (result[j] == selectedIndex) {
        result.splice(j, 1);
        break;
      }
    }
    result.splice(hoverIndex, 0, -1);
    return result;
  }

  /**
   * Start a drag
   * @param {*} e
   */
  handleDragStart(e) {
    console.log("start");
    let regions = [],
      root = ReactDOM.findDOMNode(this),
      sortables = root.getElementsByClassName('sortable'),
      targ = e.currentTarget,
      targWhich = parseInt(targ.getAttribute("data-which"));
    if (this.state.isDragging) {
      return;
    }
    this.proxyDM = this
      .handleDragMove
      .bind(this);
    this.proxySD = this
      .dropDrag
      .bind(this);

    window.addEventListener('touchmove', this.proxyDM, true);
    window.addEventListener('mousemove', this.proxyDM, true);
    window.addEventListener('mouseup', this.proxySD, true);
    window.addEventListener('mouseleave', this.proxySD, true);
    window.addEventListener('touchcancel', this.proxySD, true);
    window.addEventListener('touchend', this.proxySD, true);
    
    if (e.touches && e.touches.length > 0) {
      e = e.touches[0];
    }
    function getRect(elm) {
      var bodyRect = document
          .body
          .getBoundingClientRect(),
        elemRect = elm.getBoundingClientRect(),
        offsetY = bodyRect.top - elemRect.top,
        offsetX = bodyRect.left - elemRect.left;
      return {
        x: elemRect.left + bodyRect.left,
        y: elemRect.top + bodyRect.top,
        x2: elemRect.left + bodyRect.left + elemRect.width,
        y2: elemRect.bottom + bodyRect.top + elemRect.height,
        w: elemRect.width,
        h: elemRect.height
      };
    }
    this.targetCoords = getRect(targ);
    for (let i = 0; i < sortables.length; i++) {
      regions.push(getRect(sortables[i]));
    }
    this.regions = regions;
    this.draggy = targ.cloneNode(true);
    let internalSpacer = targ.getElementsByClassName('sortitem--container')[0];
    let internalRect = getRect(internalSpacer);
    let dragSpacer = this
      .draggy
      .getElementsByClassName('sortitem--container')[0];
    dragSpacer.style = "width: " + internalRect.w + "px;";
    this.draggy.style = "top: " + this.targetCoords.y + "px; left: " + this.targetCoords.x + "px;";
    this.draggy.className += " dragging";
    document
      .body
      .appendChild(this.draggy);
    var dragOrder = this.calcDragOrderForSelected(targWhich, targWhich);
    var newState = {
      dragOrder: dragOrder,
      hoverPosition: targWhich,
      dragItem: targWhich,
      isDragging: true,
      startClientX: e.clientX,
      startClientY: e.clientY
    };
    console.log(newState);
    this.setState(newState);
    return false;
  }

  /**
   * Move the draggable
   * @param {*} e
   */
  handleDragMove(e) {
    console.log("DRAGEVT");
    if (!this.state.isDragging) {
      return;
    }
    e.stopPropagation();
    if (e.touches && e.touches.length > 0) {
      e = e.touches[0];
    }
    let diffX = e.clientX - this.state.startClientX,
      diffY = e.clientY - this.state.startClientY;

    this.draggy.style = "top: " + (this.targetCoords.y + diffY) + "px; left: " + (this.targetCoords.x + diffX) + "px;";

    let hoverPosition = 0;
    // Determine hover position
    for (let u = 0; u < this.regions.length; u++) {
      if (e.clientY >= this.regions[u].y) {
        hoverPosition = u;
      }
    }
    if (this.state.hoverPosition != hoverPosition) {
      this.setState({
        hoverPosition: hoverPosition,
        dragOrder: this.calcDragOrderForSelected(hoverPosition, this.state.dragItem)
      });
    }
  }

  /**
   * End the drag drop
   * @param {*} e
   */
  dropDrag(e) {
    console.log("DROP!");
    if (!this.state.isDragging) {
      return;
    }
    window.removeEventListener('touchmove', this.proxyDM, true);
    window.removeEventListener('mousemove', this.proxyDM, true);
    window.removeEventListener('mouseup', this.proxySD, true);
    window.removeEventListener('mouseleave', this.proxySD, true);
    window.removeEventListener('touchcancel', this.proxySD, true);
    window.removeEventListener('touchend', this.proxySD, true);
    this
      .draggy
      .parentElement
      .removeChild(this.draggy);
    delete this.draggy;
    let finalOrder = [];
    for (let j = 0; j < this.state.dragOrder.length; j++) {
      let res = this.state.dragOrder[j];
      if (res == -1) {
        res = this.state.dragItem;
      }
      finalOrder.push(res);
    }
    this.setState({isDragging: false, currentOrder: finalOrder, dragOrder: []});
  }

  /**
 * Render the view
 */
  render() {
    let qname = this.props.name,
      ctx = this,
      answers = this.props.answer,
      choices = this.props.choices,
      count = 1,
      st = this.state,
      dragPlaceholderCSS = {},
      initialOther = this.initialOther;

    var realOrder = this.state.currentOrder;
    if (this.state.isDragging) {
      realOrder = this.state.dragOrder;
    }

    if (st.isDragging) {
      dragPlaceholderCSS.width = this.targetCoords.w;
      dragPlaceholderCSS.height = this.targetCoords.h;
    }
    return (
      <div className="question--sort">
        {realOrder.map((num, idx) => {
          if (num == -1) {
            return <label key={idx} className={"sortable standalonebutton drag--placeholder"}>&nbsp;</label>;
          } else if (num == 9999) {
            return <label
              key={9999}
              onMouseDown={this
              .handleDragStart
              .bind(this)}
              onTouchStartCapture={this
              .handleDragStart
              .bind(this)}
              data-which={num}
              className={"sortable standalonebutton othercontainer"}>
              <div className="sortitem--container textcontainer">
                <span className="sorticon fa fa-sort"></span>
                <span className="countholder">{idx + 1}.
                </span>
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
            </label>;
          } else {
            let rt = choices[num];
            return <label
              key={idx}
              onMouseDown={this
              .handleDragStart
              .bind(this)}
              onTouchStartCapture={this
              .handleDragStart
              .bind(this)}
              data-which={num}
              className={"sortable standalonebutton "}>
              <div className="sortitem--container"><span className="sorticon fa fa-sort"/> {idx + 1}. {rt}<input type="hidden" name={idx} value={idx}/></div>
            </label>;
          }
        })}
      </div>
    );
  }
}

// Connect the component
const ConnectedSortQuestion = connect()(SortQuestion)

// Expose the question
export default ConnectedSortQuestion;