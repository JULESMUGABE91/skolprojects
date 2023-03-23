import React from "react";
import { Button } from "../Button";
import { Input, Select } from "../Input";
import uuid4 from "../../utils/uuid4";
import {
  optionsOptions,
  questionOptions,
} from "../../constants/question_option";
import toastMessage from "../../utils/toastMessage";

class QuestionForm extends React.Component {
  state = {
    questions: [
      {
        _id: "6405e5dd19d3ebf306d17010",
        organization: {
          $oid: "63fdf074095f8bc0e023ee15",
        },
        user: {
          $oid: "63ff92050efe12a037d368d1",
        },
        survey: {
          $oid: "63ffb22a731970d4c34689d2",
        },
        question:
          "Noneho ngiye kukwereka ikarita ivuga ku nzoga zitandukanye, watubwira ku gipimo kuva 1 kugeza 5 icyo ubitekerezaho. Tuzagerageza kureba niba ubyumva",
        options: [
          {
            type: "dropdown",
            _id: "75rtq1678107595626",
            option: "Umugore cyane",
            dropdown_options: [
              {
                _id: "h1g8z1679462453995",
                value: "Barack Obama ",
              },
            ],
          },
          {
            type: "dropdown",
            _id: "jqtgf1678107644069",
            option: "Urebye ni abagore",
            dropdown_options: [
              {
                _id: "h1g8z1679462453995",
                value: "Barack Obama ",
              },
            ],
          },
          {
            type: "dropdown",
            _id: "eskxu1678107662434",
            option: "Hagati no hagati umugabo cyane",
            dropdown_options: [
              {
                _id: "h1g8z1679462453995",
                value: "Barack Obama ",
              },
            ],
          },
          {
            type: "dropdown",
            _id: "spll61678107700290",
            option: "Urebye ni umugabo ",
            dropdown_options: [
              {
                _id: "h1g8z1679462453995",
                value: "Barack Obama ",
              },
            ],
          },
        ],
        setting: {
          isRequired: true,
          isMultiAnswers: false,
        },
        type: "input",
        point: 3.3,
        createdAt: {
          $date: "2023-03-06T13:08:45.716Z",
        },
        updatedAt: {
          $date: "2023-03-22T09:20:37.975Z",
        },
        __v: 0,
        position: 17,
      },
    ],
    isSubmitting: false,
  };

  returnInitialQuestionFormat() {
    return {
      _id: uuid4(),
      type: questionOptions[0].value,
      options: [],
      question: "",
      setting: {
        isRequired: true,
      },
    };
  }

  returnInitialOptionFormat() {
    return {
      _id: uuid4(),
      type: optionsOptions[0].value,
      option: "",
      checked: true,
      input: "input",
    };
  }

  returnInitialDropdownMenuFormat() {
    return {
      _id: uuid4(),
      value: "",
    };
  }

  handleAddQuestion() {
    let { questions } = this.state;

    let question_format = this.returnInitialQuestionFormat();

    //increase position
    question_format.position = question_format.position
      ? question_format.position
      : questions.length;
    //////////////

    questions.push(question_format);

    this.setState({ questions });
  }

  handleAddOption(question_index) {
    try {
      let { questions } = this.state;

      let option_format = this.returnInitialOptionFormat();

      if (!questions[question_index]["options"]) {
        questions[question_index]["options"] = [];
      }

      questions[question_index]["options"].push(option_format);

      this.setState({ questions });
    } catch (error) {
      toastMessage(
        "error",
        "Can't add new option on question " +
          question_index +
          " -- Error: " +
          error
      );
    }
  }

  handleAddDropdownMenu({ question_index, option_index }) {
    try {
      let { questions } = this.state;

      let dropdown_menu_format = this.returnInitialDropdownMenuFormat();

      if (
        !questions[question_index]["options"][option_index]["dropdown_options"]
      ) {
        questions[question_index]["options"][option_index]["dropdown_options"] =
          [];
      }

      questions[question_index]["options"][option_index][
        "dropdown_options"
      ].push(dropdown_menu_format);

      this.setState({ questions });
    } catch (error) {
      toastMessage(
        "error",
        "Can't add new dropdown menu on option " +
          question_index +
          " -- Error: " +
          error
      );
    }
  }

  onRemoveOption({ question_index, option_index }) {
    try {
      let { questions } = this.state;

      if (!questions[question_index]["options"]) {
        questions[question_index]["options"] = [];
      } else {
        questions[question_index]["options"].splice(option_index);
      }

      this.setState({ questions });
    } catch (error) {
      toastMessage(
        "error",
        "Can't delete option " + option_index + " -- Error: " + error
      );
    }
  }

  onRemoveDropdownMenu({ question_index, option_index, menu_index }) {
    try {
      let { questions } = this.state;

      if (
        questions[question_index]["options"][option_index]["dropdown_options"][
          menu_index
        ]
      ) {
        questions[question_index]["options"][option_index][
          "dropdown_options"
        ].splice(menu_index, 1);
      }

      this.setState({ questions });
    } catch (error) {
      toastMessage(
        "error",
        "Can't delete dropdown menu " + menu_index + " -- Error: " + error
      );
    }
  }

  onChangeQuestion({ index, value, field }) {
    let { questions } = this.state;

    questions[index][field] = value.target ? value.target.value : value.value;

    delete questions[index]["error"];

    this.setState({ questions });
  }

  onChangeOption({ question_index, option_index, value, field }) {
    let { questions } = this.state;
    if (questions[question_index]["options"][option_index]) {
      questions[question_index]["options"][option_index][field] = value.target
        ? value.target.value
        : value.value;

      delete questions[question_index]["options"][option_index]["error"];
    }

    this.setState({ questions });
  }

  onChangeDropdownMenu({
    question_index,
    option_index,
    value,
    field,
    menu_index,
  }) {
    let { questions } = this.state;
    if (
      questions[question_index]["options"][option_index]["dropdown_options"][
        menu_index
      ]
    ) {
      questions[question_index]["options"][option_index]["dropdown_options"][
        menu_index
      ][field] = value.target ? value.target.value : value.value;

      delete questions[question_index]["options"][option_index][
        "dropdown_options"
      ][menu_index]["error"];
    }

    this.setState({ questions });
  }

  renderQuestion = (question = {}, index) => {
    return (
      <div className="card card-primary mb-2" key={index}>
        <div className="card-body">
          <div className="row">
            <div className="col-md-2">
              <Input
                label="Order:"
                className="form-control-lg"
                value={question.position + 1}
                onChange={(value) =>
                  this.onChangeQuestion({ index, field: "position", value })
                }
                error={question.error}
              />
            </div>
            <div className="col-md-6">
              <Input
                label="Question:"
                required
                className="form-control-lg"
                value={question.question}
                onChange={(value) =>
                  this.onChangeQuestion({ index, field: "question", value })
                }
                error={question.error}
              />
            </div>
            <div className="col-md-4">
              <Select
                label="Question Type:"
                options={questionOptions}
                required
                className="form-control-lg"
                value={this.formatSelectedOption(
                  questionOptions,
                  question.type
                )}
                onChange={(value) =>
                  this.onChangeQuestion({ index, field: "type", value })
                }
                error={question.error}
              />
            </div>
          </div>
          {question?.options?.map((option, o) => {
            return this.renderOption({
              question_index: index,
              option,
              option_index: o,
            });
          })}
          <div className="question_menus">
            <div style={{ flex: 1 }}>
              <Button
                className="btn-bordered"
                onPress={() => this.handleAddOption(index)}
                text="Add Option"
                icon="bx-plus"
              />
            </div>
            {question.createdAt && (
              <div className="remote_btn">
                <div>
                  <Button
                    className="btn-primary"
                    onPress={() =>
                      this.handleUpdateQuestionRemote(question, index)
                    }
                    text="Update"
                    icon="bx-check"
                  />
                </div>
                <div style={{ marginLeft: 15 }}>
                  <Button
                    className="btn-danger"
                    onPress={() => this.handleDeleteQuestionRemote(question)}
                    text="Delete"
                    icon="bx-trash"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  renderOption({ question_index, option, option_index }) {
    return (
      <>
        <div className="col-md-12">
          <div className="option_form row ">
            <div className="col-md-4">
              <div>
                <Select
                  label="Option Type:"
                  options={optionsOptions}
                  required
                  className="form-control-lg"
                  value={this.formatSelectedOption(optionsOptions, option.type)}
                  onChange={(value) =>
                    this.onChangeOption({
                      question_index,
                      option_index,
                      field: "type",
                      value,
                    })
                  }
                />
              </div>
            </div>
            <div className="col-md-8" style={{ display: "flex" }}>
              <div style={{ flex: 1 }}>
                <Input
                  label={"Option " + option_index}
                  className="form-control-lg"
                  value={option.option}
                  onChange={(value) =>
                    this.onChangeOption({
                      question_index,
                      option_index,
                      field: "option",
                      value,
                    })
                  }
                  error={option.error}
                />
                {option.type === "dropdown" &&
                  this.renderDropdownMenu({
                    question_index,
                    option_index,
                    menus: option?.dropdown_options || [],
                  })}
              </div>
              <div style={{ marginTop: 30 }}>
                <Button
                  icon="bx-trash"
                  onPress={() =>
                    this.onRemoveOption({ question_index, option_index })
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <hr />
      </>
    );
  }

  renderDropdownMenu({ menus, question_index, option_index }) {
    return (
      <div className="well card-primary">
        <div className="card-body">
          {menus?.map((menu, m) => {
            return (
              <div key={m} style={{ display: "flex" }}>
                <div style={{ flex: 1 }}>
                  <Input
                    label={"Item " + m}
                    className="form-control-lg"
                    value={menu.value}
                    onChange={(value) =>
                      this.onChangeDropdownMenu({
                        question_index,
                        option_index,
                        field: "value",
                        value,
                        menu_index: m,
                      })
                    }
                    error={menu.error}
                  />
                </div>
                <div style={{ marginTop: 30 }}>
                  <Button
                    icon="bx-trash"
                    onPress={() =>
                      this.onRemoveDropdownMenu({
                        question_index,
                        option_index,
                        menu_index: m,
                      })
                    }
                  />
                </div>
              </div>
            );
          })}
          <Button
            className="btn-bordered"
            text="Add Menu Item"
            icon="bx-plus"
            onPress={() =>
              this.handleAddDropdownMenu({ question_index, option_index })
            }
          />
        </div>
      </div>
    );
  }

  formatSelectedOption(options, value) {
    let selected_format = {};

    for (let el of options) {
      if (el.value === value) {
        selected_format = el;
      }
    }

    return selected_format;
  }

  validateQuestion() {
    let { questions } = this.state;

    this.setState({ questions });
  }

  handleUpdateQuestionRemote = async (question, index) => {
    const error_question = await this.validateQuestion(question, index);
  };

  handleDeleteQuestionRemote = async (question) => {};

  render() {
    console.log("====================================");
    console.log(this.state.questions);
    console.log("====================================");
    return (
      <div className="form-container">
        <div className="card mb-2">
          <div className="card-body">
            <div className="q-header">
              <div></div>
              <div>
                <Button
                  text="New Question"
                  className="btn-primary"
                  icon="bx-plus"
                  onPress={this.handleAddQuestion.bind(this)}
                />
              </div>
            </div>
          </div>
        </div>
        {this.state.questions.map((question, q) => {
          return this.renderQuestion(question, q);
        })}
      </div>
    );
  }
}

export default QuestionForm;
