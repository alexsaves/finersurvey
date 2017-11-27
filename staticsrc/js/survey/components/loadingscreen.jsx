import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {removeTheLoadingScreen, validateSurvey} from '../../actions';

/**
* Represents the entire survey
*/
class LoadingScreenComponent extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
    this.startTime = new Date();
    this.minTime = 500;
    this.maxTime = 2000;
    this.imgRx = /url\(['"]*([^'"]*)['"]*\)/i;
    this.state = {
      didAttemptRemove: false
    };
  }

  /**
   * We're done
   */
  removeLoadingScreen() {
    sessionStorage.setItem("didLoadSurvey", "true");
    clearTimeout(this.removeFailsafeTimer);
    if (!this.state.didAttemptRemove) {
      this.setState({didAttemptRemove: true});
      this
        .props
        .dispatch(removeTheLoadingScreen());
    }
  }

  /**
   * The component rendered
   */
  componentDidMount() {
    var root = ReactDOM.findDOMNode(this),
      loaderNode = root.getElementsByClassName('fontTestZone')[0],
      initialItemSize = loaderNode.getBoundingClientRect(),
      currentTime = new Date(),
      currentDiff = currentTime - this.startTime,
      minDelay = Math.max(100, this.minTime - currentDiff),
      failsafeTImer = null,
      alms = document.querySelectorAll("*"),
      imgsToLoad = [],
      imgObjs = [],
      didPreviouslyLoad = sessionStorage.getItem("didLoadSurvey") === "true";

    if (didPreviouslyLoad) {
      setTimeout(this.removeLoadingScreen.bind(this), 10);
    } else {
      this.removeFailsafeTimer = setTimeout(this.removeLoadingScreen.bind(this), this.maxTime);
      for (let u = 0; u < alms.length; u++) {
        var bgImg = this.getBackgroundImg(alms[u]);
        if (bgImg && imgsToLoad.indexOf(bgImg) == -1) {
          imgsToLoad.push(bgImg);
          var bgimg = new Image();
          bgimg.onload = function (img) {
            return function () {
              var whichone = imgObjs.find((el) => {
                return el.src == img;
              });
              imgObjs.splice(imgObjs.indexOf(whichone), 1);
            };
          }(bgImg);
          bgimg.onerror = function (img) {
            return function () {
              // This survey has a missing image
              var whichone = imgObjs.find((el) => {
                return el.src == img;
              });
              imgObjs.splice(imgObjs.indexOf(whichone), 1);
            };
          }(bgImg);
          imgObjs.push({src: bgImg, iObj: bgimg});
          bgimg.src = bgImg;
        }
      }
    }

    // Compare rectangles
    var rectsAreTheSame = function (rect1, rect2) {
        return rect1.left == rect2.left && rect1.top == rect2.top && rect1.width == rect2.width && rect1.height == rect2.height;
      },
      done = () => {
        this.removeLoadingScreen();
      };

    // Do the initial minimum delay
    setTimeout(() => {
      let tryTwo = loaderNode.getBoundingClientRect();
      if (rectsAreTheSame(initialItemSize, tryTwo)) {
        this.repeatInterval = setInterval(() => {
          let tryThree = loaderNode.getBoundingClientRect();
          if (!rectsAreTheSame(initialItemSize, tryThree) && imgObjs.length == 0) {
            clearTimeout(failsafeTImer);
            clearInterval(this.repeatInterval);
            done();
          }
        }, 25);
        failsafeTImer = setTimeout(() => {
          clearInterval(this.repeatInterval);
          done();
        }, 1500);
      } else {
        done();
      }
    }, minDelay);

    // Now validate the survey
    this
      .props
      .dispatch(validateSurvey());
  }

  /**
   * Get a background image attribute
   * @param {*} element
   */
  getBackgroundImg(element) {
    var theCSSprop = window
      .getComputedStyle(element, null)
      .getPropertyValue("background-image");
    if (theCSSprop) {
      var res = theCSSprop.match(this.imgRx);
      if (res) {
        return res[1];
      }
    }
    return false;
  }

  /**
   * Loading screen is unmounting
   */
  componentWillUnmount() {
    //console.log("Loading screen unmounts");
  }

  /**
 * Render the view
 */
  render() {
    return (
      <div
        className={"loading--container" + (this.props.loadingComplete
        ? " complete"
        : "")}>
        <div className="loading--inner">
          <svg
            version="1.0"
            width="64px"
            height="64px"
            viewBox="0 0 128 128"
            className="loading--anim">
            <g><path
              d="M78.75 16.18V1.56a64.1 64.1 0 0 1 47.7 47.7H111.8a49.98 49.98 0 0 0-33.07-33.08zM16.43 49.25H1.8a64.1 64.1 0 0 1 47.7-47.7V16.2a49.98 49.98 0 0 0-33.07 33.07zm33.07 62.32v14.62A64.1 64.1 0 0 1 1.8 78.5h14.63a49.98 49.98 0 0 0 33.07 33.07zm62.32-33.07h14.62a64.1 64.1 0 0 1-47.7 47.7v-14.63a49.98 49.98 0 0 0 33.08-33.07z"
              fill="#3e885b"
              fillOpacity="1"/>
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 64 64"
                to="90 64 64"
                dur="400ms"
                repeatCount="indefinite"></animateTransform>
            </g>
          </svg>
        </div>
        <a
          href="https://www.finer.ink"
          title="Sales Win/Loss Analysis"
          target="_blank"
          className="logo--finerink"></a>
        <div className="fontTestZone">giItT1WQy@!-/#
          <div className="subTest">giItT1WQy@!-/#</div>
        </div>
      </div>
    );
  }
}

// This is our select function that will extract from the state the data slice
// we want to expose through props to our component.
const mapStateToProps = (state/*, props*/) => {
  return {metadata: state.metadata, pages: state.pages, currentPage: state.currentPage, answers: state.answers}
}

// Connect the loading UI
const ConnectedLoadingScreenComponent = connect(mapStateToProps)(LoadingScreenComponent);

// Expose the loading UI
export default ConnectedLoadingScreenComponent;