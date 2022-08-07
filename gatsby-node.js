const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MiistaExportJson`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })

    createNodeField({
      node,
      name: `name`,
      value: node.name,
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions
    const result = await graphql(`
      query {
        allMiistaExportJson {
            edges {
              node {
                node {
                  name
                }
              }
            }
          }
      }
    `)
  
    result.data.allMiistaExportJson.edges.forEach(({ node }) => {
      createPage({
        path: node.node.name,
        component: path.resolve(`./src/templates/items-list.js`),
        context: {
          // Data passed to context is available
          // in page queries as GraphQL variables.
          slug: node.node.name,
        },
      })
    })

  // Create listing pages
  const items = result.data.allMiistaExportJson.edges;
  const itemsPerPage = 12;
  const numPages = Math.ceil(items.length / itemsPerPage);
  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/items` : `/items/${i + 1}`,
      component: path.resolve("./src/templates/items-list.js"),
      context: {
        limit: itemsPerPage,
        skip: i * itemsPerPage,
        numPages,
        currentPage: i + 1,
      },
    });
  });
  }