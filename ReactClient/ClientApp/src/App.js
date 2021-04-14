import React, { Component } from "react";
import { Route } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./Views/Home";
import { Dashboard } from "./Views/Dashboard";
import Login from "./Views/Login";
import Signup from "./Views/Signup";
import ProjectStatus from "./Views/ProjectStatus";
import PeerEvaluation from "./Views/PeerEvaluation";
import CreateProject from "./Views/CreateProject";
import ViewProjects from "./Views/ViewProjects";
import EditStudentInfo from "./Views/EditStudentInfo";
import ForgotPassword from "./Views/ForgotPassword";
import ViewPeerEvaluation from "./Views/ViewPeerEvaluation";
import "./custom.css";

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path="/" component={Home} />
        <Route
          exact
          path="/dashboard"
          component={(studentId) => {
            studentId = localStorage.getItem("id");
            return <Dashboard studentId={studentId} />;
          }}
        />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route exact path="/project-status" component={ProjectStatus} />
        <Route exact path="/create-project" component={CreateProject} />
        <Route exact path="/view-project" component={ViewProjects} />
        <Route exact path="/view-peerevaluation" component={ViewPeerEvaluation} />
        <Route
          exact
          path="/edit-student"
          component={(studentId) => {
            studentId = localStorage.getItem("id");
            return <EditStudentInfo studentId={studentId} />;
          }}
        />
        <Route exact path="/peer-evaluation" component={PeerEvaluation} />
      </Layout>
    );
  }
}
