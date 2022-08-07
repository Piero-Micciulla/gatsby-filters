import * as React from "react"
import './card.scss'

export default function Card({ item }) {
    console.log(item.name)
    return (
        <>
            <div className="card">
                <h3>{item.name}</h3>
                <img src={item.thumbnailImage.file.url} alt={item.name} width="300px" height="400px" />
                <ul>
                    {
                        //checking if the item has a color family
                        item.colorFamily !== null &&
                        item.colorFamily.map((color, index) => {
                            return <li key={index}>{color.name}</li>
                        })
                    }
                </ul>
                <ul>
                    {
                        //checking if the item has categories
                        item.categoryTags !== null &&
                        item.categoryTags.map((tag, index) => {
                        return <li key={index}>{tag}</li>
                    })
                    }
                </ul>
                <ul>
                    {item.shopifyProductEu.variants.edges.map((price, index) => {
                        return <li key={index}>{price.node.price}</li>
                    })}
                </ul>
            </div>
        </>
    )
}
