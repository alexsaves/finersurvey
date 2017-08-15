# Survey Delivery Platform

Some general information on survey models:

## Survey JSON Models

The schema generally follows the schema of SurveyJS but deviates in several ways.

### Question Types

A variety of question types are supported, including:

 * `rating` - Slider or star-rating questions with values between `0.0` and `99.9`.
 * `dropdown` - Drop down (select boxes) with one possible answer.
 * `matrixrating` - Multiple rating questions combined into one with a left-right carousel interface.
 * `text` - Single line or multiline open-ended text input.
 * `checkbox` - Multiple choice question with a possible "other" text input.
 * `radio` - Single choice question with a possible "other" text input.

### Question Names

Question names are used to identify questions in the response object, and also for show logic and piping. Question names can contain letters, numbers, or underscores, but no other symbols or spaces. Also, they must begin with a letter or underscore. Examples of valid question names:

 * `myQuestion28`
 * `_anotherQuestion`
 * `__3__`

Invalid question name examples:

 * `3`
 * `another question`
 * `myAwesomeQuestion!`
 * `@somequestion`
 * `mc.favColor`

### Show Logic

Show logic applies to questions or pages and can be singular (just one rule) additive (all statements must be true) or inclusive (any statement must be true). Rules are specified with the optional `showIf` attribute which can be a string (for singular rules), an array (for additive rules), or an object (for inclusive rules).

Rules may generally only apply to questions on pages that appeared earlier in the page sequence. Rules follow a specific format. They begin with a question name, then an equality operator, then a value (optional). Here are some simple examples of rules:

 * `myQuestionName=2` - The question named `myQuestionName` is equal to item 2 or a rating of 2.
 * `myQuestionName*=` - The question has any answer.
 * `myQuestionName!=` - The question was not answered.
 * `myQuestionName!=3` - The question was not answered with the 4th item.
 * `myQuestionName~=cool` - The question was *like* "cool". In other words, it contained the text "cool", capitalization not important.
 * `myQuestionName!~=cool` - The question was *not like* "cool". In other words, it did not contain the text "cool" (irrespective of capitalization).
 * `myQuestionName>2` - The answer was greater than 2.
 * `myQuestionName<3` - The answer was less than 3.
 * `myQuestionName>=3` - The answer was greater than or equal to 3.
 * `myQuestionName[OTHER]*=` - The answer was `other` or included an `other`.
 * `myQuestionName[OTHER]~=apple` - The other answer was *like* "apple". In other words, it contained the text "cool", capitalization not important.
 * `myQuestionName[OTHER]!~=apple` - The other answer was *not like* "apple". In other words, it did not contain the text "cool" (irrespective of capitalization).
 * `myQuestionName[OTHER]<3` - The other answer value was less than 3. For ranking questions this means it was ranked higher.
 * `myQuestionName=HIGH` - The answer was in the high range

#### Zero Based

All numeric values are zero based. For example, in a dropdown question, the first choice is `0` and the second choice is `1` and so-on. 

#### Singular Rules

Here is an example of a single rule, applying to previous question `question8393n4` that the user selected the *2nd* (zero based) option, OR rated (in the case of rating or sort question types) it 2nd.

```json
{
    "type": "rating",
    "modifier": "slider",
    "name": "question335933",
    "title": "OK, you said 2. How good is that restaurant?",
    "instructions": "Rate it from low to high.",
    "showIf": "questio8393n4=1"
}
```
#### Additive Rules

Here is an example of an additive rule (all statements must be true), applying to previous question `question8393n4` that the user selected *both* *Apple* (the 2nd item) _and_ *Pear* (the 4th item).

```json
{
    "type": "rating",
    "modifier": "slider",
    "name": "question335933",
    "title": "You said apple and pear. How much do you like them?",
    "instructions": "Rate it from low to high.",
    "showIf": [
      "questio8393n4=1",
      "questio8393n4=4"
    ]
}
```

#### Inclusive Rules

Here is an example of an inclusive rule, applying to previous question `question8393n4` that the user selected either *Apple* (the 2nd item) or *Pear* (the 4th item).

```json
{
    "type": "rating",
    "modifier": "slider",
    "name": "question335933",
    "title": "You said apple OR pear. How much do you like them?",
    "instructions": "Rate it from low to high.",
    "showIf": {
      "choseApple": "questio8393n4=1",
      "chosePear": "question8393n4=3"
    }
}
```

#### Complex Rules

Rules can be recursive (nested) and offer complex logical statements. For example, by nesting rules, it's possible to set up a statement like "Show this question if user answered `A` _OR_ `B` for question one, _AND_ `C` from question two.

```json
{
    "type": "rating",
    "modifier": "slider",
    "name": "question335933",
    "title": "You said apple OR pear in quesiton one, AND orange in question two. How much do you like them?",
    "instructions": "Rate it from low to high.",
    "showIf": [
      {
        "choseA": "questio8393n4=0",
        "choseB": "questio8393n4=1"
      },
      "question3774=2"
    ]
}
```
#### Scale Comparisons

For scale questions like `rating` (type: `stars`), it's possible to do simple comparisons like:

 * `myQuestionName=2` - The question named `myQuestionName` is equal to item 2 or a rating of 2.
 * `myQuestionName!=` - The question was not answered.
 * `myQuestionName!=3` - The question was not answered with the 4th item.
 * `myQuestionName>2` - The answer was greater than 2.
 * `myQuestionName<3` - The answer was less than 3.
 * `myQuestionName>=3` - The answer was greater than or equal to 3.
 * `myQuestionName[OTHER]<3` - The other answer value was less than 3. For ranking questions this means it was ranked higher.

However, for `rating` (type: `slider`) which provide floating-point values, it's impractical to use strict equality. In these cases, we provide a plain-language range system.

Number range | Label to use
--- | ---
0% < 20% | `VERYLOW`
20% < 40% | `LOW`
40% < 60% | `MEDIUM`
60% < 80% | `HIGH`
80% < 100% | `VERYHIGH`

#### Rating Conditions

Rating questions can be of various types: `slider`, `stars`, `buttons`. For `stars`, and `buttons`, doing straight equality operations is easy, Eg: `myButtonQuestion=3` is simple enough. The `slider` type, however will have a floating point (decimal) number between `0.0` and `99.9`. It's not very useful to compare against specific numbers because if you are looking for `10` but the user entered `10.1` you will not find a match. In this case, you can use the plain-language range system mentioned earlier:

 * `myRatingQ=LOW` - Show if the answer was between 20%-40%.
 * `myRatingQ>MEDIUM` - Show if the answer was either `HIGH` or `VERYHIGH`.
 * `myRatingQ!=VERYLOW` - Show if the question was *not* between 0% and 20%.

#### Dropdown Conditions

For the `dropdown` question type you can only check one of three conditions: user did answer, answer *was* n or answer *was not* n. Choices are numeric.

```
questionMyDropDown*=
```

... This would check if there was any answer for a dropdown. This is useful for optional questions.

```
questionMyDropDown=2
```

This would check if the user chose the 3rd choice in the dropdown box.

```
questionMyDropDown!=2
```

This would check if the user did NOT choose the 3rd choice in the dropdown.
