# Survey Delivery Platform

Some general information on survey models:

## Survey JSON Models

The schema generally follows the schema of SurveyJS but deviates in several ways.

### Question Definitions

Each question shares a set of common attributes, but also may have some of its own custom ones. Here are the common shared attributes:

 * `name` - (_String_) The unique ID of the question. There are some rules to naming questions (see below) and they must be unique.
 * `type` - (_String_) The kind of question (ie: checkbox, radio, etc). The choices appear below.
 * `required` - (_Boolean_) Whether the question must be answered or not.
 * `title` - (_String_) The question text.
 * `instructions` - (_String_) Instructions for the user. Ie: how to interact with the question. This can contain information like any special criteria (like minimum responses or maximum responses).
 * `other` - (_Boolean_) Whether the question supports an "other" field. Not all question types support this.
 * `otherplaceholder` - (_String_) The helpful text that appears in any "other" textboxes (if applicable).
 * `choices` - (_Array_) The possible answers (if applicable).
 * `low` - (_String_) The label for the low end of a scale. This is applicable for scale questions.
 * `high` - (_String_) The label for the high end of a scale.
 * `showIf` - (_String_ or _Array_ or _Object_) The show logic for this question. See below for details.

### Question Types

A variety of question types are supported, including:

 * `rating` - Scale questions with values between `0.0` and `100.0`. Can be of type `buttons` (1-7), `stars`, or `slider`.
 * `dropdown` - Drop down (select boxes) with one possible answer.
 * `sort` - Drag and drop sorting question with optional other text input.
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
 * `myQuestionName!*=` - The question has no answer.
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
 * `myRankingQuestion[2]>3` - (Ranking questions only) The 3rd item is further down than the 4th position.
 * `myRankingQuestion[0]=2` - (Ranking questions only) The first item is in position 3.

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

For scale questions like `rating` (type: `stars` or `buttons`), it's possible to do simple comparisons like:

 * `myQuestionName=2` - The question named `myQuestionName` is equal to item 2 or a rating of 2.
 * `myQuestionName!=` - The question was not answered.
 * `myQuestionName!=3` - The question was not answered with the 4th item.
 * `myQuestionName>2` - The answer was greater than 2.
 * `myQuestionName<3` - The answer was less than 3.
 * `myQuestionName>=3` - The answer was greater than or equal to 3.
 * `myQuestionName[OTHER]<3` - The other answer value was less than 3. For ranking questions this means it was ranked higher.

This is true because there are discrete values that the answers can take on. Eg: `1`, `2`, `3`, etc. For `slider` question types, the answer lies on a continuum between `0` - `100` and all the numbers in between. You need to stick to greater-than, less-than comparisons for these. Eg:

```json
{
  "showIf": ["myQuestionName>40", "myQuestionName<60"]
}
```

This would only show the resulting question if the answer was *between* 40 and 60.

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

#### Sort and Matrix Rating Conditions

For sorting questions, things are a little different. We need to be able to check to see if individual rank items are in different positions. For this we use bracket notations. Here are some examples

 * `myRankingQuestion[2]>3` - The 3rd item is further down than the 4th position.
 * `myRankingQuestion[0]=2` - The first item is in position 3.
 * `myRankingQuestion[OTHER]=2` - The other is in position 3.
 * `myRankingQuestion*=` - The question was answered.
 * `myRankingQuestion!*=` - The question was not answered.

### Piping

The process of injecting previous responses into questions that appear later is called *piping*. Here is a simple example:

```json
{
  "title": "Hey ${firstNameQuestion}, Please rank the following attributes in order of importance",
}
```

This basically means, for the question with the name `firstNameQuestion`, insert the response into this place in the title of this question.