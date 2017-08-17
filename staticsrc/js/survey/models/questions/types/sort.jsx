import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {changeAnswer} from '../../../../actions';
import Piper from '../../../components/piper';

/**
* Represents a question
*/
class SortQuestion extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
    this.piper = new Piper();
    this.iptThrottle = null;
    this.stopRepositioning = false;
    this.state = {
      isDragging: false,
      dragItem: -1,
      hoverPosition: -1,
      currentOrder: [],
      dragOrder: [],
      positionOtherInput: false,
      hideOtherOverlay: true,
      otherInputX: 0,
      otherInputY: 0,
      otherInputWidth: 100,
      otherInputHeight: 50,
      didDrop: false
    };
    this.isAnimating = false;
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
   * Handle the positioning of the other input
   */
  positionOtherInput() {
    if (this.props.other === true && !this.stopRepositioning) {
      let root = ReactDOM.findDOMNode(this),
        floatingother = root.getElementsByClassName('floatingother')[0];
      if (floatingother) {
        let pos = floatingother.getBoundingClientRect();
        if (this.state.otherInputY != pos.top || this.state.otherInputX != pos.left) {
          if (pos.width > 0) {
            this.setState({positionOtherInput: true, otherInputX: pos.left, otherInputY: pos.top, otherInputWidth: pos.width, otherInputHeight: pos.height});
          } else {
            this.setState({positionOtherInput: false});
          }
        }
      }
    }
  }

  /**
   * The component did mount
   */
  componentDidMount() {
    let root = ReactDOM.findDOMNode(this);
    root.addEventListener("touchstart", (e) => {
      if (e.target.tagName == "INPUT") {
        return;
      }
      e.preventDefault();
    }, true);
    this.positionOtherInput();
    setInterval(() => {
      if (this.props.isSelected && !this.props.isAnimating) {
        this.positionOtherInput();
      }
    }, 250);
    setTimeout(() => {
      this.setState({hideOtherOverlay: false});
    }, 500);
    this.resizeThrottle = null;
    window.addEventListener("resize", (e) => {
      if (!this.state.hideOtherOverlay) {
        this.setState({hideOtherOverlay: true});
      }
      clearTimeout(this.resizeThrottle);
      this.resizeThrottle = setTimeout(() => {
        this.positionOtherInput();
        this.setState({hideOtherOverlay: false});
      }, 500);
    });
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
      targWhich = parseInt(targ.getAttribute("data-which")),
      hoverIndex = parseInt(targ.getAttribute("data-index"));

    if (this.state.isDragging || e.target.tagName == "INPUT") {
      return;
    }
    this.stopRepositioning = false;
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
    let isOther = !internalSpacer;
    if (isOther) {
      internalSpacer = targ.getElementsByClassName('other--textfield')[0];
    }
    let internalRect = getRect(internalSpacer);
    let dragSpacer = this
      .draggy
      .getElementsByClassName('sortitem--container')[0];
    if (isOther) {
      dragSpacer = this
        .draggy
        .getElementsByClassName('other--textfield')[0];
    }
    dragSpacer.style.width = internalRect.w + "px";
    this.draggy.style.top = this.targetCoords.y + "px";
    this.draggy.style.left = this.targetCoords.x + "px";
    this.draggy.className += " dragging";
    document
      .body
      .appendChild(this.draggy);
    var dragOrder = this.calcDragOrderForSelected(hoverIndex, targWhich);
    var newState = {
      dragOrder: dragOrder,
      hoverPosition: targWhich,
      dragItem: targWhich,
      isDragging: true,
      startClientX: e.clientX,
      startClientY: e.clientY,
      hideOtherOverlay: true
    };
    this.setState(newState);
    return false;
  }

  /**
   * Apply the current data state
   */
  applyCurrentDataState() {
    let root = ReactDOM.findDOMNode(this),
      otheript = root.getElementsByClassName('otherOverlayInput')[0];

    this
      .props
      .dispatch(changeAnswer(this.props.name, {
        other: (this.props.other && otheript)
          ? otheript.value
          : null,
        order: this.state.currentOrder
      }));

    if (!this.props.other) {
      if (this.props.onFullyAnswerQuestion) {
        this
          .props
          .onFullyAnswerQuestion();
      }
    }
  }

  /**
   * The other IPT changed
   */
  handleIptThrottleChange() {
    clearTimeout(this.iptThrottle);
    this.iptThrottle = setTimeout(() => {
      let root = ReactDOM.findDOMNode(this),
        otheript = root.getElementsByClassName('otherOverlayInput')[0],
        otherText = otheript.value;
      this.state.otherText = otherText;
      this.applyCurrentDataState();
    }, 250);
  }

  /**
   * Move the draggable
   * @param {*} e
   */
  handleDragMove(e) {
    if (!this.state.isDragging) {
      return;
    }
    this.stopRepositioning = false;
    e.stopPropagation();
    if (e.touches && e.touches.length > 0) {
      e = e.touches[0];
    }
    let diffX = e.clientX - this.state.startClientX,
      diffY = e.clientY - this.state.startClientY;

    this.draggy.style.top = (this.targetCoords.y + diffY) + "px";
    this.draggy.style.left = (this.targetCoords.x + diffX) + "px";

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
   * Start editing the other box
   */
  startEditingOther() {
    this.stopRepositioning = true;
  }

  /**
   * End editing the other box
   */
  endEditingOther() {
    this.stopRepositioning = false;
  }

  /**
   * End the drag drop
   * @param {*} e
   */
  dropDrag(e) {
    if (!this.state.isDragging) {
      return;
    }
    this.stopRepositioning = false;
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
    this.setState({isDragging: false, currentOrder: finalOrder, dragOrder: [], didDrop: true});
    this.positionOtherInput();
    this.applyCurrentDataState();
    ReactDOM
      .findDOMNode(this)
      .focus();
    setTimeout(() => {
      ReactDOM
        .findDOMNode(this)
        .focus();
    }, 250);
    setTimeout(() => {
      this.setState({hideOtherOverlay: false});
      ReactDOM
        .findDOMNode(this)
        .focus();
    }, 550);
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

    let piper = this.piper,
      panswers = this.props.answers,
      ppages = this.props.allpages;

    let otherValue = '';
    if (this.props.other) {
      otherValue = this.state.otherText || initialOther;
      if (!otherValue) {
        otherValue = '';
      }
    }

    var realOrder = this.state.currentOrder;
    if (this.state.isDragging) {
      realOrder = this.state.dragOrder;
    }
    if (st.isDragging) {
      dragPlaceholderCSS.width = this.targetCoords.w;
      dragPlaceholderCSS.height = this.targetCoords.h;
    }
    let hideOtherOverlay = this.state.hideOtherOverlay;
    if (this.isAnimating && !this.props.isAnimating) {
      hideOtherOverlay = true;
      setTimeout(() => {
        this.positionOtherInput();
      }, 200);
    }
    this.isAnimating = this.props.isAnimating;
    return (
      <div className="question--sort">
        {(this.state.positionOtherInput && !this.state.isDragging && !hideOtherOverlay && this.props.isSelected && !this.props.isAnimating) && <input
          type="text"
          onFocus={ctx
          .startEditingOther
          .bind(ctx)}
          onBlurCapture={ctx
          .endEditingOther
          .bind(ctx)}
          onKeyUp={ctx
          .handleIptThrottleChange
          .bind(ctx)}
          className="otherinputfield otherOverlayInput"
          placeholder={this.props.otherplaceholder || ''}
          defaultValue={otherValue}
          style={{
          left: this.state.otherInputX,
          top: this.state.otherInputY,
          width: this.state.otherInputWidth,
          height: this.state.otherInputHeight
        }}/>}
        {realOrder.map((num, idx) => {
          if (num == -1) {
            return <label key={idx} className={"sortable standalonebutton drag--placeholder"}>&nbsp;</label>;
          } else if (num == 9999) {
            return <label
              key={idx}
              onMouseDown={this
              .handleDragStart
              .bind(this)}
              onTouchStartCapture={this
              .handleDragStart
              .bind(this)}
              data-index={idx}
              data-which={num}
              className={"sortable standalonebutton otherstandalone " + ((!st.isDragging && st.didDrop)
              ? " dropAnim drop" + idx
              : "")}>
              <div className="sortitem--container text--container"><span className="sorticon fa fa-sort"/>
                <span className="numholder">{idx + 1}.</span><input
                  type="text"
                  onMouseDownCapture={this
              .preventDrag
              .bind(this)}
                  onTouchStartCapture={this
              .preventDrag
              .bind(this)}
                  className="other--textfield floatingother"
                  placeholder={this.props.otherplaceholder || ''}
                  readOnly={true}
                  value={otherValue}/><input type="hidden" className="otherinputfield" name={idx} value={idx}/></div>
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
              data-index={idx}
              data-which={num}
              className={"sortable standalonebutton" + ((!st.isDragging && st.didDrop)
              ? " dropAnim drop" + idx
              : "")}>
              <div className="sortitem--container text--container"><span className="sorticon fa fa-sort"/> {idx + 1}. {rt}<input type="hidden" className="otherinputfield" name={idx} value={idx}/></div>
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