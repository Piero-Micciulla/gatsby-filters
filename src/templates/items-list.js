import React, {useState} from 'react'
import { graphql, Link } from "gatsby"
import Card from "../components/Card"
import "./items-list.scss"

export default function ItemsList({data, pageContext}){
    const items = data.allMiistaExportJson.edges;
    const { currentPage, numPages } = pageContext;
    const isFirst = currentPage === 1;
    const isLast = currentPage === numPages;
    const prevPagePath = currentPage - 1 === 1 ? '/items/' : '/items/' + (currentPage - 1).toString();
    const nextPagePath = '/items/' + (currentPage + 1).toString(); 
    //logic for filters
    const allProductsCategories = [...new Set(items.flatMap(item => item.node.node.categoryTags))].filter(item => item !== null);
    console.log(allProductsCategories);

    //state
    const [productsCategories, setProductsCategories] = useState([]);
    const [productPriceRange, setProductPriceRange] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState(items);
    

    return(
        <>
          <table>
            <tr>
              <td>
                Minimum Product Price:
                <input
                  name="minProductPrice"
                  type="text"
                  // value={carPrice}
                  // onChange={onChange}
                />
              </td>
              <td>
                Maximum Product Price:
                <input
                  name="maxProductPrice"
                  type="text"
                  // value={carPrice}
                  // onChange={onChange}
                />
              </td>
              <td>
                Category :
                <select
                  name="category"
                  // value={price_category}
                  // onChange={onChange}
                >
                {
                  allProductsCategories.map(category => {
                    return <option>{category}</option>
                  })
                }
                </select>
              </td>
              <td>:</td>
            </tr>
          </table>
          <div className="cards-grid">
              {items.map((item, index) => {
                  return <Card key={index} item={item.node.node} />
              })}
          </div>
          <div className="pagination-buttons-container">
              <Link className={ isFirst? 'disabled' : '' } to={prevPagePath}>Prev</Link>
              <Link className={ isLast? 'disabled' : '' } to={nextPagePath}>Next</Link>
          </div>
        </>
    )
}

export const pageQuery = graphql`
  query itemPageQuery($skip: Int!, $limit: Int!) {
    allMiistaExportJson(
        limit: $limit
        skip: $skip
        )  {
        edges {
          node {
            node {
                categoryTags
                colorFamily {
                  name
                }
                name
                shopifyProductEu {
                  variants {
                    edges {
                      node {
                        price
                      }
                    }
                  }
                }
                thumbnailImage {
                  file {
                    url
                  }
                }
              }
          }
        }
      }
    }
`; 