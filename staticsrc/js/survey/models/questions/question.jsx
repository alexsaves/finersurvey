import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import CheckboxQuestion from './types/checkbox.jsx';
import RatingQuestion from './types/rating.jsx';
import TextQuestion from './types/text.jsx';
import MultipleTextQuestion from './types/multipletext.jsx';
import DropdownQuestion from './types/dropdown.jsx';

/**
* Represents a question
*/
class QuestionComponent extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
  }

  /**
 * Render the view
 */
  render() {
    console.log("question", this.props);
    return (
      <div className="question">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed scelerisque
          convallis purus, eget tempus velit lobortis in. Morbi porttitor mi vitae justo
          congue, in imperdiet eros dictum. Integer eget mi mattis, accumsan erat et,
          interdum ipsum. Vivamus ultrices sed sem vitae efficitur. Integer massa nulla,
          iaculis a diam quis, interdum mattis magna. Suspendisse potenti. Nunc auctor
          facilisis aliquam. Nunc sagittis malesuada enim sed sodales. Sed vel dignissim
          dui. Nullam urna ipsum, tincidunt id sollicitudin non, aliquet a mauris.
          Vestibulum ultricies rhoncus metus. Etiam at massa nisi. Suspendisse ultrices
          ligula in erat malesuada vulputate. Nunc tristique suscipit augue, sit amet
          placerat purus luctus quis.</p>
        <p>Aliquam erat volutpat. Aliquam non lacus sit amet ipsum lacinia lobortis a
          quis tellus. Donec quis nisi nec libero porttitor auctor quis sed ante. Nulla
          sollicitudin efficitur tincidunt. Praesent finibus sem at euismod dignissim.
          Morbi eu urna sit amet quam lacinia pharetra vitae eget lorem. Pellentesque eget
          interdum enim, vel commodo dui. Vivamus sit amet pretium ligula. Aliquam
          hendrerit bibendum leo, in rutrum nibh cursus vitae. Nunc rhoncus orci eu nisl
          mattis tempus. Suspendisse aliquam neque hendrerit metus aliquet malesuada.
          Morbi congue erat ut ligula lacinia, ac tristique ante iaculis.</p>
        <p>Morbi condimentum sodales arcu a volutpat. Duis luctus nisl ac enim mollis
          aliquet. Cras ultricies luctus hendrerit. Nunc dapibus turpis vitae sem
          sollicitudin bibendum vel ut velit. Maecenas vehicula, eros vel luctus
          ultricies, dui est placerat lacus, vel egestas quam lacus vel sapien. Proin a
          justo vitae quam ultricies semper. Sed quis nunc lobortis, suscipit metus vel,
          pretium lacus.</p>
      </div>
    );
  }
}

// Expose the question
export default QuestionComponent;