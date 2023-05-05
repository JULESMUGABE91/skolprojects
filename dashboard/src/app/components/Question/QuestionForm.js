import React from "react";
import { Button } from "../Button";
import { Input, Select } from "../Input";
import uuid4 from "../../utils/uuid4";
import {
  optionsOptions,
  questionOptions,
} from "../../constants/question_option";
import toastMessage from "../../utils/toastMessage";
import { ENDPOINT } from "../../constants/api";
import axios from "axios";
import { connect } from "react-redux";
import { getStorage } from "../../utils/storage";
import { LoadingSpinner } from "../LoadingSpinner";

class QuestionForm extends React.Component {
  state = {
    questions: [],
    isSubmitting: false,
    user: {},
  };

  componentDidMount = async () => {
    await this.getUserLoggedInInfo();

    this.getQuestions(true);
  };

  componentDidUpdate(prevProps) {
    if (prevProps.filters !== this.props.filters) {
      this.getQuestions(false);
    }
  }

  getUserLoggedInInfo = async () => {
    const user = await getStorage();
    this.setState({
      user,
    });
  };

  getQuestions = async (isLoading) => {
    const { filters } = this.props;
    const { user } = this.state;

    try {
      if (!filters.survey || (filters.survey && !filters.survey.value)) {
        return toastMessage("error", "Survey is missing, please select survey");
      }

      this.setState({
        isLoading,
      });

      const options = {
        method: "POST",
        url: `${ENDPOINT}/question/fetch`,
        data: {
          survey: filters.survey.value,
        },
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };

      const data = await axios(options);

      this.setState({
        questions: data.data,
        isLoading: false,
      });
    } catch (error) {
      this.setState({ isLoading: false });

      toastMessage(
        "error",
        "Error to fetch questions from " +
          filters.survey.label +
          ", please check your internet and try again"
      );
    }
  };

  returnInitialQuestionFormat() {
    return {
      _id: uuid4(),
      type: questionOptions[0].value,
      options: [],
      question: "",
      english_question: "",
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
      input: "textinput",
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

    toastMessage("success", "New question added successfully ");
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
        questions[question_index]["options"].splice(option_index, 1);
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

  handleRemoveQuestion(index) {
    let { questions } = this.state;

    if (
      window.confirm(
        "Are you sure want to delete this question, NOTE: There is no undo, it will be deleted permanently"
      )
    ) {
      if (questions[index].createdAt) {
        this.handleDeleteQuestionRemote(questions[index]._id);
      }

      questions.splice(index, 1);
    }

    this.setState({ questions });
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
                value={question.position}
                onChange={(value) =>
                  this.onChangeQuestion({ index, field: "position", value })
                }
                error={question.error_order}
                type="number"
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
              <Input
                label="English Question:"
                required
                className="form-control-lg"
                value={question.english_question}
                onChange={(value) =>
                  this.onChangeQuestion({ index, field: "english_question", value })
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
              />
            </div>
            <div
              className="remove_question"
              onClick={() => this.handleRemoveQuestion(index)}
            >
              <i className="bx bx-x" />
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
            <div className="remote_btn">
              <div>
                <Button
                  className="btn-primary"
                  onPress={() => this.handleSubmit(question, index)}
                  text="Save"
                  icon="bx-check"
                  isSubmitting={this.state["isSubmitting_" + question._id]}
                />
              </div>
            </div>
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
                <Input
                  label={"English Option " + option_index}
                  className="form-control-lg"
                  value={option.option_english}
                  onChange={(value) =>
                    this.onChangeOption({
                      question_index,
                      option_index,
                      field: "option_english",
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

  validateQuestion(question, index) {
    let { questions } = this.state;
    let { options } = question;
    let { filters } = this.props;

    let errors_count = 0;

    question = this.validateOption(question);

    if (!filters.survey || (filters.survey && !filters.survey.value)) {
      errors_count += 1;

      toastMessage("error", "Survey is mandatory, please select");
    }

    if (
      !filters.organization ||
      (filters.organization && !filters.organization.value)
    ) {
      errors_count += 1;

      toastMessage("error", "Organization is mandatory, please select");
    }

    if (question.question === "") {
      question.error = "Question must no be empty";

      errors_count += 1;
    }

    if (question.order === "") {
      question.error_order = "Please enter order number";

      errors_count += 1;
    }

    for (let option of options) {
      if (option.error && option.error !== "") {
        errors_count += 1;
      }
    }

    questions[index] = question;

    return errors_count;
  }

  validateOption(question) {
    let { options } = question;

    for (let option of options) {
      if (
        question.type === "dropdown" &&
        (!option.dropdown_options ||
          (option.dropdown_options && option.dropdown_options.length === 0))
      ) {
        option.error = "Please add at least 1 option ";
      }

      if (option.option === "") {
        option.error = "Question option is mandatory";
      }
    }

    question.options = options.slice(0);

    return question;
  }

  handleSubmit = async (question, index) => {
    const question_errors = await this.validateQuestion(question, index);

    try {
      if (question_errors !== 0) return;

      this.setState({ ["isSubmitting_" + question._id]: true });

      const { user } = this.state;
      const { filters } = this.props;

      let route = "/add";
      let action = "saved";

      let request_body = {
        position: question.position,
        survey: filters.survey.value,
        question: question.question,
        english_question: question.english_question,
        options: question.options,
        type: question.type,
        setting: question.setting,
        organization: filters.organization.value,
        available: true,
        point: question.point || 0,
      };

      if (question.createdAt && question._id) {
        request_body.id = question._id;

        route = "/update";
        action = "updated";
      }

      const options = {
        method: "POST",
        url: `${ENDPOINT}/question${route}`,
        data: request_body,
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };

      await axios(options);

      this.setState({
        ["isSubmitting_" + question._id]: false,
      });

      toastMessage("success", `Data has been ${action} successful`);

      this.getQuestions(false);
    } catch (error) {
      toastMessage("error", error.response.data);
      this.setState({
        ["isSubmitting_" + question._id]: false,
        isFetched: false,
      });
    }
  };

  handleDeleteQuestionRemote = async (id) => {
    const { user } = this.state;
    try {
      const options = {
        method: "POST",
        url: `${ENDPOINT}/question/delete`,
        data: {
          id,
        },
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };

      await axios(options);

      toastMessage("success", "Question deleted successfully");
    } catch (error) {
      toastMessage(
        "error",
        "Question delete failed -- ERROR " + error?.response?.data
      );
    }
  };

  render() {
    return (
      <div className="form-container">
        {this.state.isLoading && <LoadingSpinner />}
        {this.state.questions.map((question, q) => {
          return this.renderQuestion(question, q);
        })}
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
      </div>
    );
  }
}
const mapPropsToState = (state) => {
  const { filters } = state.Filters;
  return {
    filters,
  };
};
export default connect(mapPropsToState)(QuestionForm);
