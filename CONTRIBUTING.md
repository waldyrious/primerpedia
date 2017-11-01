## Contribution guidelines

**Primerpedia** is a community project and welcomes contributions of any type and size:
code, documentation, bug reports, etc. No improvement is too small!

One of the main goals of the project is to remain simple, well documented
and easy to experiment with directly in the browser, without setting up a server.

### Instructions for contributors

- By contributing to this repository, you agree to license your contributions
  under the terms of the project's open source license (the [ISC License]).

- If you're contributing prose / documentation,
  make sure to break lines following the [semantic linefeeds] principle.

### Instructions for maintainers

- Strive to be welcoming to contributors: be patient, avoid excessive nitpicking,
  and in general use language that conveys a sense of common ownership of the project.

- Pull requests should normally be merged using the [semi-linear workflow].
  This means rebasing the PR on top of the latest `gh-pages` branch, and merging with `--no-ff`.
  - Whenever a rebase is done, make sure to force-push the rebased branch first,
    and only then the merge (or do the merge using the web UI),
	otherwise GitHub won't be able to automatically detect the merge.
  - If no commits have been made to `gh-pages` since the commits in the PR,
  then the "Merge" button of GitHub's web interface can be used to do this.

- Returning contributors should be given collaborator status in the repository.
  This ensures the long-term viability of the project, as people's availability will naturally change over time.
  As a rule of thumb, this should be done once the second pull request is merged.
  Any collaborator can add new ones by editing the [settings.yml] file.

[ISC License]: https://github.com/waldyrious/primerpedia/blob/gh-pages/LICENSE.md
[semantic linefeeds]: http://rhodesmill.org/brandon/2012/one-sentence-per-line/
[semi-linear workflow]: http://www.bitsnbites.eu/a-tidy-linear-git-history/
[settings.yml]: https://github.com/waldyrious/primerpedia/blob/gh-pages/.github/settings.yml
