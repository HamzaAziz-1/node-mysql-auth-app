import React,{useState,useEffect} from "react";
import Layout from "./Layout";
import { getProducts } from "./apiProducts";
import ProductsCard from "./ProductsCard";
import Search from "./Search";
const Home = () =>
{
    
    const [productsByArrival, setProductsByArrival] = useState([]);
    const [error, setError] = useState(false);

    const loadProducts = () => {
        getProducts('createdAt').then(data => {
            if (data.error) {
                setError(data.error)
            }
            else {
                setProductsByArrival(data)
            }
                
        });
    }

    useEffect(() => {
        loadProducts(); 
    },[])
    return (
      <Layout
        title="Home Page"
        description="Online Shopping Website"
        className={"container-fluid"}
      >
        <Search />
        <div className="text-center container-fluid">

        <h2 className="mb-5 h2 font-weight-bold">Products</h2>
        
        <div className="row" >
          {productsByArrival.map((product, i) => (
            <div key={i} className="col-md-3 mb-3">
              <ProductsCard product={product} />
            </div>
          ))}
        </div>
        </div>
      </Layout>
    );
}
   

export default Home;
