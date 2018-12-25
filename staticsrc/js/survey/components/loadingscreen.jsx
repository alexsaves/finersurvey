import React from 'react';

/**
* Represents the loading screen
*/
class LoadingScreenComponent extends React.Component {
  /**
 * Constructor
 */
  constructor(props) {
    super(props);
    this.state = {
      complete: false
    };
  }

  componentDidMount() {
    this._tm = setTimeout(() => {
      this.setState({complete: true});
    }, 1000);
  }

  componentWillUnmount() {
    clearTimeout(this._tm);
  }

  /**
 * Render the view
 */
  render() {
    return (
      <div
        className={"loading--container" + (this.state.complete ? " complete" : "")}>
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
              fillOpacity="1" />
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
          rel="noopener noreferrer"
          className="logo--finerink"></a>
        <div className="fontTestZone">giItT1WQy@!-/#
          <div className="subTest">giItT1WQy@!-/#</div>
        </div>
      </div>
    );
  }
}

// Expose the loading UI
export default LoadingScreenComponent;