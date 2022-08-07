import React, {useState, useEffect} from 'react'
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
    const allProductsColor = [...new Set(items.flatMap(item => {
      if (item.node.node.colorFamily){
        return item.node.node.colorFamily[0].name
      }
    }))].filter(item => item !== undefined);
    //state
    const [productsCategory, setProductsCategory] = useState("");
    const [productsColor, setProductsColor] = useState("");
    const [productPriceRange, setProductPriceRange] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState(items);


    function handleCategoryChange(e){
      setProductsCategory(e.target.value);
    }

    function handleColorChange(e){
      setProductsColor(e.target.value);     
    }

    // console.log(productsColor);

    function colorFilter(array){   
        if(productsColor === ""){
          return filteredProducts
        }      
        return array.filter(item => {
          if(item.node.node.colorFamily){       
              return item.node.node.colorFamily[0].name === productsColor;
          }
        })       
    }

    function categoryFilter(array){   
      if(productsCategory === ""){
        return filteredProducts
      }      
      return array.filter(item => {
        if(item.node.node.categoryTags !== null){       
          return item.node.node.categoryTags.includes(productsCategory);
        }
      })       
    }

    useEffect(() => {
      const productFilteredByColor = colorFilter(filteredProducts);
      const productFilteredByCategory = categoryFilter(productFilteredByColor);

      setFilteredProducts(productFilteredByCategory);
    },[productsColor, productsCategory])
    
    return(
        <>
          <table>
            <tr>
              <td>
                Category :
                <select
                  name="category"
                  value={productsCategory}
                  onChange={handleCategoryChange}
                >
                {
                  allProductsCategories.map(category => {
                    return <option>{category}</option>
                  })
                }
                </select>
              </td>
              <td>:</td>
              <td>
                Color :
                <select
                  name="color"
                  value={productsColor}
                  onChange={handleColorChange}
                >
                {
                  allProductsColor.map(color => {
                    return <option>{color}</option>
                  })
                }
                </select>
              </td>
              <td>:</td>
            </tr>
          </table>
          <div className="cards-grid">
              {filteredProducts.map((item, index) =>{
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