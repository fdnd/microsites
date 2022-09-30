require('dotenv').config()
const { graphql } = require('@octokit/graphql')
const fs = require('fs')
const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: 'token ' + process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
  },
})
let repos = []

graphqlWithAuth(`{
  organization(login: "fdnd") {
    repositories(
      privacy: PUBLIC
      first: 100
      orderBy: {field: NAME, direction: ASC}
    ) {
      nodes {
        name
        url
        description
      }
    }
  }
}`)
  .then((result) => {
    repos = Object.values(result.organization.repositories.nodes).filter(
      (repo) => repo.name.includes('.fdnd.nl')
    )
  })
  .catch((error) => {
    console.log(
      'GitHub API Request failed: ',
      error.request,
      '\n',
      error.message
    )
  })
  .finally(() => {
    fs.writeFile('data.json', JSON.stringify(repos), function (err) {
      if (err) {
        console.error('Crap happens')
      }
    })
  })
