import React from "react";
import ReactDom from "react-dom";
import superagent from "superagent";
import _ from "lodash";

class EnvironmentPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deployEnv: null,
      tag: null
    };
    this.render = require("./environment.rt");
  }

  getPublishers() {
    var self = this;
    superagent
      .get("/api/deploy_environments/" + self.props.deployEnvironmentId + ".json")
      .end((err, response) => {
        let deployEnvironment = response.body.deploy_environment
        let latestDeployment = _.first(deployEnvironment.deployments);
        let stateToSet = {}
        stateToSet['deployEnv'] = deployEnvironment
        if (latestDeployment){
          stateToSet['tag'] = latestDeployment.version
        }
        self.setState(stateToSet)
      });
  }

  componentDidMount() {
    this.getPublishers()
  }

  setTag(e) {
    this.setState({tag:  e.target.value});
  }

  deploy(env) {
    var version = this.state.tag;

    if(this.state.deploying)
      return;

    if(!version || version == "")
      return;

    this.setState({deploying: true});

    superagent
      .post("/api/deployments.json")
      .send({
	deployment: {
	  deploy_environment_id: env.id,
	  version: version
	}
      })
      .end((err, response) => window.location = "/deploy/" + response.body.deployment.id);
  }
};

module.exports = function createComponent(container, deployEnvironmentId) {
  ReactDom.render(React.createElement(EnvironmentPage, {deployEnvironmentId: deployEnvironmentId}), container);
};
