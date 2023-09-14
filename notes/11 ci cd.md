# Intro

## Continuous Integration (CI)

Strictly speaking, CI refers to merging developer changes to the main branch often, Wikipedia even helpfully suggests: "several times a day". This is usually true but when we refer to CI in industry, we're quite often talking about what happens after the actual merge happens.

We'd likely want to do some of these steps:

- Lint: to keep our code clean and maintainable
- Build: put all of our code together into runnable - software bundle
- Test: to ensure we don't break existing features
- Package: Put it all together in an easily movable batch
- Deploy: Make it available to the world

## Continuous Delivery/Deployment (CD)

In general, we refer to CD as the practice where the main branch is kept deployable at all times. In general, this is also frequently coupled with automated deployments triggered from merges into the main branch.

## Principles

It's important to remember that CI/CD is not the goal. The goal is better, faster software development with fewer preventable bugs and better team cooperation.

To that end, CI should always be configured to the task at hand and the project itself. The end goal should be kept in mind at all times. You can think of CI as the answer to these questions:

- How to make sure that tests run on all code that will be deployed?
- How to make sure that the main branch is deployable at all times?
- How to ensure that builds will be consistent and will always work on the platform it'd be deploying to?
- How to make sure that the changes don't overwrite each other?
- How to make deployments happen at the click of a button or automatically when one merges to the main branch?

1. Documented behavior

- There's an old joke that a bug is just an "undocumented feature". We'd like to avoid that. We'd like to avoid any situations where we don't know the exact outcome.

2. Know the same thing happens every time

- We need to guarantee that the tests will run and we need to be sure that they run against the code that will actually be deployed. For example, it's no use if the tests are only run against Alice's branch if they would fail after merging to the main branch. We're deploying from the main branch so we need to make sure that the tests are run against a copy of the main branch with Alice's changes merged in.

3. Code always kept deployable

- Having code that's always deployable makes life easier. This is especially true when the main branch contains the code running in the production environment. For example, if a bug is found and it needs to be fixed, you can pull a copy of the main branch (knowing it is the code running in production), fix the bug, and make a pull request back to the main branch. This is relatively straight forward.

4. Knowing what code is deployed (sha sum/version)

- Knowing what code is deployed (sha sum/version)
  It's often important to know what is actually running in production. Ideally, as we discussed above, we'd have the main branch running in production. This is not always possible. Sometimes we intend to have the main branch in production but a build fails, sometimes we batch together several changes and want to have them all deployed at once. What we need in these cases (and is a good idea in general) is to know exactly what code is running in production. Sometimes this can be done with a version number, sometimes it's useful to have the commit _SHA sum_ (uniquely identifying hash of that particular commit in git) attached to the code.

## Types of CI Setup

To meet some of the requirements listed above, we want to dedicate a separate server for running the tasks in continuous integration. Having a separate server for the purpose minimizes the risk that something else interferes with the CI/CD process and causes it to be unpredictable.

### Jenkins (and other self-hosted setups)

Among the self-hosted options, Jenkins is the most popular. It's extremely flexible and there are plugins for almost anything (except that one thing you want to do). This is a great option for many applications, using a self-hosted setup means that the entire environment is under your control, the number of resources can be controlled, secrets (we'll elaborate a little more on security in later sections of this part) are never exposed to anyone else and you can do anything you want on the hardware.

Unfortunately, there is also a downside. Jenkins is quite complicated to set up. It's very flexible but that means that there's often quite a bit of boilerplate/template code involved to get builds working. With Jenkins specifically, it also means that CI/CD must be set up with Jenkins' own domain-specific language. There are also the risks of hardware failures which can be an issue if the setup sees heavy use.

With self-hosted options, the billing is usually based on the hardware. You pay for the server. What you do on the server doesn't change the billing.

## GitHub Actions and other cloud-based solutions

In a cloud-hosted setup, the setup of the environment is not something you need to worry about. It's there, all you need to do is tell it what to do. Doing that usually involves putting a file in your repository and then telling the CI system to read the file (or to check your repository for that particular file).

The actual CI config for the cloud-based options is often a little simpler, at least if you stay within what is considered "normal" usage. If you want to do something a little bit more special, then cloud-based options may become more limited, or you may find it difficult to do that one specific task for which the cloud platform just isn't built for.

# Github Actions

GitHub Actions work on a basis of workflows. A _workflow_ is a series of jobs that are run when a certain triggering event happens. The jobs that are run then themselves contain instructions for what GitHub Actions should do.

A typical execution of a workflow looks like this:

- _Triggering_ event happens (for example, there is a push to the main branch). The workflow with that trigger is executed.
- Cleanup
- Basic needs

In general, to have CI operate on a repository, we need a few things:

- A repository (obviously)
- Some definition of what the CI needs to do: This can be in the form of a specific file inside the repository or it can be defined in the CI system
- The CI needs to be aware that the repository (and the configuration file within it) exist
- The CI needs to be able to access the repository
- The CI needs permissions to perform the actions it is supposed to be able to do: For example, if the CI needs to be able to deploy to a production environment, it needs credentials for that environment.

## Workflows

The core component of creating CI/CD pipelines with GitHub Actions is something called a _Workflow_. Workflows are process flows that you can set up in your repository to run automated tasks such as building, testing, linting, releasing, and deploying to name a few! The hierarchy of a workflow looks as follows:

**Workflow**

- Job
  - Step
  - Step
- Job
  - Step

### YAML Syntax

https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html

A basic workflow contains three elements in a YAML document. These three elements are:

- name: Yep, you guessed it, the name of the workflow
- (on) triggers: The events that trigger the workflow to be executed
- jobs: The separate jobs that the workflow will execute (a basic workflow might contain only one job).

A simple workflow definition looks like this:

    name: Hello World!

    on:
      push:
        branches:
          - master
          # note that your "main" branch might be called main instead of master

    jobs:
      hello_world_job:
        runs-on: ubuntu-20.04
        steps:
          - name: Say hello
            run: |
              echo "Hello World!"

You can configure a workflow to start once (https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows):

- An event on GitHub occurs such as when someone pushes a commit to a repository or when an issue or pull request is created
- A scheduled event, that is specified using the cron-syntax, happens
- An external event occurs, for example, a command is performed in an external application such as Slack or Discord messaging app

# Deployment

It's important to remember this when we plan out our deployment system. Some of the things we'll need to consider could include:

- What if my computer crashes or hangs during deployment?
- I'm connected to the server and deploying over the internet, what happens if my internet connection dies?
- What happens if any specific instruction in my deployment script/system fails?
- What happens if, for whatever reason, my software doesn't work as expected on the server I'm deploying to? Can I roll back to a previous version?
- What happens if a user does an HTTP request to our software just before we do deployment (we didn't have time to send a response to the user)?

## What does a good deployment system do?

Defining definitive rules or requirements for a deployment system is difficult, let's try anyway:

- Our deployment system should be able to fail gracefully at any step of the deployment.
- Our deployment system should never leave our software in a broken state.
- Our deployment system should let us know when a failure has happened. It's more important to notify about failure than about success.
- Our deployment system should allow us to roll back to a previous deployment
  - Preferably this rollback should be easier to do and less prone to failure than a full deployment
  - Of course, the best option would be an automatic rollback in case of deployment failures
- Our deployment system should handle the situation where a user makes an HTTP request just before/during a deployment.
- Our deployment system should make sure that the software we are deploying meets the requirements we have set for this (e.g. don't deploy if tests haven't been run).

Let's define some things we want in this hypothetical deployment system too:

- We would like it to be fast
- We'd like to have no downtime during the deployment (this is distinct from the requirement we have for handling user requests just before/during the deployment).

## Steps (Fly.io)

With Github Actions: https://fly.io/docs/app-guides/continuous-deployment-with-github-actions/

    fly auth token

Each deployment in Fly.io creates a release. Releases can be checked from the command line:

    flyctl releases

# Versioning

## Semantic versioning

Version is in the form `{major}.{minor}.{patch}`

- **patch** - fix the functionality without changing how the application works from the outside
- **minor** - changes that make small changes to functionality (as viewed from the outside)
- **major** - changes that completely change the application (or major functionality changes)

## Hash versioning

_Hash versioning_ (also sometimes known as SHA versioning) is quite different. In Git, this is already done for you as the commit hash that is unique for any change set.

Hash versioning is almost always used in conjunction with automation. It's a pain (and error-prone) to copy 32 character long version numbers around to make sure that everything is correctly deployed.

## Using variables in Github Actions

https://stackoverflow.com/questions/57819539/github-actions-how-to-share-a-calculated-value-between-job-steps
