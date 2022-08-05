import * as React from "react"
import JSONData from '../content/miista-export.json'
import Card from "../components/Card"
import "./index.scss"

const IndexPage = () => {
  return (
    <main className="card-grid">
      {
        JSONData.data.allContentfulProductPage.edges.map((data, index) => {
          return <Card key={index} item={data.node} />
        })
      }
    </main>
  )
}

export default IndexPage

export const Head = () => <title>Home Page</title>
