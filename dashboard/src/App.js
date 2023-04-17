import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

//screens
import LoginScreen from "./app/screen/LoginScreen";
import HomeDashBoardScreen from "./app/screen/HomeDashBoardScreen";
import AnalyticsScreen from "./app/screen/AnalyticsScreen";
import SplashScreen from "./app/screen/SplashScreen";
import OrganizationScreen from "./app/screen/OrganizationScreen";
import SurveyScreen from "./app/screen/SurveyScreen";
import QuestionScreen from "./app/screen/QuestionScreen";
import AnswerScreen from "./app/screen/AnswerScreen";
import UsersScreen from "./app/screen/UsersScreen";
import AccountScreen from "./app/screen/AccountScreen";
import LiveMapScreen from "./app/screen/LiveMapScreen";
import PerformanceScreen from "./app/screen/PerformanceScreen";
import ReportScreen from "./app/screen/ReportScreen";

const createBrowserHistory = require("history").createBrowserHistory;

function App() {
  return (
    <div className="App">
      <Router history={createBrowserHistory({ queryKey: false })}>
        <Switch>
          <Route exact path="/" component={SplashScreen} />
          <Route exact path="/login" component={LoginScreen} />
          <Route
            path="/dashboard"
            render={(props) => {
              const { url } = props.match;
              console.log({ url });
              return (
                <HomeDashBoardScreen {...props}>
                  <Route
                    exact
                    path={`${url}/home`}
                    component={AnalyticsScreen}
                  />
                  <Route
                    exact
                    path={`${url}/home/organizations`}
                    component={OrganizationScreen}
                  />
                  <Route
                    exact
                    path={`${url}/home/surveys/analytics`}
                    component={AnalyticsScreen}
                  />
                  <Route
                    exact
                    path={`${url}/surveys/all_surveys`}
                    component={SurveyScreen}
                  />
                  <Route
                    exact
                    path={`${url}/surveys/questions`}
                    component={QuestionScreen}
                  />
                  <Route
                    exact
                    path={`${url}/surveys/answers`}
                    component={AnswerScreen}
                  />
                  <Route
                    exact
                    path={`${url}/accounts`}
                    component={UsersScreen}
                  />
                  <Route
                    exact
                    path={`${url}/settings`}
                    component={AccountScreen}
                  />
                  <Route
                    exact
                    path={`${url}/home/map`}
                    component={LiveMapScreen}
                  />
                  <Route
                    exact
                    path={`${url}/home/performance`}
                    component={PerformanceScreen}
                  />
                  <Route
                    exact
                    path={`${url}/home/report`}
                    component={ReportScreen}
                  />
                </HomeDashBoardScreen>
              );
            }}
          />
        </Switch>
      </Router>
      <ToastContainer
        autoClose={5000}
        hideProgressBar={true}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        progress={undefined}
      />
    </div>
  );
}

export default App;
