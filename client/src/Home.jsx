import React,{useState,useEffect} from "react";
import Layout from "./Layout";

const Home = () =>
{
    
   
    const [error, setError] = useState(false);

   

   
    return (
      <Layout
        title="Home Page"
        description="My Website"
        className={"container-fluid"}
      >
       
        <div className="text-center container-fluid">

        {/* <h2 className="mb-5 h2 font-weight-bold"></h2> */}
        
        
        </div>
       
      </Layout>
    );
}
   

export default Home;
