const core = require("@actions/core");
const github = require("@actions/github");

try {
  // @Main
  const token = core.getInput("token");
  const title = core.getInput("title");
  const body = core.getInput("body");
  /** assignees in out inputs can not be an array only a string */
  const assignees = core.getInput("assignees");

  // @Sending Request
  // api github rest api => https://octokit.github.io/rest.js/v18
  // this is by default built in @actions/github
  const octokit = github.getOctokit(token);
  const { owner, repo } = github.context.repo;
  octokit.rest.issues.create({
    owner,
    repo,
    title,
    body,
    assignees: assignees ? assignees.split(",") : [],
  }).then((res) => {
    core.startGroup('Logging Response');
    console.log(JSON.stringify(res.data, null, 4));
    core.endGroup();

    core.setOutput("issue", JSON.stringify(res.data));
  }).catch((e) => {
    console.log(e);
    core.setFailed(e.message);
  })

} catch (error) {
  core.setFailed(error.message);
}
