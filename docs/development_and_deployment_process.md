# Development and deployment process

The analytics.usa.gov system components follow a Continuous Delivery (CD) model
for feature development and deployment.

In this project's implementation of CD, the basic idea is the following:

- The "develop" git branch represents the current state of the deployed
development environment.
- The "staging" git branch represents the current state of the deployed
staging environment.
- The "master" git branch represents the current state of the deployed
production environment.

Commits added to the branches described above automatically deploy to the
corresponding application environment.

The process for creating new features and promoting them through the application
environments should follow the steps below:

- [New feature request](#new-feature-request)
- [Feature development and testing](#feature-development-and-testing)
- [Feature review and acceptance](#feature-review-and-acceptance)
- [Deploying the feature to production](#deploying-the-feature-to-production)

## New feature request

An Issue describing or requesting a change in functionality is created in
GitHub or another project tracking tool and the System Owner triages to ensure
that it is a well-formed User Story.

When the story is determined to be well formed and has been prioritized, then a
developer is assigned to or assigns themselves to implement the feature.

## Feature development and testing

A developer creates a new branch off of “develop”. This branch is typically
named "feature/descriptive_name_of_the_feature". During implementation of the
feature, this branch should be pushed to the remote repository and a Pull
Request (PR) should be created to request merging the feature to the develop
branch. The PR may be marked as a draft to ensure that it is not merged until
the feature implementation is complete.

The PR creation allows for another developer to review the changes in progress
and make suggestions as development continues.

The feature branch may also contain a commit which allows the feature to be
deployed to the dev environment via CI for testing purposes. This commit
should be removed from the branch before merging to develop. (This is necessary
because GitHub Actions don't provide a nice way to run the deployment workflow
manually from the repository web UI, so you must set the workflow to deploy the
feature branch automatically instead of develop and then revert the change
later.)

The developer completes initial implementation, ensures the changes pass CI
quality scans, tests their changes in the development environment, and requests
another developer to review/approve the PR.

## Feature review and acceptance

A developer conducts code review of the feature, and may make suggestions for
changes on the PR. When the PR has been approved by the reviewer, then the
feature is ready to submit to the System Owner for acceptance.

The feature is deployed to the development environment and the System Owner
performs acceptance testing in this environment. If changes are requested by the
System Owner, then the feature moves back to [Feature development and testing](#feature-development-and-testing).

When the System Owner accepts the feature, then the feature branch is merged to
the develop branch (if a commit on the branch exists for deploying the feature
branch to the dev environment, it should be removed before merging to develop).
The System's Owner acceptance of the feature signifies that the
staging/production deployment process can begin for the feature.

## Deploying the feature to production

In preparation for deployment for production, testing must be done in the
staging environment (which is meant to be a replica of the production
environment).

A PR should be created to merge the develop branch into the staging branch. When
the feature has been deployed to the development environment and smoke tested
there successfully, the PR to merge the develop branch into the staging branch
can be merged.

Merging to the staging branch will cause the feature to be deployed to the
staging environment for final testing of the feature. When testing in staging is
complete, a PR is created to merge the staging branch into the master branch.

Merging to the master branch will cause the feature to be deployed to the
production environment. Smoke testing should be done in production to ensure
there were no issues with deployment. Afterwards, the feature is complete and
live. The issue describing the feature should now be marked as completed.

